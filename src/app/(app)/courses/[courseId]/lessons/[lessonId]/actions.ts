'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(formData: FormData) {
  const lessonId = formData.get('lesson_id') as string;
  const courseId = formData.get('course_id') as string;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  // Insert or update progress
  await supabase.from('user_progress').upsert({
    user_id: user.id,
    lesson_id: lessonId,
    course_id: courseId,
    completed: true,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id, lesson_id' });

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/`); // Revalidate dashboard to update Activity Tile
}
