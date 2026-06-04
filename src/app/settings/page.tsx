import { BentoTile } from "@/components/dashboard/BentoGrid";
import { Bell, Monitor, Shield, Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your app preferences and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <BentoTile className="bg-surface-900/50 p-6 md:p-8 h-auto flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white mb-4">Preferences</h3>
              
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl"><Bell className="w-5 h-5" /></div>
                    <div>
                      <p className="font-medium text-white">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates on your learning streak.</p>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-primary-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                 </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl"><Monitor className="w-5 h-5" /></div>
                    <div>
                      <p className="font-medium text-white">Dark Mode</p>
                      <p className="text-sm text-gray-500">Only the dark theme is available right now.</p>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-primary-500 rounded-full relative cursor-pointer opacity-50 cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                 </div>
              </div>

              <div className="flex items-center justify-between py-4">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><Shield className="w-5 h-5" /></div>
                    <div>
                      <p className="font-medium text-white">Data Privacy</p>
                      <p className="text-sm text-gray-500">Allow anonymized analytics for better recommendations.</p>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-surface-700 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full" />
                 </div>
              </div>
           </BentoTile>
        </div>

        <div className="lg:col-span-1">
          <BentoTile className="bg-red-500/5 border-red-500/20 p-6 md:p-8 h-auto flex flex-col items-center text-center gap-4">
             <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
               <Trash2 className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-white">Danger Zone</h3>
             <p className="text-sm text-gray-400 mb-4">
               Once you delete your account, there is no going back. Please be certain.
             </p>
             <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]">
               Delete Account
             </button>
          </BentoTile>
        </div>
      </div>
    </div>
  );
}
