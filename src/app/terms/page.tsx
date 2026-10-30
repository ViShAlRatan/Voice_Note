"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  BookOpen,
  AlertTriangle,
  ShieldAlert,
  Copyright,
  Ban,
  Gavel,
  Shield,
} from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "October 30, 2026";

  return (
    <main className="relative min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/10 via-indigo-500/15 to-transparent blur-[150px] rounded-full pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between relative z-20">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/70 border border-white/10 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/90 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <Link
          href="/privacy"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-all"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>View Privacy Policy</span>
        </Link>
      </div>

      {/* Main Glassmorphism Document Card */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/75 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Top Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-4">
              <Scale className="w-3.5 h-3.5" />
              <span>User Agreement & Legal Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Last Updated: <span className="text-zinc-200 font-medium">{lastUpdated}</span>
            </p>
            <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
              Welcome to our GATE & UGC NET Computer Science preparation platform. By creating an account, ticking the registration consent box, or accessing our digital notes and PDF resources, you agree to be legally bound by these Terms of Service.
            </p>
          </div>

          {/* Terms Content Sections */}
          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            {/* Section 1: Non-Affiliation Disclaimer */}
            <section className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 space-y-2">
              <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>1. Non-Affiliation Disclaimer (GATE & UGC NET)</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300">
                This website is an <strong className="text-white">independent educational platform</strong> created to assist Computer Science aspirants. We are <strong className="text-white">NOT</strong> officially affiliated with, endorsed by, or connected to the Indian Institutes of Technology (IITs), IISc, the GATE Committee, the National Testing Agency (NTA), or the University Grants Commission (UGC). All exam names and trademarks belong to their respective official authorities.
              </p>
            </section>

            {/* Section 2: Intellectual Property & PDF Vault */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Copyright className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>2. Intellectual Property & Handwritten PDF License</span>
              </h2>
              <p className="text-zinc-400">
                All structured digital notes, handwritten PDF notes, diagrams, code snippets, and UI designs on this platform are protected under the Indian Copyright Act, 1957:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>
                  <strong className="text-white">Personal Study Only:</strong> You are granted a limited, non-exclusive, non-transferable license to view and download materials strictly for your personal, non-commercial exam preparation.
                </li>
                <li>
                  <strong className="text-white">Strict Anti-Piracy Rule:</strong> You must <strong className="text-white">NOT</strong> resell, re-upload, distribute on Telegram channels, Google Drive links, WhatsApp groups, or publish our handwritten PDFs or digital notes on any third-party website without written permission.
                </li>
              </ul>
            </section>

            {/* Section 3: Educational & AI Accuracy Disclaimer */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>3. Educational Content & No-Guarantee Disclaimer</span>
              </h2>
              <p>
                While every effort is made to keep our GATE and UGC NET Computer Science notes, formulas, and doubt solutions accurate and updated, all materials (including any automated/AI-assisted responses) are provided on an <strong className="text-white">&quot;AS IS&quot;</strong> basis. We do not guarantee error-free content, specific exam ranks, qualification, or selection in any competitive examination. Students are advised to cross-verify critical syllabus updates and official exam notifications from official exam portals.
              </p>
            </section>

            {/* Section 4: User Conduct & Prohibited Activities */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Ban className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>4. Acceptable Use & Account Security</span>
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>You are responsible for maintaining the confidentiality of your account login credentials.</li>
                <li>You agree not to use automated bots, scrapers, or crawlers to extract content or overwhelm our server endpoints.</li>
                <li>You must not submit abusive, defamatory, spam, or malicious payloads through our Contact/Doubt forms.</li>
                <li>We reserve the right to suspend or permanently terminate accounts that violate these terms without prior notice.</li>
              </ul>
            </section>

            {/* Section 5: Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>5. Limitation of Liability</span>
              </h2>
              <p>
                To the maximum extent permitted by applicable Indian law, the platform creators, administrators, and contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our study materials, server downtime, data loss, or reliance on any information provided on this website.
              </p>
            </section>

            {/* Section 6: Governing Law */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Gavel className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>6. Governing Law & Dispute Resolution</span>
              </h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any legal disputes or proceedings arising out of your use of this platform shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}