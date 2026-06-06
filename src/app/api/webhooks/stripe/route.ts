import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !endpointSecret || !signature) {
    return NextResponse.json({ error: 'Missing Stripe secrets or signature' }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      // In webhooks we often need a service role key to write to DB if RLS blocks it,
      // but since we are running server-side we can create an admin client, or if RLS allows it:
      const supabase = await createClient(); 
      await supabase.from('purchases').upsert({
        user_id: userId,
        course_id: courseId,
        stripe_session_id: session.id
      }, { onConflict: 'user_id, course_id' });
    }
  }

  return NextResponse.json({ received: true });
}
