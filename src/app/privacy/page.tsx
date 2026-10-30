"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Database,
  Eye,
  UserCheck,
  Mail,
  Sparkles,
  FileText,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 30, 2026";

  return (
    <main className="relative min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-[150px] rounded-full pointer-events-none" />

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
          href="/terms"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Terms of Service</span>
        </Link>
      </div>

      {/* Main Glassmorphism Document Card */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/75 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Top Shimmer Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 & IT Act Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Last Updated: <span className="text-zinc-200 font-medium">{lastUpdated}</span>
            </p>
            <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
              This Privacy Policy explains how we collect, use, store, and protect your personal information when you register, access study notes, download handwritten PDFs, or submit queries on our GATE & UGC NET Computer Science educational platform.
            </p>
          </div>

          {/* Policy Content Sections */}
          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Database className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>1. Information We Collect</span>
              </h2>
              <p className="text-zinc-400">
                We collect only the minimum personal data strictly required to provide you with seamless educational services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>
                  <strong className="text-white">Account & Authentication Data:</strong> When you sign up or log in, we collect your name, email address, and encrypted authentication credentials managed via Supabase Auth.
                </li>
                <li>
                  <strong className="text-white">Doubt & Contact Submissions:</strong> When you submit a question or message via our Contact/Doubt form, we store your name, email address, and message content to resolve your query.
                </li>
                <li>
                  <strong className="text-white">Technical & Session Data:</strong> We use essential session cookies and tokens to keep you securely logged in, prevent unauthorized access, and protect our platform against spam or abuse.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>2. How We Use Your Information</span>
              </h2>
              <p className="text-zinc-400">
                Your data is processed solely for legitimate educational and operational purposes based on your explicit consent:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>To create and manage your student account and provide access to GATE & UGC NET CS digital notes and the handwritten PDF vault.</li>
                <li>To respond to your academic doubts, architecture questions, or technical support requests.</li>
                <li>To maintain platform security, enforce Row-Level Security (RLS) policies, and prevent unauthorized scraping or piracy of study materials.</li>
                <li>To send critical account notifications (such as password resets or policy updates). We do <strong className="text-white">not</strong> sell or rent your personal data to third-party marketers.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>3. Data Storage, Security & Third-Party Processors</span>
              </h2>
              <p>
                We implement industry-standard security measures including SSL/TLS encryption, hashed passwords, and database Row-Level Security (RLS). Your data is hosted via trusted cloud infrastructure providers (such as Supabase and Vercel). If automated AI doubt-solving features are enabled on the platform, your submitted academic prompts may be processed by third-party AI APIs (such as Google Gemini or Groq) solely to generate educational responses. Please avoid sharing sensitive personal or financial details inside doubt prompts.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>4. Your Rights Under the DPDP Act, 2023 (India)</span>
              </h2>
              <p className="text-zinc-400">
                As a user (Data Principal) under the Digital Personal Data Protection Act, 2023, you have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>
                  <strong className="text-white">Right to Access & Correction:</strong> You may request a summary of your personal data stored with us and ask for corrections or updates to inaccurate details.
                </li>
                <li>
                  <strong className="text-white">Right to Withdraw Consent & Erasure:</strong> You may withdraw your consent and request permanent deletion of your user account and associated personal data at any time by contacting us.
                </li>
                <li>
                  <strong className="text-white">Children&apos;s Privacy:</strong> Users under 18 years of age must use this platform under the supervision and verifiable consent of a parent or legal guardian.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>5. Cookies Policy</span>
              </h2>
              <p>
                We use strictly necessary cookies and local storage tokens to manage your login session and user preferences. Disabling these essential cookies in your browser may prevent you from logging into your student dashboard.
              </p>
            </section>

            {/* Section 6: Mandatory Grievance Officer */}
            <section className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>6. Grievance Redressal & Contact Information</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300">
                In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, if you have any questions, privacy concerns, or wish to request account/data deletion, please reach out to our Grievance Support Desk via our official{" "}
                <Link href="/contact" className="text-indigo-400 underline hover:text-indigo-300">
                  Contact Form
                </Link>{" "}
                on the home page. We respond to and resolve all valid data requests within standard statutory timelines.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}