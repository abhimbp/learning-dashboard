import { createClient } from "@/utils/supabase/server";
import { BentoGrid } from "@/components/dashboard/BentoGrid";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { CourseTile } from "@/components/dashboard/CourseTile";
import { AlertCircle } from "lucide-react";

export const revalidate = 0; // Always fetch fresh data on reload

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let courses: any[] = [];
  let fetchError = null;

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    courses = data || [];
  } catch (error: any) {
    console.error("Failed to fetch courses:", error);
    fetchError = error.message;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      {fetchError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Database connection failed. Please ensure your Supabase credentials are set in .env and the `courses` table exists.</p>
        </div>
      )}

      <BentoGrid>
        <HeroTile user={user} />
        <ActivityTile />
        
        {courses.map((course) => (
          <CourseTile key={course.id} course={course} />
        ))}
        
        {!fetchError && courses.length === 0 && (
          <div className="xl:col-span-1 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-gray-500 text-center text-sm h-full">
            <p>No courses found.</p>
            <p className="mt-2 text-xs opacity-70">Add seed data to your Supabase `courses` table!</p>
          </div>
        )}
      </BentoGrid>
    </div>
  );
}
