"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const studyModules = {
  paper2: [
    { unit: "Unit 1 • Discrete Structures", title: "Propositional & Predicate Logic", topics: ["Logical Equivalences", "Normal Forms (CNF/DNF)", "Nested Quantifiers", "Rules of Inference"], mcqs: "120+ GATE/NET Questions", readTime: "25 mins", notesLink: "/notes?paper=paper2&unit=unit1", practiceLink: "/practice?paper=paper2&unit=unit1", badge: "🔥 Newly Updated" },
    { unit: "Unit 4 • Database Systems", title: "Relational Algebra & Tuple Calculus", topics: ["Select, Project, Join", "Division Operator", "SQL Equivalences", "Normalization (1NF-BCNF)"], mcqs: "80+ PYQs Included", readTime: "20 mins", notesLink: "/notes?paper=paper2&unit=unit4", practiceLink: "/practice?paper=paper2&unit=unit4", badge: "High Weightage" },
  ],
  paper1: [
    { unit: "Unit 1 • Teaching Aptitude", title: "Teaching: Concept, Objectives & Taxonomies", topics: ["Bipolar vs Tri-polar", "Bloom's & Revised Taxonomy", "Gagne's 9 Events", "Maxims of Teaching"], mcqs: "100+ Statement MCQs", readTime: "18 mins", notesLink: "/notes?paper=paper1&unit=unit1", practiceLink: "/practice?paper=paper1&unit=unit1", badge: "🔥 Live on Site" },
    { unit: "Unit 1 • Teaching Aptitude", title: "Levels of Teaching (MLT, ULT, RLT)", topics: ["Autonomous Level", "Herbart's 5 Steps", "Morrison's Mastery Cycle", "Hunt's Problem Solving"], mcqs: "75+ Assertion-Reason Qs", readTime: "15 mins", notesLink: "/notes?paper=paper1&unit=unit1", practiceLink: "/practice?paper=paper1&unit=unit1", badge: "Must Read" },
  ]
};

export default function ActiveModules() {
  const [activePaperTab, setActivePaperTab] = useState<"paper2" | "paper1">("paper2");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 z-10 relative pointer-events-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            <Flame className="w-4 h-4" /> Direct Classroom Access
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Active Study Modules</h2>
        </div>
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
          <button onClick={() => setActivePaperTab("paper2")} className={`flex-1 md:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activePaperTab === "paper2" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" : "text-zinc-400 hover:text-white"}`}>💻 Paper 2 (CS)</button>
          <button onClick={() => setActivePaperTab("paper1")} className={`flex-1 md:flex-none px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activePaperTab === "paper1" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" : "text-zinc-400 hover:text-white"}`}>🎓 Paper 1 (General)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {studyModules[activePaperTab].map((mod, idx) => (
          <motion.div key={mod.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.08 }} className="rounded-3xl border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/70 p-5 sm:p-7 flex flex-col justify-between transition-all group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold text-indigo-400 truncate">{mod.unit}</span>
                <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 shrink-0">{mod.badge}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">{mod.title}</h3>
              <div className="space-y-2 mb-6">
                {mod.topics.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" /><span>{t}</span></div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium"><span className="text-emerald-400 font-bold">🎯 {mod.mcqs}</span><span>⏱️ {mod.readTime} read</span></div>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link href={mod.notesLink}><Button className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl h-10 text-xs font-bold transition-all">Read Notes</Button></Link>
                <Link href={mod.practiceLink}><Button className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl h-10 text-xs font-bold transition-all">Solve MCQs</Button></Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}