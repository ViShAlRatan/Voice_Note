"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-purple-500/10 blur-[150px] pointer-events-none" />

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50"
      >
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 md:p-14 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-8 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mb-10 border-b border-white/10 pb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
              <p>By accessing and registering on the Voice Note platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use or access the platform.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">2. Description of Service</h2>
              <p>Voice Note is a personal engineering workspace providing users with access to educational materials, database manuals, technical blogs, and compiled Flutter application binaries (APKs) strictly for testing and educational purposes.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">3. User Registration</h2>
              <p>To use certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">4. Intellectual Property</h2>
              <p>All content on this website, including but not limited to study notes, blog texts, graphics, logos, and Flutter application source code/designs, are the intellectual property of the platform creator (Vishal). Users may download and read materials for personal, non-commercial use only. Redistribution or reselling of this content without permission is prohibited.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">5. Limitation of Liability</h2>
              <p>The applications (APKs) and study notes provided on this platform are for educational purposes. We do not guarantee that the apps will function flawlessly on all devices. In no event shall Voice Note or its creator be liable for any damages arising out of the use or inability to use the materials or applications provided.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">6. Termination</h2>
              <p>We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}