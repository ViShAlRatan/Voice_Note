"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Star, ShieldCheck, Smartphone, Info, Loader2, Share2, LayoutGrid, HardDrive, CheckCircle2, MessageSquare, Send, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AppDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  
  //  New States for Reviews & Rating
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function fetchAppAndReviews() {
      // 1. Fetch App Data
      const { data } = await supabase.from("apps").select("*").eq("id", id).single();
      
      if (data) {
        let parsedScreenshots: string[] = [];
        const rawScreenshots = data.screenshot_urls || data.screenshots;
        if (rawScreenshots) {
          if (Array.isArray(rawScreenshots)) {
            parsedScreenshots = rawScreenshots;
          } else if (typeof rawScreenshots === 'string') {
            try {
              let cleanStr = rawScreenshots;
              if (cleanStr.startsWith('{') && cleanStr.endsWith('}')) {
                cleanStr = cleanStr.replace(/^{/, '[').replace(/}$/, ']');
              }
              parsedScreenshots = JSON.parse(cleanStr);
            } catch (e) {}
          }
        }
        data.final_screenshots = parsedScreenshots;
        data.final_logo = data.logo_url || data.logo || null;
        setApp(data);
      }

      // 2. Fetch User for Review access and Admin Reply access
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) setUserProfile(profile);
      }

      // 3. Fetch Reviews
      const { data: reviewsData } = await supabase.from("app_reviews").select("*").eq("app_id", id).order("created_at", { ascending: false });
      if (reviewsData) setReviews(reviewsData);

      setLoading(false);
    }
    fetchAppAndReviews();
  }, [id]);

  //  Share Functionality
  // const handleShare = async () => {
  //   const url = window.location.href;
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({ title: app.title, text: app.short_description, url });
  //     } catch (error) { console.log("Share cancelled"); }
  //   } else {
  //     await navigator.clipboard.writeText(url);
  //     toast.success("Link copied to clipboard!");
  //   }
  // };

  //  Submit Review Function
  const submitReview = async () => {
    if (!currentUser) return toast.error("Please login to submit a review.");
    if (rating === 0) return toast.error("Please select a star rating.");
    
    setIsSubmitting(true);
    const { data, error } = await supabase.from("app_reviews").insert({
      app_id: id,
      user_id: currentUser.id,
      user_name: userProfile?.full_name || currentUser.email?.split('@')[0] || "Anonymous",
      rating,
      review_text: reviewText
    }).select();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Review submitted!");
      setReviews([data[0], ...reviews]);
      setRating(0);
      setReviewText("");
    }
    setIsSubmitting(false);
  };

  //  Admin Reply Function
  const submitAdminReply = async (reviewId: string) => {
    if (!replyText) return toast.error("Please write a reply.");
    const { error } = await supabase.from("app_reviews").update({ admin_reply: replyText }).eq("id", reviewId);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reply posted!");
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, admin_reply: replyText } : r));
      setReplyingTo(null);
      setReplyText("");
    }
  };

  // Calculate Average Rating
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-zinc-500 text-sm font-medium animate-pulse">Loading App Details...</p>
      </div>
    );
  }

  if (!app) return <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center">App not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-indigo-500/30 font-sans pb-24">
      
      {/* --- DYNAMIC BACKGROUND BLUR --- */}
      <div className="absolute top-0 left-0 right-0 h-[400px] opacity-20 z-0 overflow-hidden pointer-events-none">
        {!logoError && app.final_logo && (
          <img src={app.final_logo} className="w-full h-full object-cover blur-[100px] scale-110" alt="" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 relative z-10">
        
        {/* --- TOP NAVIGATION & SHARE --- */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/apps" className="inline-flex items-center gap-2 text-sm text-zinc-400
           hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>

          
        
        </div>

        {/* --- APP HERO SECTION --- */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-12 
        text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-36 h-36 md:w-44 md:h-44 shrink-0 rounded-[2.5rem] bg-zinc-900 border
             border-white/10 shadow-2xl overflow-hidden shadow-indigo-500/10 flex items-center 
             justify-center relative"
          >
            {!logoError && app.final_logo ? (
              <img src={app.final_logo} alt={app.title} className="w-full h-full object-cover" 
              onError={() => setLogoError(true)} />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-600">
                <Smartphone className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-[10px] uppercase tracking-widest font-bold">App Icon</span>
              </div>
            )}
            <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] 
            pointer-events-none"></div>
          </motion.div>

          <div className="flex-1 w-full mt-2 md:mt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md
                 bg-blue-500/10 text-blue-400 text-[11px] font-bold uppercase tracking-wider border
                  border-blue-500/20">
                  <Smartphone className="w-3.5 h-3.5" /> Flutter App
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">{app.title}</h1>
              <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto md:mx-0 leading-relaxed mb-6">
                {app.short_description || "A powerful, secure, android application developed with Flutter."}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <a href={app.download_url || app.apk_url || "#"} download target="_blank" rel="noreferrer" className="block w-full md:w-auto md:inline-block">
                <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-95">
                  <Download className="w-5 h-5" /> Download APK
                </Button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* --- APP STATS ROW (Updated with Dynamic Ratings) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between md:justify-start gap-4 md:gap-16 py-6 mb-12 border-y border-white/10 overflow-x-auto scrollbar-hide px-2 md:px-4"
        >
          <div className="flex flex-col items-center shrink-0">
            <span className="text-xl md:text-2xl font-bold flex items-center gap-1.5">
              {avgRating} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">
              {reviews.length} {reviews.length === 1 ? 'Rating' : 'Ratings'}
            </span>
          </div>
          <div className="w-px h-10 bg-white/10 shrink-0"></div>
          
          <div className="flex flex-col items-center shrink-0">
            <span className="text-xl md:text-2xl font-bold flex items-center gap-1.5">
              <HardDrive className="w-5 h-5 text-zinc-400" /> {app.file_size || "35 MB"}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">Size</span>
          </div>
          <div className="w-px h-10 bg-white/10 shrink-0"></div>
          
          <div className="flex flex-col items-center shrink-0">
            <span className="text-xl md:text-2xl font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> v{app.version || "1.0.0"}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mt-1">Version</span>
          </div>
        </motion.div>

        {/* --- RATE & REVIEW SECTION (Before Screenshots) --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-14 bg-zinc-950/50 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-indigo-400" /> Rate this App</h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110 active:scale-95">
                <Star className={`w-8 h-8 ${rating >= star ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`} />
              </button>
            ))}
          </div>
          <textarea 
            value={reviewText} onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write an optional review..." 
            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px] mb-4 resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={submitReview} disabled={isSubmitting} className="bg-white text-black hover:bg-zinc-200 rounded-xl font-medium px-6">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : "Submit Review"}
            </Button>
          </div>
        </motion.div>

        {/* --- SCREENSHOTS GALLERY --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-14">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-400"/> Screenshots
          </h3>
          
          {app.final_screenshots && app.final_screenshots.length > 0 ? (
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {app.final_screenshots.map((url: string, idx: number) => (
                <div key={idx} className="shrink-0 snap-center w-[220px] md:w-[260px] aspect-[9/19] rounded-3xl bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl relative group flex items-center justify-center">
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = "https://placehold.co/300x600/18181b/3f3f46?text=Image+Broken"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 rounded-3xl border border-dashed border-white/10 bg-zinc-900/30 flex flex-col items-center justify-center text-zinc-500">
              <Smartphone className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm font-medium">No screenshots provided</p>
            </div>
          )}
        </motion.div>

        {/* --- ABOUT SECTION --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-14">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400"/> About this App
          </h3>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 md:p-10">
            <div className="prose prose-invert max-w-none text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
              {app.description || app.full_description || "No description provided."}
            </div>
          </div>
        </motion.div>

        {/* --- REVIEWS DISPLAY SECTION --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400"/> User Reviews
          </h3>
          
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-10 bg-white/5 rounded-3xl border border-white/5">No reviews yet. Be the first to rate!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-zinc-950/60 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{rev.user_name}</h4>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Admin Reply Button */}
                    {userProfile?.role === "admin" && !rev.admin_reply && replyingTo !== rev.id && (
                      <button onClick={() => setReplyingTo(rev.id)} className="text-xs text-indigo-400 hover:text-indigo-300">Reply</button>
                    )}
                  </div>
                  
                  {rev.review_text && <p className="text-zinc-300 text-sm leading-relaxed mt-2">{rev.review_text}</p>}

                  {/* Admin Reply Display */}
                  {rev.admin_reply && (
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-indigo-500/30">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 block">Developer Reply</span>
                      <p className="text-sm text-zinc-400">{rev.admin_reply}</p>
                    </div>
                  )}

                  {/* Admin Reply Input Box */}
                  {replyingTo === rev.id && (
                    <div className="mt-4 ml-6 flex gap-2">
                      <Input 
                        value={replyText} onChange={(e) => setReplyText(e.target.value)} 
                        placeholder="Write developer reply..." 
                        className="bg-black/50 border-white/10 text-white h-9 text-sm rounded-lg"
                      />
                      <Button onClick={() => submitAdminReply(rev.id)} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3">
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => setReplyingTo(null)} size="sm" variant="ghost" className="text-zinc-400 hover:text-white">Cancel</Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}