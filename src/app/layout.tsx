import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Moyo - Creator Platform",
  description: "Exclusive content from top African creators",
};

import { Providers } from '@/components/providers/Providers';
import AgeVerificationModal from "@/components/modals/AgeVerificationModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased text-zinc-300 h-screen flex overflow-hidden selection:bg-amber-500/30 selection:text-amber-200 bg-zinc-950`}
        suppressHydrationWarning
      >
        <Providers>
          <AgeVerificationModal />
          <Sidebar />

          <main className="flex-1 h-full overflow-y-auto no-scrollbar relative w-full border-r border-zinc-800/50 bg-zinc-950">
            {children}
          </main>

          <RightSidebar />
          <MobileNavigation />
          <Toaster position="bottom-center" toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid #27272a',
              color: '#fff',
            }
          }} />
        </Providers>
      </body>
    </html>
  );
}
