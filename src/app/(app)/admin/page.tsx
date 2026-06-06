import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth-helpers";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    redirect("/dashboard");
  }

  // Fetch only courses created by this specific admin
  const { data: courses } = await supabase
    .from('available_courses')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });

  const courseIds = (courses || []).map(c => c.id);

  // Fetch purchases for these courses
  let purchases: any[] = [];
  if (courseIds.length > 0) {
    const { data: p } = await supabase.from('purchases').select('*').in('course_id', courseIds).order('created_at', { ascending: false });
    if (p) purchases = p;
  }

  // Fetch reviews for these courses
  let reviews: any[] = [];
  if (courseIds.length > 0) {
    const { data: r } = await supabase.from('course_reviews').select('*').in('course_id', courseIds).order('created_at', { ascending: false });
    if (r) reviews = r;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Track revenue, manage students, and respond to feedback.</p>
      </div>

      <DashboardClient 
        courses={courses || []} 
        purchases={purchases} 
        reviews={reviews} 
      />
    </div>
  );
}
