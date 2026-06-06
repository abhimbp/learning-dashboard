'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth-helpers";

export async function updateCourse(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    return { error: 'Unauthorized' };
  }

  const courseId = formData.get('course_id') as string;
  const title = formData.get('title') as string;
  const instructor = formData.get('instructor') as string;
  const description = formData.get('description') as string;
  const durationHours = parseFloat(formData.get('duration_hours') as string || '0');
  const level = formData.get('level') as string;

  const { error } = await supabase.from('available_courses').update({
    title,
    instructor,
    description,
    duration_hours: durationHours,
    level
  }).eq('id', courseId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/explore');
  redirect(`/admin/courses/${courseId}?success=true`);
}
