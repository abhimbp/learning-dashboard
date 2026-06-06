import { createClient } from "@/utils/supabase/server";
import { PlayCircle, CheckCircle, Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseReviewSection } from "./CourseReviewSection";

export default async function CourseOverviewPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const supabase = await createClient();

  // Fetch course details
  const { data: course } = await supabase.from('available_courses').select('*').eq('id', courseId).single();
  
  if (!course) {
    return <div className="p-10 text-white">Course not found.</div>;
  }

  // Fetch lessons for this course
  const { data: lessons } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index', { ascending: true });

  // Fetch reviews
  const { data: reviews } = await supabase.from('course_reviews').select('*').eq('course_id', courseId).order('created_at', { ascending: false });

  // Fetch user progress and purchase status
  const { data: { user } } = await supabase.auth.getUser();
  let completedLessons: string[] = [];
  let hasPurchased = false;
  
  if (user) {
    const { data: progress } = await supabase.from('user_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true);
    if (progress) {
      completedLessons = progress.map(p => p.lesson_id);
    }

    const { data: purchase } = await supabase.from('purchases').select('*').eq('user_id', user.id).eq('course_id', courseId).single();
    if (purchase) {
      hasPurchased = true;
    }
  }

  // Allow admins or instructors to bypass (for testing purposes, we assume free access if you just created it, but let's strictly rely on purchase for demo)
  // We'll set hasPurchased to true by default for demo if they haven't set up Stripe yet. 
  // Let's actually enforce the paywall.

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
        <img src={course.thumbnail_url} alt={course.title} className="w-full md:w-1/3 aspect-video object-cover rounded-2xl shadow-xl" />
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-xs text-primary-400 font-medium mb-4 uppercase tracking-wider">
            {course.level}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">{course.title}</h1>
          <p className="text-gray-400 mb-6">Instructor: <span className="text-white">{course.instructor}</span> • {course.duration_hours} Hours</p>
          
          {course.description && (
            <div className="prose prose-invert max-w-none mb-8 text-gray-300">
              <p className="whitespace-pre-wrap">{course.description}</p>
            </div>
          )}

          <div className="flex gap-4">
            {hasPurchased ? (
              lessons && lessons.length > 0 ? (
                <Link href={`/courses/${courseId}/lessons/${lessons[0].id}`} className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" /> Start Learning
                </Link>
              ) : (
                <button disabled className="px-8 py-3 bg-surface-800 text-gray-500 font-bold rounded-xl flex items-center gap-2 cursor-not-allowed">
                  No lessons added yet
                </button>
              )
            ) : (
              <form action={`/checkout/${courseId}`}>
                <button type="submit" className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Buy Course for ₹3999
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface-900/50 border border-white/5 rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
        <div className="flex flex-col gap-3">
          {lessons?.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            return hasPurchased ? (
              <Link key={lesson.id} href={`/courses/${courseId}/lessons/${lesson.id}`} className="group flex items-center justify-between p-4 bg-surface-800 hover:bg-surface-700 rounded-2xl border border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-primary-500/10 text-primary-400'}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-primary-400 transition-colors">
                      {index + 1}. {lesson.title}
                    </h4>
                    <p className="text-xs text-gray-500">{lesson.duration_minutes} min</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={lesson.id} className="flex items-center justify-between p-4 bg-surface-900/50 rounded-2xl border border-white/5 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-800 text-gray-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-300 text-sm">
                      {index + 1}. {lesson.title}
                    </h4>
                    <p className="text-xs text-gray-500">{lesson.duration_minutes} min</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {(!lessons || lessons.length === 0) && (
             <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
               The instructor hasn't uploaded any videos yet.
             </div>
          )}
        </div>
      </div>

      <CourseReviewSection 
        courseId={courseId} 
        hasPurchased={hasPurchased} 
        reviews={reviews || []}
        userId={user?.id}
      />
    </div>
  );
}
