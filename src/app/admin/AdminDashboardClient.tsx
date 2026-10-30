"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Loader2,
  Trash2,
  Layers,
  PlusCircle,
  Mail,
  MessageSquare,
  Users,
  LogOut,
  Home,
  Wrench,
  Power,
  Star,
  Trophy,
  ShieldAlert,
  Activity,
  Terminal,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { signOutUser } from "@/app/actions/auth";
import { deleteItemAction } from "@/app/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import PublishTab from "@/components/admin/PublishTab";
import ManageTab from "@/components/admin/ManageTab";
import UsersTab from "@/components/admin/UsersTab";
import ReviewsTab from "@/components/admin/ReviewsTab";

export default function AdminDashboardClient({
  initialApps,
  initialNotes,
  initialBlogs,
  initialMessages,
  initialProfiles,
}: any) {
  const router = useRouter();
  const supabase = createClient();

  // State mein "performances" add kiya
  const [activeTab, setActiveTab] = useState<
    | "publish"
    | "manage"
    | "messages"
    | "users"
    | "maintenance"
    | "reviews"
    | "performances"
  >("publish");
  const [isLoggingOut, startLogoutTransition] = useTransition();

  // Performance Tab State
  const [allPerformances, setAllPerformances] = useState<any[]>([]);
  const [isFetchingPerf, setIsFetchingPerf] = useState(false);

  // Maintenance & Messages States
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isFetchingMaintenance, setIsFetchingMaintenance] = useState(true);

  const [deleteMessageModal, setDeleteMessageModal] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
  }>({ isOpen: false, id: null, title: "" });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (activeTab === "maintenance") {
      setIsFetchingMaintenance(true);
      const fetchMaintenanceStatus = async () => {
        const { data } = await supabase
          .from("site_settings")
          .select("is_maintenance")
          .eq("id", 1)
          .single();
        if (data) setIsMaintenance(data.is_maintenance);
        setIsFetchingMaintenance(false);
      };
      fetchMaintenanceStatus();
    }

    if (activeTab === "performances") {
      setIsFetchingPerf(true);
      const fetchAllPerformances = async () => {
        const { data } = await supabase
          .from("user_performances")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setAllPerformances(data);
        setIsFetchingPerf(false);
      };
      fetchAllPerformances();
    }
  }, [activeTab, supabase]);

  const toggleMaintenanceMode = async () => {
    setIsFetchingMaintenance(true);
    const newValue = !isMaintenance;
    const { error } = await supabase
      .from("site_settings")
      .update({ is_maintenance: newValue })
      .eq("id", 1);
    if (error) toast.error("Failed to update Maintenance status.");
    else {
      setIsMaintenance(newValue);
      toast.success(
        newValue
          ? "Maintenance Mode ACTIVATED!"
          : "Maintenance Mode DEACTIVATED!"
      );
    }
    setIsFetchingMaintenance(false);
  };

  const handleAdminLogout = () => {
    startLogoutTransition(async () => {
      const result = await signOutUser();
      if (result?.error) toast.error(result.error);
      else {
        toast("Admin Session Closed! 🛑", {
          icon: "🔒",
          description: "System secured. See you later.",
          style: {
            background: "#18181b",
            color: "white",
            border: "1px solid #ef4444",
          },
        });
        router.refresh();
      }
    });
  };

  function confirmDeleteMessage() {
    if (!deleteMessageModal.id) return;
    startTransition(async () => {
      const result = await deleteItemAction("messages", deleteMessageModal.id!);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Message deleted successfully!");
        setDeleteMessageModal({ isOpen: false, id: null, title: "" });
        router.refresh();
      }
    });
  }

  const safeApps = initialApps || [];
  const safeNotes = initialNotes || [];
  const safeBlogs = initialBlogs || [];
  const safeMessages = initialMessages || [];
  const safeProfiles = initialProfiles || [];
  const totalItemsCount = safeApps.length + safeNotes.length + safeBlogs.length;

  return (
    <div className="min-h-screen bg-[#060609] text-white selection:bg-amber-500 selection:text-black relative overflow-hidden pb-24">
      {/* Cyber Dot-Matrix Background & Executive Ambient Glows */}
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff0c_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="fixed -top-28 left-1/2 -translate-x-1/2 w-[950px] h-[360px] bg-gradient-to-r from-amber-500/10 via-fuchsia-500/10 to-indigo-500/10 blur-[140px] pointer-events-none" />

      {/* --- STICKY ADMIN TOP CONSOLE BAR --- */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#060609]/85 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Console Identity Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  ROOT // CONSOLE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-zinc-500">
                Platform CMS & Telemetry Studio
              </p>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-zinc-900/70 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <Home className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span>Live Site</span>
            </Link>

            <Button
              variant="outline"
              onClick={handleAdminLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/25 bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all h-9 cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>{isLoggingOut ? "Closing..." : "Lock Session"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* --- HERO & LIVE TELEMETRY STRIP --- */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-amber-300 font-mono bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20 mb-3">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Executive Control Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Publish &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
                Manage.
              </span>
            </h1>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed font-mono">
            Monitor student telemetry, publish study modules, and manage system
            permissions from one unified dock.
          </p>
        </div>

        {/* Interactive 4-Column Telemetry Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("manage")}
            className="text-left p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-amber-500/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="font-mono uppercase tracking-wider text-[10px]">
                Total Assets
              </span>
              <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black font-mono text-white">
              {totalItemsCount}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              {safeNotes.length} Notes • {safeApps.length} Apps •{" "}
              {safeBlogs.length} Blogs
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className="text-left p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-indigo-500/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="font-mono uppercase tracking-wider text-[10px]">
                Registered Users
              </span>
              <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black font-mono text-white">
              {safeProfiles.length}
            </p>
            <p className="text-[10px] text-indigo-400/80 mt-1 font-mono">
              Manage access & roles →
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            className="text-left p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-rose-500/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="font-mono uppercase tracking-wider text-[10px]">
                Inbox Doubts
              </span>
              <Mail className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black font-mono text-white">
              {safeMessages.length}
            </p>
            <p className="text-[10px] text-rose-400/80 mt-1 font-mono">
              Direct visitor queries →
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("performances")}
            className="text-left p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-emerald-500/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="font-mono uppercase tracking-wider text-[10px]">
                Test Telemetry
              </span>
              <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-bold text-white truncate">
              Scoreboard
            </p>
            <p className="text-[10px] text-emerald-400/80 mt-1.5 font-mono">
              View student attempts →
            </p>
          </button>
        </div>

        {/* --- SEGMENTED COMMAND DOCK (TABS NAVIGATION) --- */}
        <div className="p-1.5 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 w-max">
            <button
              onClick={() => setActiveTab("publish")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "publish"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Publish New
            </button>

            <button
              onClick={() => setActiveTab("manage")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Manage Content
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activeTab === "manage"
                    ? "bg-black/20 text-black"
                    : "bg-white/10 text-zinc-300"
                }`}
              >
                {totalItemsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "messages"
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Messages
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activeTab === "messages"
                    ? "bg-black/25 text-white"
                    : "bg-white/10 text-zinc-300"
                }`}
              >
                {safeMessages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> User Control
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  activeTab === "users"
                    ? "bg-black/25 text-white"
                    : "bg-indigo-500/20 text-indigo-300"
                }`}
              >
                {safeProfiles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("performances")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "performances"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-lg shadow-emerald-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> User Performances
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "reviews"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Star className="w-3.5 h-3.5" /> User Reviews
            </button>

            <button
              onClick={() => setActiveTab("maintenance")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "maintenance"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" /> System Setup
            </button>
          </div>
        </div>
      </div>

      {/* --- TAB RENDERING AREA --- */}
      <div className="px-6 relative z-20">
        {activeTab === "publish" && <PublishTab />}

        {activeTab === "manage" && (
          <ManageTab
            safeApps={safeApps}
            safeNotes={safeNotes}
            safeBlogs={safeBlogs}
          />
        )}

        {activeTab === "users" && <UsersTab safeProfiles={safeProfiles} />}

        {activeTab === "reviews" && <ReviewsTab />}

        {/* --- USER PERFORMANCES TAB --- */}
        {activeTab === "performances" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.07]">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Students Performance Telemetry
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Real-time mock test scores and attempt history across all
                      users
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-300">
                  {allPerformances.length} Attempts Logged
                </span>
              </div>

              {isFetchingPerf ? (
                <div className="text-center py-16 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
                  <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    Fetching student performances...
                  </p>
                </div>
              ) : allPerformances.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-black/40">
                  <Trophy className="w-9 h-9 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-300 font-semibold">
                    No test attempts recorded yet
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Student quiz scores will automatically populate here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-black/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-zinc-900/60 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
                        <th className="py-3.5 px-5">Student Email</th>
                        <th className="py-3.5 px-5">Paper Module</th>
                        <th className="py-3.5 px-5">Score</th>
                        <th className="py-3.5 px-5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-sm">
                      {allPerformances.map((p) => {
                        const emailStr = p.user_email || "Unknown User";
                        const isPaper1 =
                          String(p.paper_type).toLowerCase() === "paper1";
                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400 uppercase shrink-0">
                                  {emailStr.charAt(0)}
                                </div>
                                <span className="font-medium text-white text-xs sm:text-sm truncate max-w-[220px]">
                                  {emailStr}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                  isPaper1
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                }`}
                              >
                                {p.paper_type}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs">
                                {p.score} / {p.total_questions}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right text-zinc-500 text-xs font-mono">
                              {new Date(p.created_at).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: VISITOR MESSAGES INBOX --- */}
        {activeTab === "messages" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.07]">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Visitor Doubts & Inquiries
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Direct messages submitted via floating doubt widget &
                      contact page
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-bold text-rose-300">
                  {safeMessages.length} Messages
                </span>
              </div>

              {safeMessages.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-black/40">
                  <MessageSquare className="w-9 h-9 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-300 font-semibold">
                    Inbox is completely clear
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    No new visitor messages or doubts received yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {safeMessages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-white/[0.08] hover:border-rose-500/30 transition-all space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                            {msg.name ? msg.name.charAt(0) : "V"}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm flex flex-wrap items-center gap-2">
                              <span>{msg.name}</span>
                              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                                {msg.email}
                              </span>
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-200 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/[0.05] font-sans">
                        &ldquo;{msg.message}&rdquo;
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteMessageModal({
                              isOpen: true,
                              id: msg.id,
                              title: `Message from ${msg.name}`,
                            })
                          }
                          className="border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs rounded-xl cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Entry
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgraded Message Delete Confirmation Modal */}
            {deleteMessageModal.isOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-zinc-950 border border-white/15 rounded-3xl p-7 max-w-md w-full shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Delete Message
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                    Are you sure you want to permanently remove{" "}
                    <span className="text-white font-semibold">
                      {deleteMessageModal.title}
                    </span>
                    ? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() =>
                        setDeleteMessageModal({
                          isOpen: false,
                          id: null,
                          title: "",
                        })
                      }
                      className="w-1/2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-xl h-11 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDeleteMessage}
                      disabled={isPending}
                      className="w-1/2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl h-11 cursor-pointer"
                    >
                      {isPending ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 5: SYSTEM MAINTENANCE SWITCHBOARD --- */}
        {activeTab === "maintenance" && (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-[28px] border border-cyan-500/25 bg-zinc-950/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

              <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-white/[0.07]">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    System Maintenance Switchboard
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Control global website availability and public traffic
                    routing
                  </p>
                </div>
              </div>

              <div className="bg-black/50 border border-white/[0.08] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-mono bg-zinc-900/90 px-3.5 py-1.5 rounded-xl border border-white/10">
                    <span className="text-zinc-400">System Beacon:</span>
                    {isFetchingMaintenance ? (
                      <span className="flex items-center text-zinc-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />{" "}
                        Syncing...
                      </span>
                    ) : (
                      <span
                        className={`font-bold flex items-center gap-1.5 ${
                          isMaintenance ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isMaintenance
                              ? "bg-red-500 animate-ping"
                              : "bg-emerald-400"
                          }`}
                        />
                        {isMaintenance
                          ? "LOCKDOWN (Site Hidden)"
                          : "ONLINE (Site Public)"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Global Maintenance Mode
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Activating this switch intercepts all public visitor traffic
                    and displays a Maintenance screen.{" "}
                    <span className="text-cyan-300 font-medium">
                      Admin accounts retain full bypass privileges across all
                      routes.
                    </span>
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  <Button
                    onClick={toggleMaintenanceMode}
                    disabled={isFetchingMaintenance}
                    className={`w-full md:w-52 h-14 rounded-2xl font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer ${
                      isMaintenance
                        ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white shadow-cyan-500/20"
                    }`}
                  >
                    {isFetchingMaintenance ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Power className="w-5 h-5 mr-2" />
                        {isMaintenance ? "Deactivate Lock" : "Engage Lock"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}