"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, BarChart2, Settings, User, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/courses", icon: BookOpen, label: "My Courses" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-border bg-surface-900/50 p-4 transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-20 lg:w-64"
        )}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-surface-800 border border-white/10 rounded-full p-1 text-gray-400 hover:text-white hover:bg-surface-800/80 z-20 hidden lg:flex items-center justify-center"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={cn("flex items-center gap-3 mb-10 px-2 mt-4", isCollapsed ? "justify-center" : "justify-center lg:justify-start")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className={cn("text-xl font-bold tracking-tight text-white transition-opacity hidden lg:block", isCollapsed && "lg:hidden")}>EdgeLearn</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-4 px-3 py-3 rounded-xl transition-colors outline-none",
                  isCollapsed ? "justify-center" : "justify-center lg:justify-start",
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
                <Icon className="w-6 h-6 relative z-10 flex-shrink-0" />
                <span className={cn("font-medium relative z-10 hidden lg:block whitespace-nowrap", isCollapsed && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-900 border-t border-border z-50 flex items-center justify-around px-4">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors",
                isActive ? "text-white" : "text-gray-400"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
