import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

//for inspect on off
import DisableInspect from './DisableInspect';
import MaintenanceWrapper from './MaintenanceWrapper';
// 1. Toaster component import kiya
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice Note | Let's Learn ❤️", 
  description: "Exclusive portal for Apps, Notes, and Engineering Blogs.", 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        
        {/* Right Click aur F12 Inspect ko disable karne ke liye */}
        <DisableInspect />

        <MaintenanceWrapper>
          {children}
        </MaintenanceWrapper>

        {/* Toaster yahan add karna zaroori hai tabhi notifications dikhenge */}
        <Toaster position="top-center" richColors theme="dark" />
        
      </body>
    </html>
  );
}