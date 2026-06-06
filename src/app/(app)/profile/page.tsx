import { createClient } from "@/utils/supabase/server";
import { Mail, Calendar, MapPin } from "lucide-react";
import * as Icons from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AvatarUpload } from "./AvatarUpload";

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let purchasedCourses: any[] = [];
  if (user) {
    const { data: purchases } = await supabase
      .from("purchases")
      .select("course_id, created_at, available_courses(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    if (purchases) {
      purchasedCourses = purchases.map((p: any) => ({
        ...p.available_courses,
        purchased_at: p.created_at
      }));
    }
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "U";
  const email = user?.email || "student@edgelearn.com";
  const avatarUrl = user?.user_metadata?.avatar_url || null;

  // Mock dates for prototype
  const getMockDates = (index: number) => {
    const start = new Date();
    start.setDate(start.getDate() - (index * 14 + 10)); // Arbitrary past date
    const end = new Date(start);
    end.setMonth(end.getMonth() + 3); // 3 months later
    return {
      start: start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      end: end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Profile</h1>
          <p className="text-gray-400 mt-2">Manage your personal information and learning journey.</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 glass-panel rounded-3xl p-8 flex flex-col items-center text-center">
           {user && <AvatarUpload userId={user.id} currentUrl={avatarUrl} initials={initials} />}
           <h2 className="text-2xl font-bold text-white mb-2">{fullName}</h2>
           <p className="text-primary-400 font-medium mb-6">Learner</p>
           
           <div className="w-full space-y-4 text-left border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>Joined June 2026</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white">Active Courses Timeline</h3>
          <div className="space-y-4">
             {purchasedCourses.map((course, i) => {
               const dates = getMockDates(i);
               
               return (
                 <div key={course.id} className="glass-panel hover:bg-white/5 transition-colors p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-20 h-14 bg-surface-800 rounded-xl overflow-hidden border border-white/5 flex-shrink-0 relative">
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white line-clamp-1">{course.title}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-24 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `25%` }} />
                          </div>
                          <span className="text-xs font-medium text-primary-400">25%</span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-col sm:items-end text-sm text-gray-400 bg-surface-900/50 p-3 rounded-lg border border-white/5">
                     <div className="flex justify-between w-full sm:w-auto gap-4"><span className="text-gray-500">Purchased:</span> <span className="text-white font-medium">{new Date(course.purchased_at).toLocaleDateString()}</span></div>
                   </div>
                 </div>
               );
             })}
             
             {purchasedCourses.length === 0 && (
               <div className="glass-panel p-8 rounded-2xl text-center text-gray-500 border-dashed">No active courses found. Head to Explore to find your next skill!</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
