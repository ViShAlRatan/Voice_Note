"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Clock, Sparkles, ChevronLeft, ChevronRight, FileText, AlertCircle, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DigitalTopicReaderPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  // 🔥 SAFE ID EXTRACTION: Folder ka naam chahe [id] ho ya [topicId], dono kaam karenge
  const topicId = (params?.topicId || params?.id || params?.slug) as string;

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [contentPages, setContentPages] = useState<string[]>([]);

  useEffect(() => {
    if (!topicId) {
      setErrorMsg("Error: URL se Topic ID nahi mil rahi hai. Kripya URL check karein.");
      setLoading(false);
      return;
    }

    async function fetchTopic() {
      try {
        // .single() hata diya taaki strictly crash na ho
        const { data, error } = await supabase
          .from('digital_topics')
          .select('*')
          .eq('id', topicId); 

        if (error) {
          setErrorMsg(`Database Error: ${error.message}`);
        } else if (data && data.length > 0) {
          const fetchedTopic = data[0];
          setTopic(fetchedTopic);
          
          // Content ko Pages mein split karna (Dono naye aur purane format ko support karega)
          let pages = [];
          if (fetchedTopic.pages) {
            try {
              pages = typeof fetchedTopic.pages === 'string' ? JSON.parse(fetchedTopic.pages) : fetchedTopic.pages;
            } catch (e) {
              pages = [fetchedTopic.pages];
            }
          } else {
            pages = (fetchedTopic.content || "").split('[PAGE_BREAK]');
          }
          
          setContentPages(pages);
        } else {
          setErrorMsg("Is ID ka koi topic database mein nahi mila.");
        }
      } catch (err: any) {
        setErrorMsg(`System Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTopic();
  }, [topicId, params, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-400">Loading Topic Content...</p>
      </div>
    );
  }

  // 🔴 AGAR ERROR HAI YA DATA NAHI MILA (WITH DEBUGGER) 🔴
  if (!topic) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-black mb-2 text-white">Topic Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6 text-center">We couldn't load this topic.</p>
        
        {/* Smart Debugger Panel */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-lg w-full mb-8 shadow-2xl">
          <h3 className="flex items-center gap-2 text-red-400 font-bold mb-4 border-b border-white/10 pb-2">
            <Bug className="w-5 h-5" /> Error Details (For Admin)
          </h3>
          <ul className="space-y-3 text-xs font-mono text-zinc-300 break-words">
            <li><span className="text-zinc-500">Extracted ID:</span> <span className="text-emerald-400">{topicId || "UNDEFINED"}</span></li>
            <li><span className="text-zinc-500">URL Parameters:</span> {JSON.stringify(params)}</li>
            <li><span className="text-zinc-500">System Message:</span> <span className="text-amber-400">{errorMsg}</span></li>
          </ul>
        </div>

        <Button onClick={() => router.push('/notes?view=digital')} className="bg-white text-black hover:bg-zinc-200 font-bold px-8 h-12 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Knowledge Base
        </Button>
      </div>
    );
  }

  const totalPages = contentPages.length;

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-8 font-sans pb-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.push('/notes?view=digital')} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all text-sm font-semibold shadow-lg backdrop-blur-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Notes
          </button>
          
          <div className="flex items-center gap-2">
            {topic.paper_type && (
              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-3 py-1.5 rounded-full border border-blue-500/20 font-bold uppercase tracking-wider">
                {topic.paper_type === 'paper1' ? 'Paper 1' : 'Paper 2'}
              </span>
            )}
            <span className="bg-zinc-900 text-zinc-300 text-[10px] px-3 py-1.5 rounded-full border border-white/10 font-bold uppercase flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {topic.read_time}
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {topic.title}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed border-l-2 border-emerald-500 pl-4">
            {topic.description}
          </p>
        </div>

        {/* 🔥 TOP PAGINATION NAVIGATION 🔥 */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950/80 border border-white/10 p-3 rounded-2xl mb-8 backdrop-blur-md sticky top-4 z-50 shadow-2xl">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
              <FileText className="w-4 h-4 text-emerald-400" /> 
              Page {currentPage + 1} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => {
                  setCurrentPage(prev => Math.max(0, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                disabled={currentPage === 0}
                variant="outline"
                className="h-9 px-3 bg-zinc-900 border-white/10 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              
              <div className="hidden sm:flex items-center gap-1">
                {contentPages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === idx ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <Button 
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                disabled={currentPage === totalPages - 1}
                variant="outline"
                className="h-9 px-3 bg-zinc-900 border-white/10 hover:bg-zinc-800 disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* CONTENT RENDERER */}
        <div className="bg-zinc-950/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl animate-in fade-in duration-500 min-h-[50vh]">
          <div 
            className="prose prose-invert prose-emerald max-w-none 
              prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl 
              prose-a:text-emerald-400 prose-p:text-zinc-300 prose-p:leading-relaxed 
              prose-li:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10"
            dangerouslySetInnerHTML={{ __html: contentPages[currentPage] }} 
          />
        </div>

        {/* 🔥 BOTTOM PAGINATION NAVIGATION 🔥 */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/80 border border-white/10 p-5 rounded-2xl mt-8 backdrop-blur-md shadow-xl">
            <Button 
              onClick={() => {
                setCurrentPage(prev => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              disabled={currentPage === 0}
              className="w-full sm:w-auto h-12 px-6 bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 mr-2" /> Previous Page
            </Button>
            
            <div className="text-zinc-500 text-sm font-medium">
              Reading Page <span className="text-white font-bold">{currentPage + 1}</span> of {totalPages}
            </div>

            {currentPage === totalPages - 1 ? (
              <Button 
                onClick={() => router.push('/notes?view=digital')}
                className="w-full sm:w-auto h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Finish Topic <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="w-full sm:w-auto h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Next Page <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}