import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NotificationsClient } from "./NotificationsClient";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full min-h-screen pt-8 md:pt-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Notifications</h1>
      <NotificationsClient initialNotifications={notifications || []} />
    </div>
  );
}
