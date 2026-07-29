import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

//for inspect on off
import DisableInspect from './DisableInspect';
import MaintenanceWrapper from './MaintenanceWrapper';
import OnlineTracker from "@/components/ui/OnlineTracker";


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
  title: "Voice Note | Premium Knowledge Workspace ",
  description: "Access premium digital notes, handwritten PDFs, and tech resources. The ultimate workspace for students and developers.",
  keywords: ["engineering notes", "tech blogs", "handwritten notes", "developer workspace", "Flutter android apps."],

  verification: {
    google: "Ggsz0-NigmgC8IFfaluvDJFyXY-koPU8RxIGj8tZ3ZU", 
  },


  openGraph: {
    title: "Voice Note - Knowledge Workspace",
    description: "Your ultimate study companion and tech hub.",
    url: "https://voice-note-fawn.vercel.app/", 
    siteName: "Voice Note",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        
        {/* Right Click aur F12 Inspect ko disable karne ke liye */}
        <DisableInspect />
       

        <MaintenanceWrapper>
           <OnlineTracker />
          {children}
        </MaintenanceWrapper>

        {/* Toaster yahan add karna zaroori hai tabhi notifications dikhenge */}
        <Toaster position="top-center" richColors theme="dark" />
        
      </body>
    </html>
  );
}