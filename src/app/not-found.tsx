import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4 text-white relative overflow-hidden selection:bg-white selection:text-black">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Glassmorphic 404 Card */}
      <div className="z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-10 md:p-12 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">

          {/* Top Glowing Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          {/* 404 Text */}
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-2 bg-gradient-to-br from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3">
            Lost in the Digital World
          </h2>

          <p className="text-sm md:text-base text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or is currently under construction.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full h-12 px-8 bg-white text-black hover:bg-zinc-200 font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 px-8 border-white/10 bg-zinc-900/50 hover:bg-zinc-800 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}