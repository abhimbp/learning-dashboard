import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto relative z-0 md:pb-0 pb-20">
        <div className="absolute top-0 left-0 right-0 h-96 bg-primary-900/10 blur-[100px] pointer-events-none -z-10" />
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
