import { BentoTile } from "./BentoGrid";
import { Activity } from "lucide-react";

export function ActivityTile() {
  // Generate random heights for a mock bar chart
  const bars = Array.from({ length: 12 }, () => Math.floor(Math.random() * 60) + 20);

  return (
    <BentoTile className="xl:col-span-1 bg-surface-800/50 justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent-500/20 text-accent-400">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white tracking-tight">Learning Activity</h3>
        </div>
        <span className="text-xs text-gray-400">This Week</span>
      </div>

      <div className="flex-1 flex items-end justify-between gap-1 mt-auto h-24">
        {bars.map((height, i) => (
          <div
            key={i}
            className="w-full bg-primary-500/40 hover:bg-accent-400 rounded-t-sm transition-colors relative group"
            style={{ height: `${height}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-900 border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {height} mins
            </div>
          </div>
        ))}
      </div>
    </BentoTile>
  );
}
