"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trophy, Calendar, ArrowLeft, BarChart3, TrendingUp, Sparkles, Layers, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserPerformancePage() {
  const supabase = createClient();
  const router = useRouter();
  const [performances, setPerformances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overall" | "paper" | "unit">("overall");

  useEffect(() => {
    async function fetchMyPerformance() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('user_performances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }); // Chronological order for graphs

      if (data) setPerformances(data);
      setLoading(false);
    }
    fetchMyPerformance();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-zinc-400 font-medium mt-4 tracking-wide text-sm">Loading Visual Analytics...</p>
      </div>
    );
  }

  const totalTests = performances.length;
  const bestScore = totalTests > 0 ? Math.max(...performances.map(p => p.score)) : 0;
  const avgScore = totalTests > 0 ? (performances.reduce((acc, p) => acc + p.score, 0) / totalTests).toFixed(1) : 0;

  // Paper-wise aggregation
  const paperStats = performances.reduce((acc: any, curr) => {
    const p = curr.paper_type || 'paper1';
    if (!acc[p]) acc[p] = { totalScore: 0, count: 0, maxQ: 0 };
    acc[p].totalScore += curr.score;
    acc[p].count += 1;
    acc[p].maxQ = Math.max(acc[p].maxQ, curr.total_questions || 10);
    return acc;
  }, {});

  // Unit-wise aggregation
  const unitStats = performances.reduce((acc: any, curr) => {
    const u = curr.unit_number || 'all';
    if (u === 'all') return acc;
    if (!acc[u]) acc[u] = { totalScore: 0, count: 0 };
    acc[u].totalScore += curr.score;
    acc[u].count += 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 py-8 md:py-12 max-w-5xl mx-auto font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <button 
          onClick={() => router.push('/notes?view=questions')} 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-sm font-semibold shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-2 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" /> Graphical Performance
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Visual Analytics Dashboard 📊
        </h1>
        <p className="text-zinc-400 text-sm">Apne test scores ko overall, paper-wise aur unit-wise graphs ke roop mein dekhein.</p>
      </div>

      {/* Quick Summary Cards */}
      {totalTests > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
          <div className="bg-zinc-950/70 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Tests</p>
              <p className="text-2xl font-black text-white">{totalTests}</p>
            </div>
          </div>

          <div className="bg-zinc-950/70 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Best Score</p>
              <p className="text-2xl font-black text-emerald-400">{bestScore}</p>
            </div>
          </div>

          <div className="bg-zinc-950/70 border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Average Score</p>
              <p className="text-2xl font-black text-white">{avgScore}</p>
            </div>
          </div>
        </div>
      )}

      {/* Graph Filter Tabs */}
      {totalTests > 0 && (
        <div className="flex bg-zinc-950/80 border border-white/10 p-1.5 rounded-2xl mb-8 relative z-10 w-full sm:w-max">
          <button 
            onClick={() => setActiveTab("overall")} 
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'overall' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            📈 Overall Trend
          </button>
          <button 
            onClick={() => setActiveTab("paper")} 
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'paper' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            📚 Paper-wise Graph
          </button>
          <button 
            onClick={() => setActiveTab("unit")} 
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'unit' ? 'bg-emerald-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            🎯 Unit-wise Graph
          </button>
        </div>
      )}

      {/* Empty State */}
      {totalTests === 0 ? (
        <div className="text-center py-20 bg-zinc-950/60 border border-white/10 rounded-[2.5rem] backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-4 text-zinc-500 shadow-inner">
            <Trophy className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Performance Data</h3>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">Phele kuch practice tests complete karein taaki graphs yahan generate ho sakein.</p>
          <Button onClick={() => router.push('/notes?view=questions')} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl px-8 h-12 cursor-pointer shadow-xl">
            Start Practice Test
          </Button>
        </div>
      ) : (
        <div className="relative z-10 space-y-6">
          
          {/* TAB 1: OVERALL TIMELINE TREND GRAPH */}
          {activeTab === "overall" && (
            <div className="bg-zinc-950/80 border border-white/10 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-base text-zinc-200 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> Score Progression Timeline
                </h3>
                <span className="text-xs font-mono text-zinc-500">{totalTests} Test Attempts</span>
              </div>

              {/* SVG Line / Bar Progress Chart */}
              <div className="space-y-4 pt-2">
                {performances.map((item, index) => {
                  const percent = Math.round((item.score / (item.total_questions || 1)) * 100);
                  return (
                    <div key={item.id} className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5 space-y-2 hover:border-white/15 transition-all">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-mono">
                          Attempt #{index + 1} • <span className="text-emerald-400 uppercase font-bold">{item.paper_type}</span> {item.unit_number !== 'all' ? `(${item.unit_number})` : ''}
                        </span>
                        <span className="font-bold text-emerald-400">{item.score} / {item.total_questions} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PAPER-WISE GRAPH */}
          {activeTab === "paper" && (
            <div className="bg-zinc-950/80 border border-white/10 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-base text-zinc-200 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Paper-wise Comparison
                </h3>
                <span className="text-xs font-mono text-zinc-500">Average Scores</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {Object.keys(paperStats).map((paperKey) => {
                  const stat = paperStats[paperKey];
                  const avg = (stat.totalScore / stat.count).toFixed(1);
                  const paperTitle = paperKey === 'paper1' ? 'Paper 1 (General)' : 'Paper 2 (Computer Science)';

                  return (
                    <div key={paperKey} className="bg-zinc-900/50 p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm uppercase tracking-wider">{paperTitle}</span>
                        <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">{stat.count} Tests Given</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Average Score</span>
                          <span className="text-indigo-400 font-bold">{avg} pts</span>
                        </div>
                        <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, (Number(avg) / 10) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: UNIT-WISE GRAPH */}
          {activeTab === "unit" && (
            <div className="bg-zinc-950/80 border border-white/10 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-bold text-base text-zinc-200 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" /> Unit-wise Performance Breakdown
                </h3>
                <span className="text-xs font-mono text-zinc-500">Units 1 to 10</span>
              </div>

              {Object.keys(unitStats).length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-sm">
                  Abhi tak koi specific unit ka test record nahi hai. Unit select karke practice karein!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((uNum) => {
                    const uKey = `unit${uNum}`;
                    const uData = unitStats[uKey];
                    if (!uData) return null;
                    const avgUnitScore = (uData.totalScore / uData.count).toFixed(1);

                    return (
                      <div key={uNum} className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold text-zinc-200">
                          <span>Unit {uNum}</span>
                          <span className="text-emerald-400 text-xs font-mono">{uData.count} Test(s)</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-zinc-400">
                            <span>Avg Score</span>
                            <span className="font-bold text-white">{avgUnitScore}</span>
                          </div>
                          <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(100, (Number(avgUnitScore) / 10) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}