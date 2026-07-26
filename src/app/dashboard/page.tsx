"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Smartphone, BookOpen, Terminal, Sparkles, ArrowRight, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/ui/LogoutButton";
import { toast } from "sonner";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  // 🔥 UPDATED: Added digitalNotes in counts state
  const [counts, setCounts] = useState({ apps: 0, notes: 0, blogs: 0, digitalNotes: 0 });
  const [subjectsList, setSubjectsList] = useState<any[]>([]); // To show active subjects & counts
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Fetch Auth User
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      router.push("/login");
      return;
    }
    setUser(user);

    // 2. Fetch User Profile (For Name and Avatar)
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (profileData) {
      setProfile(profileData);
    }

    // 3. Fetch Stats
    const { count: appsCount } = await supabase.from("apps").select("*", { count: "exact", head: true });
    const { count: notesCount } = await supabase.from("notes").select("*", { count: "exact", head: true });
    const { count: blogsCount } = await supabase.from("blogs").select("*", { count: "exact", head: true });
    
    // 🔥 NEW: Fetch Digital Notes Count & Subjects Breakdown
    const { count: digitalNotesCount } = await supabase.from("digital_topics").select("*", { count: "exact", head: true });
    const { data: rawSubjects } = await supabase.from("digital_subjects").select("id, name, icon");
    const { data: rawTopics } = await supabase.from("digital_topics").select("subject_id");

    // Mapping subjects with their exact topic counts
    let subjectsMap: any[] = [];
    if (rawSubjects) {
      subjectsMap = rawSubjects.map(sub => {
        const topicCount = rawTopics ? rawTopics.filter(t => t.subject_id === sub.id).length : 0;
        return { ...sub, count: topicCount };
      });
      // Sort to show subjects with topics first
      subjectsMap.sort((a, b) => b.count - a.count);
    }

    setCounts({
      apps: appsCount || 0,
      notes: notesCount || 0,
      blogs: blogsCount || 0,
      digitalNotes: digitalNotesCount || 0
    });
    setSubjectsList(subjectsMap);

    setLoading(false);
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    // 1. Uploading shuru hone ka premium toast
    toast.loading("Uploading your photo...", { id: "avatar-upload" });

    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
    
    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
    
    if (uploadError) {
      toast.dismiss("avatar-upload");
      //  PREMIUM ERROR TOAST 
      toast.error("Upload Failed! ❌", {
        description: "Something went wrong. Please try again.",
        style: {
          background: "#18181b",
          color: "white",
          border: "1px solid #ef4444", 
        },
      });
      setUploading(false);
      return;
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    
    // Update Profile Table
    await supabase.from('profiles').update({ avatar_url: publicUrlData.publicUrl }).eq('id', profile.id);
    
    toast.dismiss("avatar-upload");
    
    //  PREMIUM SUCCESS TOAST 
    toast("Profile photo updated! 📸", {
      icon: "✨",
      description: "Looking good! Your new avatar is live.",
      style: {
        background: "#18181b", // Dark zinc
        color: "white",
        border: "1px solid #6366f1",
      },
    });

    fetchData(); // Refresh UI to show new image
    setUploading(false);
  };

  // Full-screen Premium Loader while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Loading Workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Header & Logout */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-30">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full
           bg-zinc-900/60 border border-white/10 text-sm text-zinc-300 hover:text-white
            hover:bg-zinc-800/80 hover:border-white/25 transition-all duration-300 backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Home</span>
        </Link>

        {/* Naya Smart Logout Button */}
        <LogoutButton />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Welcome Banner (UPDATED WITH AVATAR) */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
          
          {/* Avatar Upload Section */}
          <div className="relative group shrink-0 z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-indigo-500/20 overflow-hidden bg-zinc-900 shadow-xl shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-blue-500 uppercase text-white">
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            
            {/* Edit Icon Overlay */}
            <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm">
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-white"/>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-white mb-1"/>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-white">Change</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading}/>
            </label>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>User Workspace</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Welcome back, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Creator'}.
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed mx-auto md:mx-0">
              Signed in as <span className="text-white font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Apps Stat Card */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono text-white">{counts.apps}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Flutter Apps Hub</h3>
            <p className="text-xs text-zinc-400 mb-4 flex-1">Cross-platform APK builds deployed</p>
            <Link href="/apps" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors w-max">
              View Apps Hub <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 🔥 UPDATED Notes Stat Card (Handwritten + Digital Breakdown) 🔥 */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-white">{counts.notes + counts.digitalNotes}</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Total Resources</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
            
            {/* Quick Type Breakdown */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                {counts.notes} Handwritten
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                {counts.digitalNotes} Digital
              </span>
            </div>

            {/* Dynamic Subjects List (Scrollable on mobile) */}
            {subjectsList.length > 0 ? (
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1 items-start">
                {subjectsList.map((s: any) => (
                  <div key={s.id} className="shrink-0 flex items-center gap-1.5 bg-black/50 border border-white/10 px-2.5 py-1.5 rounded-lg shadow-sm">
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-xs text-zinc-300 font-medium">{s.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white/10 px-1.5 py-0.5 rounded-sm border border-white/5">{s.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 mb-5 flex-1">Database & core engineering manuals</p>
            )}

            <Link href="/notes" className="text-xs mt-auto text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors w-max">
              View Knowledge Base <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Blogs Stat Card */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-mono text-white">{counts.blogs}</span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Tech Articles</h3>
            <p className="text-xs text-zinc-400 mb-4 flex-1">Published architecture deep-dives</p>
            <Link href="/blog" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition-colors w-max">
              View Engineering Journal <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}