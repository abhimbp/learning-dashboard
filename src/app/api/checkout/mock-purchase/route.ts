import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const courseId = formData.get('courseId') as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Simulate a successful purchase by writing to the database
  const { error } = await supabase.from('purchases').upsert({
    user_id: user.id,
    course_id: courseId,
    stripe_session_id: 'mock_session_' + Date.now()
  }, { onConflict: 'user_id, course_id' });
  
  if (error) {
    console.error("Mock purchase failed:", error);
    // If the table doesn't exist, alert the user via URL parameter
    return NextResponse.redirect(new URL(`/courses/${courseId}?error=db_missing`, request.url));
  }

  return NextResponse.redirect(new URL(`/courses/${courseId}?success=true`, request.url));
}
