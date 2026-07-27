"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Loader2, BookOpen, AlertCircle, Grid, Sparkles, Award, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const paper = searchParams.get("paper") || "paper1";
  const selectedUnit = searchParams.get("unit"); // unit1, unit2, etc. or 'all'

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [answeredMap, setAnsweredMap] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const isSavedRef = useRef(false);

  // Jab unit select ho jaye, tab questions fetch karein
  useEffect(() => {
    if (!selectedUnit) return;

    async function fetchQuestions() {
      setLoading(true);
      let query = supabase
        .from('question_bank')
        .select('*')
        .eq('paper_type', paper);

      if (selectedUnit !== 'all') {
        query = query.eq('unit_number', selectedUnit);
      }

      const { data } = await query;
      if (data) setQuestions(data);
      setLoading(false);
    }
    fetchQuestions();
  }, [paper, selectedUnit, supabase]);

  // Quiz finish hone par score save karna (Try-catch ke sath taaki crash na ho)
  useEffect(() => {
    if (quizFinished && !isSavedRef.current) {
      isSavedRef.current = true;
      async function savePerformance() {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          await supabase.from('user_performances').insert({
          user_id: user.id,
          user_email: user.email || 'guest',
          paper_type: paper,
          unit_number: selectedUnit || 'all',
          score: score,
          total_questions: questions.length
        });
        } 
        catch (err) {
          console.error("Error saving performance:", err);
        }
      }
      savePerformance();
    }
  }, [quizFinished, score, questions.length, paper, supabase]);

  const paperName = paper === 'paper1' ? 'Paper 1 (General)' : 'Paper 2 (Computer Science)';

  // Agar user ne unit select nahi kiya hai
  if (!selectedUnit) {
    return (
      <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10 max-w-4xl mx-auto flex flex-col justify-center">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push('/notes?view=questions')} className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-semibold bg-zinc-900/60 border border-white/10 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            {paperName}
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Select Practice Unit 🎯</h1>
          <p className="text-zinc-400 text-sm">Chunein ki aapko kis unit ki practice karni hai, ya saari units ke liye 'All Units' select karein.</p>
        </div>

        {/* All Units Option */}
        <div 
          onClick={() => router.push(`/practice?paper=${paper}&unit=all`)}
          className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between group shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">All Units Combined Test</h3>
              <p className="text-xs text-zinc-400">Poore syllabus ke mix questions ke sath practice karein</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Unit 1 to 10 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((u) => (
            <div
              key={u}
              onClick={() => router.push(`/practice?paper=${paper}&unit=unit${u}`)}
              className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-emerald-500/50 hover:bg-zinc-900/50 transition-all cursor-pointer group flex items-center justify-between shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  {u}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-200">Unit {u}</h4>
                  <p className="text-[11px] text-zinc-500">Practice MCQs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-zinc-400 font-medium mt-4 tracking-wide">Loading Questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-zinc-900/80 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
          <BookOpen className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
        <p className="text-zinc-400 text-center max-w-md mb-8 text-sm">
          Is unit mein abhi koi questions available nahi hain. Kripya doosri unit select karein ya Admin panel se add karein.
        </p>
        <button onClick={() => router.push(`/practice?paper=${paper}`)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all cursor-pointer">
          Change Unit
        </button>
      </div>
    );
  }

  // Quiz Finished State (Ab yeh 100% render hoga)
  if (quizFinished) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-12 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-zinc-950/90 border border-white/10 p-8 md:p-12 rounded-[2.5rem] max-w-md w-full text-center shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-inner">
            <Award className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-3xl font-black mb-1">Test Completed! 🎉</h2>
          <p className="text-zinc-400 text-sm mb-6">{selectedUnit === 'all' ? 'All Units Test' : `Unit ${selectedUnit.replace('unit', '')}`}</p>
          
          <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-b from-zinc-900 to-black border-4 border-emerald-500/30 flex flex-col items-center justify-center mb-8 shadow-2xl relative">
            <span className="text-5xl font-black text-emerald-400 tracking-tight">{score}</span>
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Out of {questions.length}</span>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push('/performance')} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-base shadow-xl transition-all cursor-pointer">
              View Performance History 📈
            </Button>
            <Button onClick={() => router.push(`/practice?paper=${paper}`)} className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold rounded-2xl text-base transition-all cursor-pointer">
              Practice Another Unit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentSelectedOpt = selectedAnswers[currentIndex] || null;
  const isCurrentAnswered = answeredMap[currentIndex] || false;

  const handleSelectOpt = (optLabel: string) => {
    if (isCurrentAnswered) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optLabel });
  };

  const handleCheck = () => {
    if (!currentSelectedOpt) return;
    setAnsweredMap({ ...answeredMap, [currentIndex]: true });

    if (currentSelectedOpt === currentQ.correct_answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((c) => c + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6 md:py-10 font-sans pb-24 relative overflow-hidden">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <button onClick={() => router.push(`/practice?paper=${paper}`)} className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors bg-zinc-900/60 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Change Unit
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5" /> {selectedUnit === 'all' ? 'All Units' : `Unit ${selectedUnit.replace('unit', '')}`}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Main Question Card */}
        <div className="lg:col-span-3 bg-zinc-950/60 backdrop-blur-2xl border border-white/10 p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
              Question {currentIndex + 1} <span className="text-zinc-600">/</span> {questions.length}
            </span>
            {currentQ.unit_number && (
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-lg font-bold border border-emerald-500/20 uppercase tracking-wider">
                {String(currentQ.unit_number).replace('unit', 'Unit ')}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold leading-snug mb-8 text-zinc-100">
            {currentQ.question}
          </h2>

          <div className="space-y-3.5 mb-8">
            {[
              { key: 'opta', label: 'A' },
              { key: 'optb', label: 'B' },
              { key: 'optc', label: 'C' },
              { key: 'optd', label: 'D' }
            ].map((opt) => {
              const optionText = currentQ[opt.key];
              if (!optionText) return null;

              const isSelected = currentSelectedOpt === opt.label;
              const isCorrect = isCurrentAnswered && opt.label === currentQ.correct_answer;
              const isWrong = isCurrentAnswered && isSelected && opt.label !== currentQ.correct_answer;

              let optStyle = "bg-zinc-900/40 border-white/10 text-zinc-300 hover:border-emerald-500/40 hover:bg-zinc-900/80";
              
              if (isCurrentAnswered) {
                if (isCorrect) optStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold shadow-lg shadow-emerald-500/5";
                else if (isWrong) optStyle = "bg-red-500/10 border-red-500 text-red-300 font-semibold";
                else optStyle = "bg-zinc-950/20 border-white/5 text-zinc-600 opacity-40";
              } else if (isSelected) {
                optStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold shadow-md";
              }

              return (
                <button
                  key={opt.key}
                  disabled={isCurrentAnswered}
                  onClick={() => handleSelectOpt(opt.label)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${optStyle}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border transition-colors ${isCurrentAnswered && isCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : isSelected ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-white/10 bg-white/5 text-zinc-400 group-hover:border-white/20'}`}>
                      {opt.label}
                    </span>
                    <span className="text-sm md:text-base">{optionText}</span>
                  </div>
                  
                  {isCurrentAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isCurrentAnswered && isWrong && <XCircle className="w-5 h-5 text-red-400" />}
                </button>
              );
            })}
          </div>

          {isCurrentAnswered && currentQ.explanation && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md">
              <h4 className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4" /> Explanation
              </h4>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          <div className="pt-6 border-t border-white/10">
            {!isCurrentAnswered ? (
              <Button 
                onClick={handleCheck} 
                disabled={!currentSelectedOpt}
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl text-base disabled:opacity-40 cursor-pointer shadow-xl transition-all"
              >
                Check Answer
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 transition-all"
              >
                {currentIndex + 1 < questions.length ? "Next Question" : "Complete Test"} <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>

        </div>

        {/* Sidebar Question Palette */}
        <div className="lg:col-span-1 bg-zinc-950/60 backdrop-blur-2xl border border-white/10 p-5 rounded-[2.5rem] shadow-2xl space-y-5 sticky top-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-400" /> Palette
            </span>
            <span className="text-xs font-mono bg-white/5 px-2.5 py-1 rounded-lg text-zinc-400 border border-white/5">{questions.length} Qs</span>
          </div>

          <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 max-h-[320px] overflow-y-auto pr-1">
            {questions.map((_, index) => {
              const isAnswered = answeredMap[index];
              const isSelectedCurrent = currentIndex === index;

              let btnStyle = "bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/30 hover:bg-zinc-900";
              if (isAnswered) {
                btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-sm";
              } else if (selectedAnswers[index]) {
                btnStyle = "bg-indigo-500/20 border-indigo-500/50 text-indigo-300";
              }

              if (isSelectedCurrent) {
                btnStyle += " ring-2 ring-white shadow-md scale-105";
              }

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-11 rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${btnStyle}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>}>
      <QuizContent />
    </Suspense>
  );
}