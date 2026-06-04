import { createClient } from "@/utils/supabase/server";
import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { CourseTile } from "@/components/dashboard/CourseTile";
import { AlertCircle } from "lucide-react";

export const revalidate = 0;

export default async function CoursesPage() {
  const supabase = await createClient();
  
  let courses: any[] = [];
  let fetchError = null;

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    courses = data || [];
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

      <BentoGrid>
        {courses.map((course) => (
          <CourseTile key={course.id} course={course} />
        ))}
        
        {!fetchError && courses.length === 0 && (
          <div className="xl:col-span-3 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 text-gray-500 text-center h-[300px]">
            <p className="text-lg font-medium">No courses found.</p>
            <p className="mt-2 opacity-70 max-w-md">Run the SQL script provided in the walkthrough to add 10 new courses to your database!</p>
          </div>
        )}
      </BentoGrid>
    </div>
  );
}
