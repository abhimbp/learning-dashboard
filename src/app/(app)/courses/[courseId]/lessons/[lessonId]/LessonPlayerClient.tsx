"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle, Video, FileText, Download, Image as ImageIcon, BookOpen, AlignLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock data for the new tabs
const MOCK_NOTES = `
# Instructor Notes

Welcome to this lesson! Before you begin, make sure you have your development environment set up. 
In this section, we'll cover the fundamental concepts that you'll need for the rest of the course.

### Key Takeaways:
- Always initialize your variables.
- Keep functions small and focused.
- Don't forget to commit your code frequently!
`;

const MOCK_TRANSCRIPT = `[00:00] Welcome everyone to today's lesson.
[00:15] Today we're going to dive deep into the core concepts.
[00:30] If you look at the diagram on the screen, you'll see...
[01:10] And that's why this approach is generally preferred over the older methods.
[02:00] Let's jump into the code editor and write some examples.
[04:45] Notice how we handle the error state here, this is crucial for stability.
[08:20] That wraps up this lesson, see you in the next one!`;

export function LessonPlayerClient({
  courseId,
  lessonId,
  lesson,
  course,
  isCompleted,
  embedUrl,
  materials,
  markCompleteAction
}: {
  courseId: string;
  lessonId: string;
  lesson: any;
  course: any;
  isCompleted: boolean;
  embedUrl: string;
  materials: any[];
  markCompleteAction: (payload: FormData) => void;
}) {
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript' | 'materials'>('notes');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col w-full min-h-screen bg-surface-950 pb-20"
    >
      {/* Top Nav */}
      <div className="h-16 border-b border-white/5 bg-surface-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center px-6 gap-4">
        <Link href={`/courses/${courseId}`} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">{lesson.title}</h1>
          <p className="text-xs text-gray-400">{course?.title}</p>
        </div>
      </div>

      {/* Main Content Area - Constrained Width */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 pt-8">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <motion.h2 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="text-2xl md:text-3xl font-bold text-white tracking-tight"
           >
             {lesson.title}
           </motion.h2>
           
           <motion.form 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             action={async (formData) => { await markCompleteAction(formData); }}
           >
             <input type="hidden" name="lesson_id" value={lessonId} />
             <input type="hidden" name="course_id" value={courseId} />
             <button type="submit" className={cn(
               "px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all w-full md:w-auto shadow-lg",
               isCompleted 
                 ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-green-500/10" 
                 : "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/20"
             )}>
               <CheckCircle className={cn("w-5 h-5", isCompleted && "fill-green-500/20")} /> 
               {isCompleted ? 'Completed' : 'Mark as Complete'}
             </button>
           </motion.form>
        </div>

        {/* Video Player - Beautifully Framed */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
          className="w-full bg-black aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative mb-12 group"
        >
          {lesson.video_type === 'upload' ? (
            <video 
              src={lesson.video_url} 
              controls 
              className="w-full h-full object-cover" 
              poster={course?.thumbnail_url || undefined} 
            />
          ) : embedUrl ? (
            <iframe 
              src={embedUrl} 
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-surface-900">
              <Video className="w-12 h-12 mb-4 opacity-50" />
              <p>Video not available</p>
            </div>
          )}
        </motion.div>

        {/* Content Tabs */}
        <div className="bg-surface-900/50 rounded-3xl border border-white/5 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-white/5 hide-scrollbar">
            <button onClick={() => setActiveTab('notes')} className={cn("px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'notes' ? "text-primary-400 border-b-2 border-primary-500" : "text-gray-400 hover:text-white")}>
              <BookOpen className="w-4 h-4" /> Instructor Notes
            </button>
            <button onClick={() => setActiveTab('transcript')} className={cn("px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'transcript' ? "text-primary-400 border-b-2 border-primary-500" : "text-gray-400 hover:text-white")}>
              <AlignLeft className="w-4 h-4" /> Transcript
            </button>
            <button onClick={() => setActiveTab('materials')} className={cn("px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2", activeTab === 'materials' ? "text-primary-400 border-b-2 border-primary-500" : "text-gray-400 hover:text-white")}>
              <Download className="w-4 h-4" /> Resources ({materials.length})
            </button>
          </div>

          <div className="p-6 md:p-8 min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white">
                  <div dangerouslySetInnerHTML={{ __html: MOCK_NOTES.replace(/\n/g, '<br/>') }} />
                </motion.div>
              )}

              {activeTab === 'transcript' && (
                <motion.div key="transcript" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 font-mono text-sm">
                  {MOCK_TRANSCRIPT.split('\n').map((line, i) => {
                    const timeMatch = line.match(/^\[(.*?)\]/);
                    const text = line.replace(/^\[.*?\]/, '');
                    return (
                      <div key={i} className="flex gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                        <span className="text-primary-400 group-hover:text-primary-300 flex-shrink-0">{timeMatch?.[0]}</span>
                        <span className="text-gray-300 group-hover:text-white">{text}</span>
                      </div>
                    )
                  })}
                </motion.div>
              )}

              {activeTab === 'materials' && (
                <motion.div key="materials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {materials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {materials.map((mat: any, idx: number) => (
                        <a key={idx} href={mat.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-surface-800 hover:bg-surface-700 rounded-2xl border border-white/5 transition-all hover:scale-[1.02] group shadow-lg">
                          <div className="w-12 h-12 rounded-xl bg-surface-900 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                            {mat.type === 'pdf' ? <FileText className="w-6 h-6 text-red-400" /> : <ImageIcon className="w-6 h-6 text-blue-400" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{mat.name}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{mat.type} Document</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mb-4 opacity-20" />
                      <p>No study materials attached to this lesson.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
