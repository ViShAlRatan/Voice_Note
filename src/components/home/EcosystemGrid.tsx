"use client";

import { motion } from "framer-motion";
import { ArrowRight, Library, Trophy, FileText, Smartphone } from "lucide-react";
import Link from "next/link";

export default function EcosystemGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 z-10 relative pointer-events-auto">
      <div className="text-center mb-12 sm:mb-14 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">All-In-One Ecosystem</span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 mb-3 sm:mb-4">Everything You Need to Crack It.</h2>
        <p className="text-zinc-400 text-sm sm:text-lg">No more hunting for scattered telegram PDFs. Everything is organized unit-wise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Main Digital Notes Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="md:col-span-2 rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-indigo-500/30 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 sm:mb-6 group-hover:scale-110 transition-all">
                <Library className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-3xl font-black mb-3 text-white">Structured Digital Notes</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xl text-sm sm:text-lg">
                Multi-page, color-coded notes with highlighted GATE pro-tips, truth tables, and comparison charts for quick visual retention.
              </p>
            </div>
            <Link href="/notes?view=digital" className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-indigo-400 font-black tracking-wide hover:text-indigo-300 bg-white/5 w-max px-5 sm:px-6 py-3 rounded-xl border border-white/10 hover:border-indigo-500/40 transition-colors text-xs sm:text-sm">
              Open Digital Library <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Question Bank Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all group overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 sm:mb-6 group-hover:scale-110 transition-all">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 text-white">Topic-Wise PYQs</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Practice Easy, Moderate, and Hard GATE & NET questions with step-by-step logical explanations.
              </p>
            </div>
            <Link href="/practice" className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 text-sm">
              Start Practicing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Handwritten PDFs Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-amber-500/30 transition-all group overflow-hidden relative"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition-colors" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 sm:mb-6 group-hover:scale-110 transition-all">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-3 text-white">Handwritten PDFs</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Prefer reading from notebooks? Download my clean, scanned handwritten notes directly via Drive.
              </p>
            </div>
            <Link href="/notes?view=handwritten" className="mt-7 sm:mt-8 inline-flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300 text-sm">
              Download PDFs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Apps Hub Card (Spans 2 cols) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 rounded-[2rem] border border-white/10 bg-zinc-900/30 p-6 sm:p-8 md:p-10 hover:bg-zinc-900/60 hover:border-purple-500/30 transition-all group overflow-hidden relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-center"
        >
          <div className="relative z-10 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <div className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest border border-purple-500/30">Developer Workspace</div>
            </div>
            <h3 className="text-xl sm:text-3xl font-black mb-3 text-white">Flutter Applications Hub</h3>
            <p className="text-zinc-400 leading-relaxed text-sm sm:text-lg mb-6">
              Along with teaching CS, I build production-ready mobile applications. Test my apps, check release notes, and download APKs directly.
            </p>
            <Link href="/apps" className="inline-flex items-center gap-2 bg-white text-black font-bold px-5 sm:px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors text-xs sm:text-sm">
              Explore Apps Hub <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          <div className="relative z-10 w-full sm:w-1/3 flex justify-center">
             <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform duration-500">
                <Smartphone className="w-12 h-12 sm:w-14 sm:h-14" />
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}