import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { markLessonComplete } from "./actions";
import { LessonPlayerClient } from "./LessonPlayerClient";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch lesson details
  const { data: lesson } = await supabase.from('lessons').select('*').eq('id', lessonId).single();
  const { data: course } = await supabase.from('available_courses').select('title, thumbnail_url').eq('id', courseId).single();
  const { data: progress } = await supabase.from('lesson_progress').select('id').eq('lesson_id', lessonId).eq('user_id', user.id).single();
  const isCompleted = !!progress;

  if (!lesson) {
    return <div className="p-10 text-white">Lesson not found.</div>;
  }

  // Convert YouTube/Vimeo URLs to embed URLs if it's a link
  let embedUrl = lesson.video_url;
  if (lesson.video_type !== 'upload' && embedUrl) {
    if (embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    } else if (embedUrl.includes('youtu.be/')) {
      embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
  }

  const materials = lesson.materials || [];

  return (
    <LessonPlayerClient
      courseId={courseId}
      lessonId={lessonId}
      lesson={lesson}
      course={course}
      isCompleted={isCompleted}
      embedUrl={embedUrl}
      materials={materials}
      markCompleteAction={markLessonComplete}
    />
  );
}
