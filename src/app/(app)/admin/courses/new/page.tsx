import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth-helpers";
import Link from "next/link";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { createCourse } from "../../actions";

export default async function NewCoursePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <Link href="/admin" className="text-primary-400 hover:text-primary-300 text-sm font-medium mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Create New Course</h1>
      </div>

      <div className="bg-surface-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
        <form action={async (formData) => { await createCourse(formData); }} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Course Title</label>
            <input required name="title" className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" placeholder="e.g. Advanced Next.js" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Instructor Name</label>
            <input required name="instructor" className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" placeholder="e.g. John Doe" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Duration (Hours)</label>
              <input required type="number" step="0.5" name="duration_hours" className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" placeholder="e.g. 5.5" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Level</label>
              <select required name="level" className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Thumbnail URL</label>
            <input name="thumbnail_url" className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" placeholder="Optional Unsplash URL" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
            <input name="tags" className="px-4 py-3 bg-surface-800 rounded-xl text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" placeholder="React, Frontend, Web" />
          </div>
          
          <button type="submit" className="mt-4 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex justify-center items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Publish Course
          </button>
        </form>
      </div>
    </div>
  );
}
