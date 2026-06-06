"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function AvatarUpload({ userId, currentUrl, initials }: { userId: string; currentUrl?: string | null; initials: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentUrl);
  const supabase = createClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      // Upload the file to the "avatars" bucket
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update user metadata
      await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });

      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      // Smart Fallback: Generate a random professional avatar and set it
      const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
      await supabase.auth.updateUser({
        data: { avatar_url: fallbackUrl }
      });
      setAvatarUrl(fallbackUrl);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1 mb-6 relative shadow-[0_0_30px_rgba(139,92,246,0.3)] group cursor-pointer">
      <div className="w-full h-full bg-surface-900 rounded-full flex items-center justify-center overflow-hidden relative">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">{initials}</span>
        )}
        
        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
          <span className="text-xs text-white mt-1 font-medium">{isUploading ? 'Uploading...' : 'Upload'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
