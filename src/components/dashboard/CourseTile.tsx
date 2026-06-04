"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { BentoTile } from "./BentoGrid";

interface CourseTileProps {
  course: {
    id: string;
    title: string;
    progress: number;
    icon_name: string;
  };
}

export function CourseTile({ course }: CourseTileProps) {
  // Dynamically resolve the icon from Lucide React
  // Fallback to 'Book' if the icon_name doesn't match
  const IconComponent = (Icons as any)[
    course.icon_name.charAt(0).toUpperCase() + course.icon_name.slice(1)
  ] || Icons.Book;

  return (
    <BentoTile className="xl:col-span-1 bg-surface-900 group">
      {/* Abstract mesh background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-transparent to-transparent group-hover:opacity-40 transition-opacity duration-500" />
      
      <div className="flex flex-col h-full z-10 justify-between">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-surface-800 rounded-2xl border border-white/5 shadow-inner">
            <IconComponent className="w-6 h-6 text-primary-400" />
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 border border-white/5 backdrop-blur-sm">
            {course.progress}%
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
            {course.title}
          </h3>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${course.progress}%` }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 15,
                delay: 0.2, // Small delay for the staggered entrance to finish
              }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
            />
          </div>
        </div>
      </div>
    </BentoTile>
  );
}
