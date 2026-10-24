"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Home, PlayCircle, BookOpen, Trophy, Smartphone, Sparkles, Heart, Menu, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  user: any;
  role: string;
  profile: any;
  loading: boolean;
  navHidden: boolean;
  onOpenSearch: () => void;
}

export default function Navbar({ user, role, profile, loading, navHidden, onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header 
      variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-100%", opacity: 0 } }}
      animate={navHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-2xl pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 font-bold tracking-wider text-lg sm:text-xl group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-zinc-900 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:scale-105 transition-transform shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-black bg-gradient-to-r from-white via-indigo-100 to-zinc-400 bg-clip-text text-transparent leading-none text-base sm:text-xl">VOICE NOTE</span>
            <span className="text-[9px] sm:text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-0.5">CS Study Hub</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/10">
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-bold text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm flex items-center gap-2"><Home className="w-4 h-4 text-indigo-400"/> Home</Link>
          <Link href="#lectures" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-red-400"/> Lectures</Link>
          <Link href="/notes" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-400"/> Notes</Link>
          <Link href="/practice" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-400"/> MCQs</Link>
          <Link href="/apps" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Apps</Link>
          <Link href="/blog" className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Blog</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onOpenSearch} className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-all">
            <Search className="w-4 h-4 text-indigo-400" /> 
            <span className="hidden md:inline">Search...</span> 
            <kbd className="hidden md:inline font-sans px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-zinc-300">⌘K</kbd>
          </button>

          {/* <Link href="/portfolio" className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-bold transition-all">
            <Heart className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> Portfolio
          </Link> */}

          {loading ? (
            <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
          ) : user ? (
            <Link href={role === "admin" ? "/admin" : "/dashboard"} className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-black bg-zinc-900">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-black text-xs sm:text-sm text-white uppercase">{profile?.full_name?.charAt(0) || "U"}</div>
                )}
              </div>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" className="text-sm text-zinc-300 hover:text-white hover:bg-white/10 h-10 rounded-xl font-bold">Log In</Button></Link>
              <Link href="/register"><Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition-transform text-sm font-bold rounded-xl px-5 h-10 shadow-lg shadow-indigo-500/25 border border-indigo-400/40">Sign Up</Button></Link>
            </div>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:text-white bg-zinc-900 border border-white/10">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-b border-white/10 bg-zinc-950/98 backdrop-blur-3xl px-5 pt-4 pb-8 space-y-4 shadow-2xl overflow-hidden">
            <nav className="flex flex-col space-y-1.5 text-sm sm:text-base font-semibold text-zinc-300">
              <button onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-white px-4 py-3 rounded-xl bg-zinc-900 border border-indigo-500/30 mb-1"><Search className="w-4 h-4 text-indigo-400"/> Search Notes & PYQs</button>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white px-4 py-2.5 rounded-xl bg-white/5"><Home className="w-4 h-4 text-indigo-400"/> Home</Link>
              <Link href="#lectures" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-red-400 flex items-center gap-3"><PlayCircle className="w-4 h-4"/> Latest YT Lectures</Link>
              <Link href="/notes" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-emerald-400 flex items-center gap-3"><BookOpen className="w-4 h-4"/> YouTube Lecture Notes</Link>
              <Link href="/practice" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-amber-400 flex items-center gap-3"><Trophy className="w-4 h-4"/> Practice Question Bank</Link>
              <Link href="/apps" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><Smartphone className="w-4 h-4 text-purple-400"/> Flutter Apps Hub</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"><Sparkles className="w-4 h-4 text-blue-400"/> Tech Blog</Link>
            </nav>
            {!user && (
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/10 bg-zinc-900 text-white h-11 rounded-xl font-bold">Log In</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-11 rounded-xl font-bold">Sign Up</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}