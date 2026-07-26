"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] pointer-events-none" />

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
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mb-10 border-b border-white/10 pb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
              <p>Welcome to Voice Note. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">2. The Data We Collect</h2>
              <p>When you register on our platform to access Flutter Apps, Study Notes, and Blogs, we may collect the following information:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li><strong>Identity Data:</strong> First name, last name, and profile image (avatar).</li>
                <li><strong>Contact Data:</strong> Email address.</li>
                <li><strong>Technical Data:</strong> Login data, browser type, and version via our secure database provider (Supabase).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">3. How We Use Your Data</h2>
              <p>We will only use your personal data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>To register you as a new user and provide secure login access.</li>
                <li>To manage your relationship with us and notify you about changes to our terms or privacy policy.</li>
                <li>To deliver relevant website content, study materials, and application downloads.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. Our platform uses enterprise-grade security provided by Supabase, including Row Level Security (RLS) to ensure your data remains strictly confidential.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">5. Local Storage & Cookies</h2>
              <p>We use local storage strictly for essential user experience features, such as remembering your Light/Dark mode theme preference. We do not use third-party tracking cookies to monitor your browsing behavior.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">6. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us through the Contact page on the website.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}