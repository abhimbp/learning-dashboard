'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth-helpers";

export async function createLesson(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    return { error: 'Unauthorized' };
  }

  const courseId = formData.get('course_id') as string;
  const title = formData.get('title') as string;
  const durationMinutes = parseFloat(formData.get('duration_minutes') as string || '0');
  const orderIndex = parseInt(formData.get('order_index') as string || '1');
  
  const videoType = formData.get('video_type') as string; // 'link' or 'upload'
  const videoUrl = formData.get('video_url') as string;
  const materialsJson = formData.get('materials') as string; // Stringified array

  let materials = [];
  try {
    if (materialsJson) materials = JSON.parse(materialsJson);
  } catch(e) {}

  const { error } = await supabase.from('lessons').insert({
    course_id: courseId,
    title,
    duration_minutes: durationMinutes,
    order_index: orderIndex,
    video_type: videoType,
    video_url: videoUrl,
    materials
  });

  if (error) {
    console.error("Lesson creation failed:", error);
    return { error: error.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function updateLesson(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    return { error: 'Unauthorized' };
  }

  const courseId = formData.get('course_id') as string;
  const lessonId = formData.get('lesson_id') as string;
  const title = formData.get('title') as string;
  const durationMinutes = parseFloat(formData.get('duration_minutes') as string || '0');
  
  const videoType = formData.get('video_type') as string;
  const videoUrl = formData.get('video_url') as string;
  const materialsJson = formData.get('materials') as string;

  let materials = [];
  try {
    if (materialsJson) materials = JSON.parse(materialsJson);
  } catch(e) {}

  const { error } = await supabase.from('lessons').update({
    title,
    duration_minutes: durationMinutes,
    video_type: videoType,
    video_url: videoUrl,
    materials
  }).eq('id', lessonId);

  if (error) {
    console.error("Lesson update failed:", error);
    return { error: error.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteLesson(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    return { error: 'Unauthorized' };
  }

  const courseId = formData.get('course_id') as string;
  const lessonId = formData.get('lesson_id') as string;

  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);

  if (error) {
    console.error("Lesson deletion failed:", error);
    return { error: error.message };
  }

  revalidatePath(`/admin/courses/${courseId}`);
}
