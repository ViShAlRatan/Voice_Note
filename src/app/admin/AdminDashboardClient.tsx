"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Loader2, Trash2, Layers, PlusCircle, Mail, MessageSquare, 
  Users, LogOut, Home, Wrench, Power, Star 
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
import ReviewsTab from "@/components/admin/ReviewsTab"; // 🔥 Naya Tab Import Kiya

export default function AdminDashboardClient({ initialApps, initialNotes, initialBlogs, initialMessages, initialProfiles }: any) {
  const router = useRouter();
  const supabase = createClient();
  
  // 🔥 State mein "reviews" add kiya
  const [activeTab, setActiveTab] = useState<"publish" | "manage" | "messages" | "users" | "maintenance" | "reviews">("publish");
  const [isLoggingOut, startLogoutTransition] = useTransition();

  // Maintenance & Messages States (Inko yahin rakha hai taaki zyada files na banani padein)
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isFetchingMaintenance, setIsFetchingMaintenance] = useState(true);
  
  const [deleteMessageModal, setDeleteMessageModal] = useState<{ isOpen: boolean; id: string|null; title: string; }>({ isOpen: false, id: null, title: "" });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (activeTab === "maintenance") {
      setIsFetchingMaintenance(true);
      const fetchMaintenanceStatus = async () => {
        const { data } = await supabase.from('site_settings').select('is_maintenance').eq('id', 1).single();
        if (data) setIsMaintenance(data.is_maintenance);
        setIsFetchingMaintenance(false);
      };
      fetchMaintenanceStatus();
    }
  }, [activeTab, supabase]);

  const toggleMaintenanceMode = async () => {
    setIsFetchingMaintenance(true);
    const newValue = !isMaintenance;
    const { error } = await supabase.from('site_settings').update({ is_maintenance: newValue }).eq('id', 1);
    if (error) toast.error("Failed to update Maintenance status.");
    else {
      setIsMaintenance(newValue);
      toast.success(newValue ? "Maintenance Mode ACTIVATED!" : "Maintenance Mode DEACTIVATED!");
    }
    setIsFetchingMaintenance(false);
  };

  const handleAdminLogout = () => {
    startLogoutTransition(async () => {
      const result = await signOutUser();
      if (result?.error) toast.error(result.error);
      else {
        toast("Admin Session Closed! 🛑", {
          icon: "🔒", description: "System secured. See you later.",
          style: { background: "#18181b", color: "white", border: "1px solid #ef4444" },
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
      else { toast.success("Message deleted successfully!"); setDeleteMessageModal({ isOpen: false, id: null, title: "" }); router.refresh(); }
    });
  }

  const safeApps = initialApps || []; 
  const safeNotes = initialNotes || []; 
  const safeBlogs = initialBlogs || []; 
  const safeMessages = initialMessages || []; 
  const safeProfiles = initialProfiles || [];
  const totalItemsCount = safeApps.length + safeNotes.length + safeBlogs.length;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 selection:bg-white selection:text-black relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 backdrop-blur-xl shadow-lg h-10">
            <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium text-sm">Home</span>
          </Link>
          <Button variant="outline" onClick={handleAdminLogout} disabled={isLoggingOut} className="group flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 backdrop-blur-xl shadow-lg h-10">
            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
            <span className="font-medium">{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 font-mono bg-zinc-900/40 px-3 py-1.5 rounded-full border border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /><span>Control Center & CMS</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Publish & Manage.</h1>
        <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">Full control over platform content, visitor messages, and registered users.</p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="max-w-5xl mx-auto mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-3 w-max px-1">
          <button onClick={() => setActiveTab("publish")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${activeTab === "publish" ? "bg-white text-black border-white shadow-xl scale-105" : "bg-zinc-950/60 text-zinc-300 border-white/10 hover:bg-zinc-900 hover:text-white"}`}>
            <PlusCircle className="w-4 h-4" /> Publish New
          </button>
          
          <button onClick={() => setActiveTab("manage")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${activeTab === "manage" ? "bg-white text-black border-white shadow-xl scale-105" : "bg-zinc-950/60 text-zinc-300 border-white/10 hover:bg-zinc-900 hover:text-white"}`}>
            <Layers className="w-4 h-4" /> Manage Content <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-mono">{totalItemsCount}</span>
          </button>
          
          <button onClick={() => setActiveTab("messages")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${activeTab === "messages" ? "bg-white text-black border-white shadow-xl scale-105" : "bg-zinc-950/60 text-zinc-300 border-white/10 hover:bg-zinc-900 hover:text-white"}`}>
            <Mail className="w-4 h-4" /> Messages <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-mono">{safeMessages.length}</span>
          </button>
          
          <button onClick={() => setActiveTab("users")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${activeTab === "users" ? "bg-indigo-500 text-white border-indigo-400 shadow-xl shadow-indigo-500/20 scale-105" : "bg-zinc-950/60 text-zinc-300 border-white/10 hover:bg-zinc-900 hover:text-white"}`}>
            <Users className="w-4 h-4" /> User Control <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-xs font-mono">{safeProfiles.length}</span>
          </button>

          {/* 🔥 Naya User Reviews Button 🔥 */}
          <button onClick={() => setActiveTab("reviews")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${activeTab === "reviews" ? "bg-amber-500 text-white border-amber-400 shadow-xl shadow-amber-500/20 scale-105" : "bg-zinc-950/60 text-zinc-300 border-white/10 hover:bg-zinc-900 hover:text-white"}`}>
            <Star className="w-4 h-4" /> User Reviews
          </button>
          
          <button onClick={() => setActiveTab("maintenance")} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shrink-0 ${activeTab === "maintenance" ? "bg-blue-500 text-white border-blue-300 shadow-xl shadow-blue-500/20 scale-105" : "bg-zinc-950/60 text-zinc-300 border-white/10 hover:bg-zinc-900 hover:text-white"}`}>
            <Wrench className="w-4 h-4" /> System Setup
          </button>
        </div>
      </div>

      {/* ---  TAB RENDERING  --- */}
      {activeTab === "publish" && <PublishTab />}
      
      {activeTab === "manage" && <ManageTab safeApps={safeApps} safeNotes={safeNotes} safeBlogs={safeBlogs} />}
      
      {activeTab === "users" && <UsersTab safeProfiles={safeProfiles} />}

      {/* 🔥 Naya Reviews Tab Render 🔥 */}
      {activeTab === "reviews" && <ReviewsTab />}

      {/* TAB 3: MESSAGES (Kept inline) */}
      {activeTab === "messages" && (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Mail className="w-5 h-5" /></div>
                <div><h2 className="text-xl font-semibold">Visitor Messages</h2><p className="text-xs text-zinc-400">Direct inquiries from contact page</p></div>
              </div>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-indigo-400">{safeMessages.length} Messages</span>
            </div>

            {safeMessages.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/30">
                <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 font-medium">No messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {safeMessages.map((msg: any) => (
                  <div key={msg.id} className="p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-white/20 transition-all space-y-3">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <h3 className="font-bold text-white flex gap-2 items-center">
                        {msg.name} <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">{msg.email}</span>
                      </h3>
                      <span className="text-xs text-zinc-500 font-mono">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-white/5">&ldquo;{msg.message}&rdquo;</p>
                    <div className="flex justify-end pt-1">
                      <Button variant="outline" size="sm" onClick={() => setDeleteMessageModal({ isOpen: true, id: msg.id, title: `Message from ${msg.name}` })} className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs">
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Message Delete Modal */}
          {deleteMessageModal.isOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                <h3 className="text-xl font-bold mb-2">Delete Message</h3>
                <p className="text-zinc-400 text-sm mb-6">Are you sure you want to delete this message?</p>
                <div className="flex gap-3">
                  <Button onClick={() => setDeleteMessageModal({ isOpen: false, id: null, title: "" })} className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-11">Cancel</Button>
                  <Button onClick={confirmDeleteMessage} className="w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11">{isPending ? "Deleting..." : "Delete"}</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MAINTENANCE MODE (Kept inline) */}
      {activeTab === "maintenance" && (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="rounded-3xl border border-purple-500/20 bg-zinc-950/80 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/5 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-purple-400"><Wrench className="w-6 h-6" /></div>
              <div><h2 className="text-2xl font-bold text-white">System Maintenance</h2><p className="text-sm text-zinc-400">Control website visibility for normal users</p></div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <h3 className="text-lg font-bold text-white mb-2">Enable Maintenance Mode</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Turning this ON will hide the entire platform from normal users and show them a "Coming Soon / Maintenance" screen. <br/>
                  <span className="text-emerald-400 font-medium">As an Admin, you will still be able to access the site and this dashboard normally.</span>
                </p>
                <div className="flex items-center gap-2 text-sm font-mono bg-zinc-900 px-4 py-2 rounded-lg border border-white/5 w-max">
                  Live Status: 
                  {isFetchingMaintenance ? ( <span className="flex items-center text-zinc-500"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Fetching...</span> ) : (
                    <span className={`font-bold flex items-center gap-1.5 ${isMaintenance ? 'text-red-500' : 'text-emerald-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${isMaintenance ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`}></div>
                      {isMaintenance ? 'ON (Site Hidden)' : 'OFF (Site Public)'}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0">
                <Button onClick={toggleMaintenanceMode} disabled={isFetchingMaintenance} className={`w-full md:w-48 h-14 rounded-xl font-bold shadow-lg transition-all ${isMaintenance ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 
                  'bg-blue-500 hover:bg-blue-700 text-white shadow-purple-500/20'}`}>
                  {isFetchingMaintenance ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <><Power className="w-5 h-5 mr-2" />{isMaintenance ? 'TURN OFF' : 'TURN ON'}</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}