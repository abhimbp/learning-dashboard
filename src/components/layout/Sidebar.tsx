"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, BarChart2, Settings, User, ChevronLeft, ChevronRight, Compass, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { checkIsAdmin } from "@/lib/auth-helpers";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/courses", icon: BookOpen, label: "My Courses" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/admin", icon: Settings, label: "Admin" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ user: initialUser }: { user: any }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  const isAdmin = checkIsAdmin(user?.email);
  const visibleNavItems = NAV_ITEMS.filter(item => item.label !== "Admin" || isAdmin);

  // Sync state when Next.js server passes a new initialUser after Server Actions
  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser);
    }
  }, [initialUser]);

  useEffect(() => {
    let mounted = true;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mounted) {
        // Only update if ID changes to prevent loops with referential equality,
        // or just rely on onAuthStateChange for metadata updates
        setUser((prev: any) => prev?.id === session.user.id ? prev : session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setUser(session?.user || null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch initial unread count
    supabase.from('notifications').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .then(({ count }) => {
        if (count !== null) setUnreadCount(count);
      });

    // Subscribe to new notifications
    const notifSub = supabase.channel(`notifications-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
        // Re-fetch count on any change
        supabase.from('notifications').select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
          .then(({ count }) => {
            if (count !== null) setUnreadCount(count);
          });
      }).subscribe();

    return () => {
      notifSub.unsubscribe();
    };
  }, [supabase, user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

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
          {visibleNavItems.map((item) => {
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
                <div className="relative">
                  <Icon className="w-6 h-6 relative z-10 flex-shrink-0" />
                  {item.label === "Notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center z-20">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className={cn("font-medium relative z-10 hidden lg:block whitespace-nowrap", isCollapsed && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">
          {user ? (
            <>
              <div className={cn("flex items-center gap-3 px-2 py-2 mb-2", isCollapsed ? "justify-center" : "justify-center lg:justify-start")}>
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                </div>
                <div className={cn("flex flex-col overflow-hidden hidden lg:block justify-center", isCollapsed && "lg:hidden")}>
                  <span className="text-sm font-medium text-white truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-colors text-red-400 hover:text-red-300 hover:bg-red-400/10 outline-none",
                  isCollapsed ? "justify-center" : "justify-center lg:justify-start"
                )}
                title={isCollapsed ? "Logout" : undefined}
              >
                <User className="w-6 h-6 relative z-10 flex-shrink-0" />
                <span className={cn("font-medium relative z-10 hidden lg:block whitespace-nowrap", isCollapsed && "lg:hidden")}>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-colors text-white bg-primary-600 hover:bg-primary-700 outline-none",
                  isCollapsed ? "justify-center" : "justify-center lg:justify-start"
                )}
                title={isCollapsed ? "Login" : undefined}
              >
                <User className="w-6 h-6 relative z-10 flex-shrink-0" />
                <span className={cn("font-medium relative z-10 hidden lg:block whitespace-nowrap", isCollapsed && "lg:hidden")}>Login</span>
              </Link>
            </>
          )}
        </div>
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
              <div className="relative">
                <Icon className="w-5 h-5 relative z-10" />
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center z-20">
                    {unreadCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
