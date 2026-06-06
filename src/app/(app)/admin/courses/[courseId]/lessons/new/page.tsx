import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth-helpers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LessonFormClient } from "./LessonFormClient";

export default async function NewLessonPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !checkIsAdmin(user.email)) {
    redirect("/dashboard");
  }

  // Get the current max order_index to auto-increment
  const { data: maxOrderData } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrderIndex = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order_index + 1 : 1;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <Link href={`/admin/courses/${courseId}`} className="text-primary-400 hover:text-primary-300 text-sm font-medium mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Course Editor
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create New Lesson</h1>
      </div>

      <LessonFormClient courseId={courseId} orderIndex={nextOrderIndex} />
    </div>
  );
}
