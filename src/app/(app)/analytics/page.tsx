"use client";

import { BentoGrid, BentoTile } from "@/components/dashboard/BentoGrid";
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const weeklyData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 3.8 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4.2 },
    { day: "Fri", hours: 5.0 },
    { day: "Sat", hours: 1.0 },
    { day: "Sun", hours: 0.5 },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-gray-400 mt-2">Track your learning velocity and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <BentoTile className="bg-surface-900/50 p-6 h-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500/20 text-primary-400 rounded-xl"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400">Total Hours</p>
              <p className="text-2xl font-bold text-white">124.5h</p>
            </div>
          </div>
        </BentoTile>
        <BentoTile className="bg-surface-900/50 p-6 h-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-500/20 text-accent-400 rounded-xl"><Target className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-white">82%</p>
            </div>
          </div>
        </BentoTile>
        <BentoTile className="bg-surface-900/50 p-6 h-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-white">12 Days</p>
            </div>
          </div>
        </BentoTile>
        <BentoTile className="bg-surface-900/50 p-6 h-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl"><BarChart3 className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400">Avg Session</p>
              <p className="text-2xl font-bold text-white">45m</p>
            </div>
          </div>
        </BentoTile>
      </div>

      <BentoGrid>
        <BentoTile className="md:col-span-2 xl:col-span-3 bg-surface-900 min-h-[400px] flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
            <p className="text-sm text-gray-400">Hours spent learning this week</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 sm:gap-8 pt-10">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full relative h-[250px] bg-white/5 rounded-t-xl group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.hours / maxHours) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-600 to-accent-400 rounded-t-xl"
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-800 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.hours}h
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-400">{data.day}</span>
              </div>
            ))}
          </div>
        </BentoTile>
      </BentoGrid>
    </div>
  );
}
