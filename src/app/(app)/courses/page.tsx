import { createClient } from "@/utils/supabase/server";
import { CourseCard } from "@/components/courses/CourseCard";
import { AlertCircle } from "lucide-react";

export const revalidate = 0;

export default async function CoursesPage() {
  const supabase = await createClient();
  let purchasedCourses: any[] = [];
  let fetchError = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("purchases")
        .select("course_id, available_courses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        purchasedCourses = data.map((p: any) => p.available_courses).filter(Boolean);
      }
    }
  } catch (error: any) {
    fetchError = error.message;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">My Courses</h1>
        <p className="text-gray-400 mt-2">Explore and manage all your active learning paths.</p>
      </div>

      {fetchError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Failed to load courses: {fetchError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {purchasedCourses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            instructor={course.instructor}
            thumbnailUrl={course.thumbnail_url}
            durationHours={course.duration_hours}
            rating={4.8} // Using mock rating for purchased courses
            level={course.level}
            tags={course.tags}
          />
        ))}
      </div>
      
      {!fetchError && purchasedCourses.length === 0 && (
        <div className="w-full border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 text-gray-500 text-center h-[300px] mt-6">
          <p className="text-lg font-medium">You haven't purchased any courses yet.</p>
          <p className="mt-2 opacity-70 max-w-md">Head over to the Explore page to find premium content!</p>
        </div>
      )}
    </div>
  );
}
