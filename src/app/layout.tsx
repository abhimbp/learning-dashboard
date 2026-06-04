import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next-Gen Learning Dashboard",
  description: "A futuristic, highly animated education platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative z-0 md:pb-0 pb-20">
          <div className="absolute top-0 left-0 right-0 h-96 bg-primary-900/10 blur-[100px] pointer-events-none -z-10" />
          {children}
        </main>
      </body>
    </html>
  );
}
