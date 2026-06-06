import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth-helpers";
import Link from "next/link";
import { ChevronLeft, Edit3, Video, FileText } from "lucide-react";
import { updateCourse } from "./actions";
import { DeleteLessonButton } from "./lessons/DeleteLessonButton";

export const revalidate = 0;

export default async function AdminCourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    redirect("/dashboard");
  }

  const { data: course } = await supabase.from('available_courses').select('*').eq('id', courseId).single();
  
  if (!course) {
    return <div className="p-10 text-white">Course not found.</div>;
  }

  const { data: lessons } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index', { ascending: true });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <Link href="/admin" className="text-primary-400 hover:text-primary-300 text-sm font-medium mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Edit Course</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Course Details Form */}
        <div className="bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5 h-fit">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Edit3 className="w-5 h-5 text-primary-400" /> Course Details</h2>
          
          <form action={async (formData) => { await updateCourse(formData); }} className="flex flex-col gap-5">
            <input type="hidden" name="course_id" value={course.id} />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Course Title</label>
              <input required name="title" defaultValue={course.title} className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Instructor Name</label>
              <input required name="instructor" defaultValue={course.instructor} className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Course Description</label>
              <textarea name="description" rows={4} defaultValue={course.description || ''} placeholder="Write a detailed description for the course..." className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors resize-none"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Duration (Hours)</label>
                <input required type="number" step="0.5" name="duration_hours" defaultValue={course.duration_hours} className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">Level</label>
                <select required name="level" defaultValue={course.level} className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            <button type="submit" className="mt-4 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Column: Lesson Manager */}
        <div className="bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-white flex items-center gap-2"><Video className="w-5 h-5 text-accent-400" /> Curriculum</h2>
             <Link href={`/admin/courses/${courseId}/lessons/new`} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
               + Add Lesson
             </Link>
          </div>

          <div className="flex flex-col gap-3">
            {lessons?.map((lesson, idx) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 bg-surface-800 rounded-2xl border border-white/5">
                <div>
                  <h4 className="font-bold text-white text-sm">{idx + 1}. {lesson.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    {lesson.video_type === 'upload' ? 'Raw Video' : 'YouTube Link'} • {lesson.duration_minutes}m
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit Lesson">
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <DeleteLessonButton courseId={courseId} lessonId={lesson.id} />
                </div>
              </div>
            ))}
            
            {(!lessons || lessons.length === 0) && (
              <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No lessons added yet. Click "+ Add Lesson" to start building the curriculum.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
