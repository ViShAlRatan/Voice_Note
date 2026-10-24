"use client";

import { motion } from "framer-motion";
import { ArrowRight, Map, ShieldAlert, HelpCircle, Code, MessageCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/80 pt-16 pb-8 relative z-40 pointer-events-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-4">
          <div className="flex items-center gap-2 font-bold tracking-wider text-lg">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-pink-50 underline">VOICE NOTE</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">Designing and building high-performance digital experiences. Next.js, Flutter, and Supabase stack.</p>
          <div className="flex items-center gap-4 pt-2">
            <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Code className="w-4 h-4"/></Link>
            <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#1DA1F2] hover:bg-white/10 transition-all"><MessageCircle className="w-4 h-4"/></Link>
            <Link href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2] hover:bg-white/10 transition-all"><Briefcase className="w-4 h-4"/></Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4, delay: 0.2 }} className="space-y-4">
          <h4 className="text-white font-semibold flex items-center gap-2"><ArrowRight className="w-4 h-4 text-indigo-400"/> Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
            <li><Link href="/apps" className="hover:text-white transition-colors">Mobile Applications</Link></li>
            <li><Link href="/notes" className="hover:text-white transition-colors">Study Resources</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-4">
          <h4 className="text-white font-semibold flex items-center gap-2"><Map className="w-4 h-4 text-emerald-400"/> Sitemap</h4>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">User Sign In</Link></li>
            <li><Link href="/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
            <li><Link href="/admin-login" className="hover:text-white transition-colors flex items-center gap-2">Admin Gateway <ShieldAlert className="w-3 h-3 text-red-400"/></Link></li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.3, delay: 0.2 }} className="space-y-4">
          <h4 className="text-white font-semibold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-purple-400"/> Support</h4>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Me</Link></li>
            <li><Link href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </motion.div>
      </div>
      
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} <span className="font-bold text-blue-200 underline">Voice Note</span> Platform. All rights reserved.</p>
        <p className="flex items-center gap-1">Developed by <span className="font-bold text-blue-200 underline">VISHAL</span> With AI ❤️</p>
        <p className="flex items-center gap-1">Built with <span className="font-bold text-blue-200 underline">Next.js 15, Tailwind v4,</span> and <span className="font-bold text-blue-200 underline">Supabase.</span></p>
      </motion.div>
    </footer>
  );
}