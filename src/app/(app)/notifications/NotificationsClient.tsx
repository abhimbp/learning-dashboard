"use client";

import { useEffect, useState } from "react";
import { Bell, BookOpen, MessageSquare, Info } from "lucide-react";
import { markAllNotificationsRead } from "./actions";
import { cn } from "@/lib/utils";

export function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    // Mark as read on mount if there are unread
    const hasUnread = notifications.some(n => !n.is_read);
    if (hasUnread) {
      markAllNotificationsRead().then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      });
    }
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_course': return <BookOpen className="w-5 h-5 text-primary-500" />;
      case 'admin_reply': return <MessageSquare className="w-5 h-5 text-accent-500" />;
      case 'student_comment': return <MessageSquare className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {notifications.length === 0 ? (
        <div className="p-8 text-center bg-surface-900 border border-border rounded-2xl text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>You have no notifications yet.</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={cn(
              "p-5 rounded-2xl border transition-all duration-300 flex gap-4",
              !notif.is_read ? "bg-surface-800 border-primary-500/30 shadow-md" : "bg-surface-900/50 border-border"
            )}
          >
            <div className="p-3 bg-surface-700/50 rounded-xl h-fit">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-foreground text-sm">{notif.title}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(notif.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
