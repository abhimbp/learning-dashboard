'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkIsAdmin } from "@/lib/auth-helpers"
import { createNotification } from "@/app/(app)/notifications/actions"

export async function createCourse(formData: FormData) {
  const supabase = await createClient()

  // Verify auth (simple protection)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const instructor = formData.get('instructor') as string
  const thumbnailUrl = formData.get('thumbnail_url') as string || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
  const durationHours = parseFloat(formData.get('duration_hours') as string || '0')
  const level = formData.get('level') as string
  const tagsString = formData.get('tags') as string
  const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : []

  const { error } = await supabase.from('available_courses').insert({
    title,
    instructor,
    thumbnail_url: thumbnailUrl,
    duration_hours: durationHours,
    level,
    tags,
    rating: 0, // Default for new course
    author_id: user.id
  })

  if (error) {
    console.error("Error creating course:", error)
    return { error: error.message }
  }

  revalidatePath('/explore')
  revalidatePath('/admin')
  
  // Return success
  return { success: true }
}

export async function replyToReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !checkIsAdmin(user.email)) {
    return { error: 'Unauthorized' }
  }

  const reviewId = formData.get('review_id') as string
  const reply = formData.get('reply') as string

  const { error } = await supabase.from('course_reviews').update({ reply }).eq('id', reviewId)

  if (error) {
    console.error("Failed to reply to review:", error);
    return { error: error.message };
  }

  // Notify the student
  const { data: review } = await supabase.from('course_reviews').select('user_id, course_id, student_name').eq('id', reviewId).single();
  if (review?.user_id) {
    const { data: course } = await supabase.from('available_courses').select('title').eq('id', review.course_id).single();
    await createNotification(
      review.user_id,
      "Instructor Replied",
      `The instructor replied to your review on ${course?.title || 'a course'}.`,
      "admin_reply"
    );
  }

  revalidatePath('/admin');
  return { success: true }
}
