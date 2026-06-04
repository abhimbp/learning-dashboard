import { BentoTile } from "./BentoGrid";
import { Flame } from "lucide-react";

export function HeroTile() {
  return (
    <BentoTile className="md:col-span-2 xl:col-span-2 bg-gradient-to-br from-primary-900/40 to-surface-900 justify-between">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      
      <div className="flex justify-between items-start z-10">
        <div>
          <h2 className="text-sm font-medium text-primary-400 mb-1 tracking-wide uppercase">Dashboard</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Student</span>
          </h1>
          <p className="text-gray-400 mt-2 max-w-sm">
            You're doing great! Keep up the momentum and dive into your next lesson.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-md">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Daily Streak</span>
            <span className="text-sm font-bold text-white">12 Days</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-2 z-10 flex gap-4">
        <button className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          Continue Learning
        </button>
      </div>
    </BentoTile>
  );
}
