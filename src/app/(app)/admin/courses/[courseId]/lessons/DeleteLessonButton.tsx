"use client";

import { Trash2 } from "lucide-react";
import { deleteLesson } from "./actions";

export function DeleteLessonButton({ lessonId, courseId }: { lessonId: string, courseId: string }) {
  return (
    <form action={deleteLesson} onSubmit={(e) => {
      if (!confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
        e.preventDefault();
      }
    }}>
      <input type="hidden" name="lesson_id" value={lessonId} />
      <input type="hidden" name="course_id" value={courseId} />
      <button type="submit" className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Lesson">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
