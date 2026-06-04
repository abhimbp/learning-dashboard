import { BentoGrid, BentoTile } from "@/components/dashboard/BentoGrid";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { ActivityTile } from "@/components/dashboard/ActivityTile";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen">
      <BentoGrid>
        {/* Static tiles that don't need data fetching can render immediately or we can skeleton them too. Let's skeleton everything for a unified loading state */}
        <BentoTile className="md:col-span-2 xl:col-span-2 bg-surface-900 animate-pulse">
          <div className="h-full w-full flex flex-col gap-4 justify-between">
            <div className="w-1/3 h-8 bg-white/5 rounded-md" />
            <div className="w-2/3 h-12 bg-white/5 rounded-md" />
            <div className="w-1/2 h-4 bg-white/5 rounded-md" />
            <div className="w-32 h-10 bg-white/10 rounded-xl mt-8" />
          </div>
        </BentoTile>

        <BentoTile className="xl:col-span-1 bg-surface-900 animate-pulse">
          <div className="w-1/2 h-6 bg-white/5 rounded-md mb-8" />
          <div className="flex items-end justify-between gap-2 h-24 mt-auto">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full bg-white/5 rounded-t-sm h-full" style={{ height: `${Math.random() * 50 + 20}%` }} />
            ))}
          </div>
        </BentoTile>

        {/* Skeleton Course Tiles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <BentoTile key={i} className="xl:col-span-1 bg-surface-900 animate-pulse">
             <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl" />
                  <div className="w-12 h-6 bg-white/5 rounded-full" />
                </div>
                <div className="mt-8">
                  <div className="w-3/4 h-6 bg-white/5 rounded-md mb-4" />
                  <div className="w-full h-2 bg-white/10 rounded-full" />
                </div>
             </div>
          </BentoTile>
        ))}
      </BentoGrid>
    </div>
  );
}
