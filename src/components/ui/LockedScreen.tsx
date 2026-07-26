"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Lock, ShieldAlert, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LockedScreenProps {
  title: string;
  isPermissionDenied?: boolean;
}

export default function LockedScreen({ title, isPermissionDenied = false }: LockedScreenProps) {
  // useRef is used to prevent duplicate toasts in React Strict Mode
  const toastShown = useRef(false);

  useEffect(() => {
    if (!toastShown.current) {
      if (isPermissionDenied) {
        toast.error(`Access Denied: You don't have permission to view ${title}.`);
      } else {
        toast.error(`Locked: Please login to access ${title}!`);
      }
      toastShown.current = true;
    }
  }, [title, isPermissionDenied]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Glassmorphism Lock Card */}
      <div className="z-10 w-full max-w-md animate-in zoom-in-95 duration-700">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 text-red-400 shadow-inner">
            {isPermissionDenied ? <ShieldAlert className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {isPermissionDenied ? "Access Restricted" : "Authentication Required"}
          </h1>
          
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            {isPermissionDenied 
              ? `Your account does not have the necessary permissions to view ${title}. Please contact the admin.`
              : `The ${title} section is locked for guests. Please log in or create an account to unlock this content.`}
          </p>

          <div className="flex flex-col w-full gap-3">
            {isPermissionDenied ? (
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-white text-black hover:bg-zinc-200 h-11 rounded-xl font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl font-medium shadow-lg shadow-indigo-500/20">
                  <LogIn className="w-4 h-4 mr-2" /> Log In to Unlock
                </Button>
              </Link>
            )}
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full border-white/10 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 h-11 rounded-xl">
                Go back Home
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}