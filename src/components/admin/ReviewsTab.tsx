"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MessageSquare, Trash2, Send, Loader2, User, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { replyToReviewAction, deleteReviewAction } from "@/app/actions/admin";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  
  const supabase = createClient();

  // Fetch saare reviews aur unke app ka naam
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_reviews")
      .select("*, apps(title)") // Ye automatically app ka naam fetch kar lega
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleReplySubmit = (reviewId: string) => {
    if (!replyText) return toast.error("Reply text cannot be empty.");
    startTransition(async () => {
      const result = await replyToReviewAction(reviewId, replyText);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(result.message);
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, admin_reply: replyText } : r));
        setReplyingTo(null);
        setReplyText("");
      }
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    startTransition(async () => {
      const result = await deleteReviewAction(reviewId);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(result.message);
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">App Reviews Hub</h2>
              <p className="text-xs text-zinc-400">Manage all user feedback and ratings</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-amber-400">
            {reviews.length} Reviews
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/30">
            <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-medium">No reviews submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-black/60 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                
                {/* Review Header (User + Rating + App Name) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                        {rev.user_name}
                        <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                          <Smartphone className="w-3 h-3" /> {rev.apps?.title || "Unknown App"}
                        </span>
                      </h4>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {!rev.admin_reply && replyingTo !== rev.id && (
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(rev.id)} className="h-8 text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20">
                        Reply
                      </Button>
                    )}
                    <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleDeleteReview(rev.id)} className="h-8 w-8 p-0 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Review Text */}
                {rev.review_text && <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-white/5">&ldquo;{rev.review_text}&rdquo;</p>}

                {/* Admin Reply Existing */}
                {rev.admin_reply && (
                  <div className="mt-3 ml-6 pl-4 border-l-2 border-emerald-500/40">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 block">Your Reply</span>
                    <p className="text-sm text-zinc-400">{rev.admin_reply}</p>
                  </div>
                )}

                {/* Reply Input Box */}
                {replyingTo === rev.id && (
                  <div className="mt-4 ml-6 flex flex-col sm:flex-row gap-2">
                    <Input 
                      value={replyText} onChange={(e) => setReplyText(e.target.value)} 
                      placeholder="Write your official developer reply..." 
                      className="bg-black/80 border-indigo-500/30 text-white h-10 text-sm rounded-xl flex-1"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleReplySubmit(rev.id)} disabled={isPending} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-4">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} Send
                      </Button>
                      <Button onClick={() => { setReplyingTo(null); setReplyText(""); }} size="sm" variant="ghost" className="text-zinc-400 hover:text-white h-10">Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}