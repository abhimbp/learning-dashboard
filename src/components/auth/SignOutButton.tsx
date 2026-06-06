"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function SignOutButton() {
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-colors font-medium shadow-[0_0_15px_rgba(239,68,68,0.1)]"
    >
      <LogOut className="w-4 h-4" /> Sign Out
    </button>
  );
}
