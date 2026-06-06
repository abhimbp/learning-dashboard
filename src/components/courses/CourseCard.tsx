"use client";

import { Clock, Star, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  durationHours: number;
  rating: number;
  level: string;
  tags?: string[];
  className?: string;
}

export function CourseCard({
  id,
  title,
  instructor,
  thumbnailUrl,
  durationHours,
  rating,
  level,
  tags,
  className,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-2xl bg-surface-900 border border-border transition-all duration-300 hover:border-primary-500/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col h-full">
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-800">
          <Image
            src={thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent opacity-80" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-primary-600/90 p-3 backdrop-blur-sm shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <PlayCircle className="w-8 h-8 text-white ml-1" />
            </div>
          </div>

          {/* Level Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
            {level}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 overflow-hidden">
            {tags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-medium uppercase tracking-wider whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 leading-tight group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-gray-400 mb-4 truncate">
            by <span className="text-gray-300">{instructor}</span>
          </p>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Clock className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium">{durationHours}h</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
