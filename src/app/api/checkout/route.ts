import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const courseId = formData.get('courseId') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Fetch course details
  const { data: course } = await supabase.from('available_courses').select('*').eq('id', courseId).single();
  if (!course) {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    // Development Fallback: If no Stripe key is provided, simulate a successful purchase automatically.
    await supabase.from('purchases').upsert({
      user_id: user.id,
      course_id: courseId,
      stripe_session_id: 'mock_session_' + Date.now(),
      student_email: user.email,
      student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Student"
    }, { onConflict: 'user_id, course_id' });
    
    return NextResponse.redirect(new URL(`/courses/${courseId}?success=true`, request.url));
  }

  // Actual Stripe Integration
  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-05-27.dahlia' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: course.title,
              description: `Instructor: ${course.instructor}`,
              images: course.thumbnail_url ? [course.thumbnail_url] : [],
            },
            unit_amount: 399900, // ₹3999.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/courses/${courseId}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/courses/${courseId}?canceled=true`,
      metadata: {
        userId: user.id,
        courseId: courseId,
      },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.redirect(new URL(`/courses/${courseId}?error=stripe_error`, request.url));
  }
}
