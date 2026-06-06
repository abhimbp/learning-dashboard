import { createClient } from "@/utils/supabase/server";
import { CourseCard } from "@/components/courses/CourseCard";
import { Search, Filter } from "lucide-react";

export const revalidate = 0;

export default async function ExplorePage() {
  const supabase = await createClient();
  
  // Try to fetch courses from an 'available_courses' table, or fallback
  const { data: coursesData, error } = await supabase.from('available_courses').select('*').order('created_at', { ascending: false });

  // Dummy data in case the user hasn't created the table yet
  const dummyCourses = [
    {
      id: "1",
      title: "Advanced Next.js 15 & Server Actions",
      instructor: "Sarah Drasner",
      thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      duration_hours: 12,
      rating: 4.9,
      level: "Advanced",
      tags: ["React", "Next.js"]
    },
    {
      id: "2",
      title: "UI/UX Design for Web3",
      instructor: "DesignCourse",
      thumbnail_url: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800&auto=format&fit=crop",
      duration_hours: 8,
      rating: 4.7,
      level: "Intermediate",
      tags: ["Design", "Web3"]
    },
    {
      id: "3",
      title: "Supabase & Postgres Mastery",
      instructor: "Jon Meyers",
      thumbnail_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop",
      duration_hours: 15,
      rating: 4.8,
      level: "All Levels",
      tags: ["Database", "Backend"]
    },
    {
      id: "4",
      title: "Framer Motion Animations",
      instructor: "Matt Perry",
      thumbnail_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
      duration_hours: 5,
      rating: 4.9,
      level: "Intermediate",
      tags: ["Animation", "Frontend"]
    }
  ];

  const courses = !error && coursesData && coursesData.length > 0 ? coursesData : dummyCourses;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Explore Courses</h1>
          <p className="text-gray-400">Discover premium content to elevate your skills</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-border rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-800 border border-border rounded-xl text-sm hover:bg-surface-700 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm rounded-xl">
          Note: Showing sample courses because the `available_courses` table wasn't found in your Supabase database.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            instructor={course.instructor}
            thumbnailUrl={course.thumbnail_url}
            durationHours={course.duration_hours}
            rating={course.rating}
            level={course.level}
            tags={course.tags}
          />
        ))}
      </div>
    </div>
  );
}
