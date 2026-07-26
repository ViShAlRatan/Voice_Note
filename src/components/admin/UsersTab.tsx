"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield, Settings2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserRoleAction, updateUserPermissionsAction, deleteUserAccountAction } from "@/app/actions/admin";

export default function UsersTab({ safeProfiles }: { safeProfiles: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [deleteUserModal, setDeleteUserModal] = useState<{ isOpen: boolean; id: string|null; email: string; }>({ isOpen: false, id: null, email: "" });
  const [permModal, setPermModal] = useState<{ isOpen: boolean; id: string; email: string; apps: boolean; notes: boolean; blogs: boolean; }>({ isOpen: false, id: "", email: "", apps: true, notes: true, blogs: true });

  function handleRoleToggle(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    startTransition(async () => {
      const result = await updateUserRoleAction(id, newRole);
      if (result?.error) toast.error(result.error);
      else { toast.success(result.message); router.refresh(); }
    });
  }

  function handleSavePermissions() {
    startTransition(async () => {
      const result = await updateUserPermissionsAction(permModal.id, {
        can_view_apps: permModal.apps, can_view_notes: permModal.notes, can_view_blogs: permModal.blogs
      });
      if (result?.error) toast.error(result.error);
      else { toast.success(result.message); setPermModal({ ...permModal, isOpen: false }); router.refresh(); }
    });
  }

  function confirmDeleteUser() {
    if (!deleteUserModal.id) return;
    startTransition(async () => {
      const result = await deleteUserAccountAction(deleteUserModal.id!);
      if (result?.error) toast.error(result.error);
      else { toast.success(result.message); setDeleteUserModal({ isOpen: false, id: null, email: "" }); router.refresh(); }
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="rounded-3xl border border-indigo-500/20 bg-zinc-950/80 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-500/5 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-indigo-400"/> User Access Control</h2>
            <p className="text-sm text-zinc-400 mt-1">Manage all registered accounts, roles, and strict module permissions.</p>
          </div>
        </div>

        <div className="space-y-4">
          {safeProfiles.map((user) => (
            <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-indigo-500/30 transition-all gap-4">
              
              {/* User Avatar & Details */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10 shadow-lg">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold bg-indigo-600 text-white text-lg uppercase">
                      {user.full_name?.charAt(0) || user.email.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white flex flex-wrap items-center gap-2 mb-1">
                    <span className="truncate">{user.full_name || "User"}</span>
                    {user.role === "admin" && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shrink-0"><Shield className="w-3 h-3"/> ADMIN</span>}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono truncate">{user.email}</p>
                  
                  {/* RESPONSIVE PERMISSIONS BADGES */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[11px] text-zinc-500 font-mono mr-1">Access:</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${user.can_view_apps ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-zinc-900 text-zinc-600 border-white/5 line-through'}`}>Apps</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${user.can_view_notes ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-900 text-zinc-600 border-white/5 line-through'}`}>Notes</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${user.can_view_blogs ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-zinc-900 text-zinc-600 border-white/5 line-through'}`}>Blogs</span>
                  </div>
                </div>
              </div>

              {/* Actions Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => setPermModal({ isOpen: true, id: user.id, email: user.email, apps: user.can_view_apps, notes: user.can_view_notes, blogs: user.can_view_blogs })} className="flex-1 md:flex-none border-white/10 bg-zinc-900 hover:bg-white text-xs h-9 rounded-xl"><Settings2 className="w-3.5 h-3.5 mr-1.5" /> Perms</Button>
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleRoleToggle(user.id, user.role)} className={`flex-1 md:flex-none text-xs h-9 rounded-xl ${user.role === "admin" ? "border-blue-500/30 text-black hover:bg-blue-400" : "border-emerald-500/30 text-black hover:bg-emerald-400"}`}>{user.role === "admin" ? "Revoke" : "Make Admin"}</Button>
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => setDeleteUserModal({ isOpen: true, id: user.id, email: user.email })} className="shrink-0 border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-xs h-9 w-9 p-0 rounded-xl flex items-center justify-center"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Delete Modal */}
      {deleteUserModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Delete User Account</h3>
            <p className="text-zinc-400 text-sm mb-6">Permanently delete the account <b>{deleteUserModal.email}</b>? This wipes them from Supabase entirely.</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteUserModal({ isOpen: false, id: null, email: "" })} className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-11">Cancel</Button>
              <Button onClick={confirmDeleteUser} className="w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11">{isPending ? "Deleting..." : "Permanently Delete"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* User Permissions Modal */}
      {permModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold mb-1">Access Control</h3>
            <p className="text-xs text-zinc-400 font-mono mb-6">{permModal.email}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-sm">Can View <b>Apps</b></span>
                <button type="button" onClick={() => setPermModal({...permModal, apps: !permModal.apps})} className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${permModal.apps ? "bg-indigo-500" : "bg-zinc-700"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${permModal.apps ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-sm">Can View <b>Notes</b></span>
                <button type="button" onClick={() => setPermModal({...permModal, notes: !permModal.notes})} className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${permModal.notes ? "bg-emerald-500" : "bg-zinc-700"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${permModal.notes ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-sm">Can View <b>Blogs</b></span>
                <button type="button" onClick={() => setPermModal({...permModal, blogs: !permModal.blogs})} className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${permModal.blogs ? "bg-purple-500" : "bg-zinc-700"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${permModal.blogs ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setPermModal({...permModal, isOpen: false})} className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white h-11 rounded-xl">Cancel</Button>
              <Button onClick={handleSavePermissions} className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl shadow-lg shadow-indigo-500/20">{isPending ? "Saving..." : "Save Permissions"}</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}