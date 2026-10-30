"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, CheckCircle2, Award, Cpu, BadgeCheck, Lightbulb, RefreshCw, Heart, BookOpen } from "lucide-react";
import Link from "next/link";

// --- QUICK FLASHCARDS (Only used in Hero) ---
const dailyConcepts = [
  {
    tag: "GATE / NET Logic Trick",
    title: "Contrapositive Equivalence",
    formula: "p → q  ≡  ¬q → ¬p",
    desc: "An implication is ALWAYS logically equivalent to its contrapositive, never its converse!"
  },
  {
    tag: "Paper 1: Teaching Aptitude",
    title: "Levels of Teaching Proponents",
    formula: "Memory: Herbart | Understanding: Morrison | Reflective: Hunt",
    desc: "Remember the hierarchy: MLT (Thoughtless) ➔ ULT (Thoughtful) ➔ RLT (Problem-Centric)."
  },
  {
    tag: "First-Order Logic Rule",
    title: "Quantifier Distribution",
    formula: "∀x (P(x) ∧ Q(x)) ≡ ∀x P(x) ∧ ∀x Q(x)",
    desc: "Universal Quantifier (∀) distributes over AND (∧), while Existential (∃) distributes over OR (∨)."
  }
];

const words = [
  "YouTube Lecture Notes.", 
  "UGC NET Paper 1 & 2.", 
  "CS Question Banks.", 
  "CS Concepts."
];

interface HeroSectionProps {
  user: any;
  role: string;
}

export default function HeroSection({ user, role }: HeroSectionProps) {
  // Typing Effect State
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = 75;

  // Concept Booster State
  const [conceptIndex, setConceptIndex] = useState(0);

  // Parallax Scroll State
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, -35]); 

  // Typing Effect Logic
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );
      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? typingSpeed / 2 : typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const nextConcept = () => {
    setConceptIndex((prev) => (prev + 1) % dailyConcepts.length);
  };

  return (
    <section className="relative pt-24 pb-12 sm:pt-32 md:pt-36 md:pb-20 px-4 sm:px-6 lg:px-8 z-10 pointer-events-auto overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[85vw] sm:w-[70vw] h-[40vh] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-36 right-5 w-[40vw] h-[30vh] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column: Value Proposition & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-zinc-900/90 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm text-zinc-200 border border-white/10 mb-5 sm:mb-6 shadow-xl backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[11px] border border-red-500/30">
              <PlayCircle className="w-3.5 h-3.5" /> YT Companion
            </span>
            <span className="font-medium text-zinc-300">Watch on YouTube • <strong className="text-white">Revise & Practice Here</strong></span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} 
            className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-5"
          >
            Don't Just Watch. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Master Every Concept.
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl font-bold text-zinc-300 mb-4 min-h-[2rem] sm:min-h-[2.25rem]"
          >
            Your hub for <span className="text-indigo-400 underline decoration-indigo-500/40 underline-offset-4">{text}</span>
            <span className="animate-pulse text-white">|</span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} 
            className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mb-7 sm:mb-8 leading-relaxed"
          >
            Jo topics hum YouTube class mein samajhte hain, unke <strong className="text-white">Color-Coded Digital Notes</strong>, <strong className="text-amber-300">Handwritten PDFs</strong>, aur <strong className="text-emerald-400">CS / UGC NET Level MCQs</strong> aapko seedha yahan milenge.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} 
            className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
          >
            <Link href="/notes" className="w-full sm:w-auto group">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl h-12 sm:h-14 px-6 sm:px-8 font-black shadow-[0_0_35px_rgba(99,102,241,0.35)] transition-all group-hover:scale-105 text-sm sm:text-base border border-indigo-400/40">
                <BookOpen className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Open Class Notes <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#lectures" className="w-full sm:w-auto group">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl border-red-500/30 bg-red-500/10 hover:bg-red-500/20 h-12 sm:h-14 px-6 sm:px-8 text-red-300 backdrop-blur-xl font-bold text-sm sm:text-base transition-all group-hover:scale-105">
                <PlayCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> Watch Latest Lectures
              </Button>
            </Link>
          </motion.div>

          <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-[11px] sm:text-xs font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 100% Free Forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Paper 1 & Paper 2 CS</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> Direct PYQ Explanations</span>
          </div>
        </div>

        {/* Right Column: Educator & Engineer Card */}
        <motion.div style={{ y: imageY }} className="lg:col-span-5 flex flex-col items-center w-full">
          <div className="relative w-full max-w-md lg:max-w-none rounded-[2rem] p-[3px] bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-white/10 shadow-[0_25px_70px_rgba(99,102,241,0.2)]">
            <div className="relative rounded-[calc(4rem-3px)] bg-zinc-950/90 backdrop-blur-2xl overflow-hidden">
              
              <div className="relative h-24 sm:h-28 bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-blue-900/80 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-bold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Mentor Online
                </div>
                <div className="absolute bottom-2.5 right-4 hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-indigo-200/90 bg-black/30 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                  <Cpu className="w-3.5 h-3.5 text-indigo-300" /> CS • AI • FLUTTER
                </div>
              </div>

              <div className="px-5 sm:px-7 pb-6 sm:pb-7">
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-5 text-center sm:text-left">
                  <div className="relative shrink-0 -mt-8 sm:-mt-9">
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-75 animate-pulse" />
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-full border-4 border-zinc-950 overflow-hidden bg-zinc-900 shadow-2xl">
                      <img src="/dev.jpg" alt="Vishal Sharma" className="w-full h-full aspect-square object-cover object-top scale-105 translate-y-1" />
                    </div>
                    <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-indigo-600 border-2 border-zinc-950 flex items-center justify-center text-white shadow-lg" title="Verified Educator">
                      <BadgeCheck className="w-4 h-4 fill-indigo-400 text-zinc-950" />
                    </div>
                  </div>

                  <div className="flex-1 pt-1 sm:pt-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1.5">
                      <Award className="w-3 h-3 text-amber-400" /> Educator & Learner
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Vishal Sharma</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1 leading-snug">
                      Simplifying Computer Science Concepts 
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-5">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-300">🎓 Operating System</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-300">🧠 DBMS & Computer networks</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-300">📱 Computer Graphics & COA</span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 text-center">
                  <div className="p-1.5">
                    <div className="text-base sm:text-lg font-black text-white">120+</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">Logic MCQs</div>
                  </div>
                  <div className="p-1.5 border-x border-white/10">
                    <div className="text-base sm:text-lg font-black text-indigo-400">10 Units</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">Structured</div>
                  </div>
                  <div className="p-1.5">
                    <div className="text-base sm:text-lg font-black text-emerald-400">Free</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">PDFs & Notes</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-indigo-950/50 via-zinc-900/90 to-black border border-indigo-500/30 p-4 sm:p-5 relative shadow-inner">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0" /> {dailyConcepts[conceptIndex].tag}
                    </span>
                    <button 
                      onClick={nextConcept}
                      className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition-all shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" /> Next Tip
                    </button>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-2">{dailyConcepts[conceptIndex].title}</h4>
                  <div className="p-2.5 rounded-xl bg-black/80 border border-indigo-500/25 font-mono text-[11px] sm:text-xs text-emerald-300 text-center font-bold mb-2.5 overflow-x-auto">
                    {dailyConcepts[conceptIndex].formula}
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                    {dailyConcepts[conceptIndex].desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  <Link href="/portfolio" className="text-zinc-300 hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
                    <Heart className="w-3.5 h-3.5 text-pink-400" /> About Vishal
                  </Link>
                  <Link href={user ? (role === "admin" ? "/admin" : "/dashboard") : "/register"} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    {user ? (role === "admin" ? "Open Admin Panel ➔" : "Go to Dashboard ➔") : "Create Student ID ➔"}
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}