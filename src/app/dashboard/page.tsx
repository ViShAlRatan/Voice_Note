"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  BookOpen,
  Terminal,
  Sparkles,
  Camera,
  Loader2,
  ArrowUpRight,
  Layers,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/ui/LogoutButton";
import { toast } from "sonner";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [counts, setCounts] = useState({ apps: 0, notes: 0, blogs: 0, digitalNotes: 0 });
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Fetch Auth User
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      router.push("/login");
      return;
    }
    setUser(user);

    // 2. Fetch Profile & All Stats in Parallel for Instant Loading
    const [
      { data: profileData },
      { count: appsCount },
      { count: notesCount },
      { count: blogsCount },
      { count: digitalNotesCount },
      { data: rawSubjects },
      { data: rawTopics },
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("apps").select("*", { count: "exact", head: true }),
      supabase.from("notes").select("*", { count: "exact", head: true }),
      supabase.from("blogs").select("*", { count: "exact", head: true }),
      supabase.from("digital_topics").select("*", { count: "exact", head: true }),
      supabase.from("digital_subjects").select("id, name, icon"),
      supabase.from("digital_topics").select("subject_id"),
    ]);

    if (profileData) {
      setProfile(profileData);
    }

    // Mapping subjects with their exact topic counts
    let subjectsMap: any[] = [];
    if (rawSubjects) {
      subjectsMap = rawSubjects.map((sub) => {
        const topicCount = rawTopics
          ? rawTopics.filter((t) => t.subject_id === sub.id).length
          : 0;
        return { ...sub, count: topicCount };
      });
      subjectsMap.sort((a, b) => b.count - a.count);
    }

    setCounts({
      apps: appsCount || 0,
      notes: notesCount || 0,
      blogs: blogsCount || 0,
      digitalNotes: digitalNotesCount || 0,
    });
    setSubjectsList(subjectsMap);
    setLoading(false);
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    toast.loading("Uploading your photo...", { id: "avatar-upload" });

    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      toast.dismiss("avatar-upload");
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

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq("id", profile.id);

    toast.dismiss("avatar-upload");

    toast("Profile photo updated! 📸", {
      icon: "✨",
      description: "Looking good! Your new avatar is live.",
      style: {
        background: "#18181b",
        color: "white",
        border: "1px solid #6366f1",
      },
    });

    fetchData();
    setUploading(false);
  };

  // Full-screen Premium Loader while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-2xl mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
        <p className="text-zinc-400 font-mono text-xs tracking-[0.25em] uppercase">
          Loading Workspace
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Subtle Background Grid & Ambient Glows */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="fixed -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Sticky Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/70 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:border-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session Active</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Hero Profile Bento Banner */}
        <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-b from-zinc-900/70 to-zinc-950/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top Accent Shimmer */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left: Avatar + User Identity */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Avatar with Glowing Ring & Upload Trigger */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 opacity-40 blur-md group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-zinc-700">
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-700 uppercase text-white">
                        {profile?.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Overlay + Floating Camera Badge */}
                <label className="absolute inset-0 rounded-full bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-xs">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-200">
                        Update
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>

                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-zinc-900 border border-white/15 flex items-center justify-center text-indigo-400 shadow-lg pointer-events-none">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Greeting & Email Pill */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[11px] font-medium text-indigo-300">
                  <Sparkles className="w-3 h-3" />
                  <span>Personal Learning Workspace</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-white to-zinc-400 bg-clip-text text-transparent">
                    {profile?.full_name ? profile.full_name.split(" ")[0] : "Creator"}
                  </span>
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Total Summary Pill Box */}
            <div className="w-full md:w-auto flex items-center justify-center gap-6 px-6 py-4 rounded-2xl bg-black/50 border border-white/[0.08]">
              <div className="text-center">
                <p className="text-2xl font-extrabold font-mono text-white">
                  {counts.notes + counts.digitalNotes}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">
                  Study Notes
                </p>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-extrabold font-mono text-white">
                  {counts.apps}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">
                  Apps Built
                </p>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-extrabold font-mono text-white">
                  {counts.blogs}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mt-0.5">
                  Articles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Featured Card: Knowledge Base (Spans 6 cols on large screens) */}
          <div className="lg:col-span-6 rounded-[26px] border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/10 blur-[70px] rounded-full pointer-events-none" />

            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                      Study Vault
                    </span>
                    <h3 className="text-xl font-bold text-white">Knowledge Base</h3>
                  </div>
                </div>

                <div className="text-right bg-black/50 border border-white/10 px-3.5 py-2 rounded-2xl">
                  <span className="text-2xl font-extrabold font-mono text-white">
                    {counts.notes + counts.digitalNotes}
                  </span>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider">
                    Total Units
                  </p>
                </div>
              </div>

              {/* Handwritten vs Digital Breakdown Pills */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.07] flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Handwritten PDFs</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {counts.notes}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.07] flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Digital Topics</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {counts.digitalNotes}
                  </span>
                </div>
              </div>

              {/* Dynamic Subjects List */}
              {subjectsList.length > 0 ? (
                <div className="mb-6">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-emerald-400" /> Active Subjects
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {subjectsList.map((s: any) => (
                      <div
                        key={s.id}
                        className="shrink-0 flex items-center gap-2 bg-zinc-900/90 border border-white/10 hover:border-emerald-500/30 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span className="text-sm">{s.icon}</span>
                        <span className="text-xs text-zinc-200 font-medium">
                          {s.name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                          {s.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 mb-6">
                  Structured GATE & UGC NET CS engineering manuals and handwritten notes.
                </p>
              )}
            </div>

            {/* Bottom CTA Link */}
            <Link
              href="/notes"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-semibold text-emerald-300 flex items-center justify-between transition-all group/btn"
            >
              <span>Open Knowledge Base</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>

          {/* 2. Flutter Apps Hub Card (Spans 3 cols on large screens) */}
          <div className="lg:col-span-3 rounded-[26px] border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-7 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold font-mono text-white">
                  {counts.apps}
                </span>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Mobile Builds
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5 mb-2">
                Flutter Apps Hub
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Cross-platform production APK builds and mobile utilities deployed for students.
              </p>
            </div>

            <Link
              href="/apps"
              className="w-full py-3 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-xs font-semibold text-indigo-300 flex items-center justify-between transition-all group/btn"
            >
              <span>Explore Apps Hub</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>

          {/* 3. Tech Articles Card (Spans 3 cols on large screens) */}
          <div className="lg:col-span-3 rounded-[26px] border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-7 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-3xl font-extrabold font-mono text-white">
                  {counts.blogs}
                </span>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-semibold">
                Engineering Blog
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5 mb-2">
                Tech Articles
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Published system architecture deep-dives, tutorials, and CS concepts.
              </p>
            </div>

            <Link
              href="/blog"
              className="w-full py-3 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-xs font-semibold text-purple-300 flex items-center justify-between transition-all group/btn"
            >
              <span>Read Articles</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}