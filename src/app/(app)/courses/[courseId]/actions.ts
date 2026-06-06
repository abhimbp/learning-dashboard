'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/(app)/notifications/actions";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Must be logged in to review' };
  }

  const courseId = formData.get('course_id') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Invalid rating' };
  }

  const studentName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Student";
  const studentEmail = user.email;

  const { error } = await supabase.from('course_reviews').insert({
    course_id: courseId,
    user_id: user.id,
    rating,
    comment,
    student_name: studentName,
    student_email: studentEmail
  });

  if (error) {
    console.error("Review submission failed:", error);
    return { error: error.message };
  }

  // Notify course author
  const { data: course } = await supabase.from('available_courses').select('author_id, title').eq('id', courseId).single();
  if (course?.author_id) {
    await createNotification(
      course.author_id, 
      "New Review", 
      `${studentName} left a ${rating}-star review on ${course.title}.`, 
      "student_comment"
    );
  }

  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}
