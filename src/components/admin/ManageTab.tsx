"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, BookOpen, Terminal, Trash2, MonitorSmartphone, PenTool, HelpCircle, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteItemAction } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/client";

type AllowedTables = "apps" | "notes" | "blogs" | "messages" | "digital_topics" | "question_bank";

export default function ManageTab({ safeApps, safeNotes, safeBlogs }: any) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; table: AllowedTables | null; id: string | null; title: string; }>({ isOpen: false, table: null, id: null, title: "" });

  const [noteMode, setNoteMode] = useState<'handwritten' | 'digital'>('handwritten');
  const [digitalNotes, setDigitalNotes] = useState<any[]>([]);

  // 🔴 Edit Digital Note States
  const [editDigitalModal, setEditDigitalModal] = useState<{ isOpen: boolean; topic: any }>({ isOpen: false, topic: null });
  const [editForm, setEditForm] = useState({ title: '', read_time: '', pages: [''] });

  // 🔴 Question Bank Management States
  const [qPaper, setQPaper] = useState('paper1');
  const [qUnit, setQUnit] = useState('unit1');
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  useEffect(() => {
    const fetchDigitalNotes = async () => {
      const { data } = await supabase.from("digital_topics").select("*, digital_subjects(name)").order("created_at", { ascending: false });
      if (data) setDigitalNotes(data);
    };
    fetchDigitalNotes();
  }, [supabase]);

  // 🔥 Question Bank fetch karne ke liye jab paper ya unit change ho
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from("question_bank")
        .select("id, question, unit_number, paper_type")
        .eq("paper_type", qPaper)
        .eq("unit_number", qUnit);
      
      if (data) {
        setBankQuestions(data);
        setSelectedQuestionId(''); // Reset selection
      }
    };
    fetchQuestions();
  }, [qPaper, qUnit, supabase]);

  function confirmDeleteContent() {
    if (!deleteModal.table || !deleteModal.id) return;
    startTransition(async () => {
      const result = await deleteItemAction(deleteModal.table as any, deleteModal.id!);
      if (result?.error) toast.error(result.error);
      else { 
        toast.success("Item deleted successfully!"); 
        if (deleteModal.table === "digital_topics") {
          setDigitalNotes(prev => prev.filter(n => n.id !== deleteModal.id));
        }
        if (deleteModal.table === "question_bank") {
          setBankQuestions(prev => prev.filter(q => q.id !== deleteModal.id));
          setSelectedQuestionId('');
        }
        setDeleteModal({ isOpen: false, table: null, id: null, title: "" }); 
        router.refresh(); 
      }
    });
  }

  // 🔥 Open Edit Modal Logic
  function openEditModal(topic: any) {
    let parsedPages = [''];
    if (topic.pages) {
      try {
        parsedPages = typeof topic.pages === 'string' ? JSON.parse(topic.pages) : topic.pages;
      } catch (e) {
        parsedPages = [topic.pages];
      }
    } else if (topic.content) {
      parsedPages = (topic.content || "").split('[PAGE_BREAK]');
    }

    setEditForm({
      title: topic.title || '',
      read_time: topic.read_time || '',
      pages: parsedPages
    });
    setEditDigitalModal({ isOpen: true, topic });
  }

  // 🔥 Handle Update Topic
  async function handleUpdateTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!editDigitalModal.topic) return;

    startTransition(async () => {
      const { error } = await supabase
        .from('digital_topics')
        .update({
          title: editForm.title,
          read_time: editForm.read_time,
          pages: JSON.stringify(editForm.pages)
        })
        .eq('id', editDigitalModal.topic.id);

      if (error) {
        toast.error(`Update failed: ${error.message}`);
      } else {
        toast.success("Topic updated successfully!");
        // Update Local State instantly
        setDigitalNotes(prev => prev.map(n => 
          n.id === editDigitalModal.topic.id 
            ? { ...n, title: editForm.title, read_time: editForm.read_time, pages: JSON.stringify(editForm.pages) } 
            : n
        ));
        setEditDigitalModal({ isOpen: false, topic: null });
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* MANAGE APPS */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Smartphone className="w-5 h-5" /></div>
            <div><h2 className="text-xl font-semibold">Manage Apps</h2><p className="text-xs text-zinc-400">All published applications</p></div>
          </div>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-400 w-max">{safeApps.length} Apps</span>
        </div>
        {safeApps.length === 0 ? ( <p className="text-sm text-zinc-500 italic text-center py-8">No apps published yet.</p> ) : (
          <div className="space-y-3">
            {safeApps.map((app: any) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-white">{app.title}</p>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Version: {app.version}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDeleteModal({ isOpen: true, table: "apps", id: app.id, title: app.title! })} className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs w-full sm:w-auto"><Trash2 className="w-4 h-4 mr-2" /> Delete App</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANAGE NOTES */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0"><BookOpen className="w-5 h-5" /></div>
            <div><h2 className="text-xl font-semibold">Manage Notes</h2><p className="text-xs text-zinc-400">All published study materials</p></div>
          </div>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-400 w-max">
            {safeNotes.length + digitalNotes.length} Total Notes
          </span>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-zinc-900/80 border border-white/10 rounded-xl p-1 w-full sm:w-max mb-6">
          <button type="button" onClick={() => setNoteMode('digital')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'digital' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <MonitorSmartphone className="w-4 h-4" /> Digital Content ({digitalNotes.length})
          </button>
          <button type="button" onClick={() => setNoteMode('handwritten')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'handwritten' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <PenTool className="w-4 h-4" /> Handwritten ({safeNotes.length})
          </button>
        </div>

        {/* 1. DIGITAL NOTES LIST */}
        {noteMode === 'digital' && (
          <div className="animate-in fade-in duration-300">
            {digitalNotes.length === 0 ? ( <p className="text-sm text-zinc-500 italic text-center py-8 bg-black/20 rounded-2xl">No digital topics published yet.</p> ) : (
              <div className="space-y-3">
                {digitalNotes.map((note: any) => (
                  <div key={note.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Topic</span>
                        <p className="font-semibold text-white text-base">{note.title}</p>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        Section/Subject: <span className="text-emerald-400 font-medium">{note.digital_subjects?.name || note.subject_id}</span>
                      </p>
                    </div>
                    
                    {/* EDIT & DELETE BUTTONS */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(note)} className="border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs w-full sm:w-auto">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteModal({ isOpen: true, table: "digital_topics", id: note.id, title: `Topic: ${note.title}` })} className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs w-full sm:w-auto">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. HANDWRITTEN NOTES LIST */}
        {noteMode === 'handwritten' && (
          <div className="animate-in fade-in duration-300">
            {safeNotes.length === 0 ? ( <p className="text-sm text-zinc-500 italic text-center py-8 bg-black/20 rounded-2xl">No handwritten PDFs published yet.</p> ) : (
              <div className="space-y-3">
                {safeNotes.map((note: any) => (
                  <div key={note.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/10 px-2 py-0.5 rounded">PDF File</span>
                        <p className="font-semibold text-white text-base">{note.title}</p>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mt-1">Category: {note.subject}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setDeleteModal({ isOpen: true, table: "notes", id: note.id, title: `PDF: ${note.title}` })} className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs w-full sm:w-auto">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete PDF
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔴 MANAGE QUESTIONS SECTION WITH DROPDOWN */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><HelpCircle className="w-5 h-5" /></div>
            <div><h2 className="text-xl font-semibold">Manage Questions</h2><p className="text-xs text-zinc-400">Select paper & unit to delete specific questions</p></div>
          </div>
        </div>

        <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Select Paper</label>
              <select 
                value={qPaper} 
                onChange={(e) => setQPaper(e.target.value)} 
                className="w-full bg-black border border-white/10 text-white h-11 rounded-xl px-3 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="paper1">Paper 1 (General)</option>
                <option value="paper2">Paper 2 (Computer Science)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">Select Unit</label>
              <select 
                value={qUnit} 
                onChange={(e) => setQUnit(e.target.value)} 
                className="w-full bg-black border border-white/10 text-white h-11 rounded-xl px-3 text-sm focus:outline-none focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(u => (
                  <option key={u} value={`unit${u}`}>Unit {u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs text-zinc-400 font-medium">Select Specific Question to Delete</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={selectedQuestionId} 
                onChange={(e) => setSelectedQuestionId(e.target.value)} 
                className="flex-1 bg-black border border-white/10 text-white h-11 rounded-xl px-3 text-sm focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="">-- Choose from {bankQuestions.length} questions --</option>
                {bankQuestions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.question}
                  </option>
                ))}
              </select>

              <Button 
                variant="outline" 
                disabled={!selectedQuestionId}
                onClick={() => {
                  const qObj = bankQuestions.find(q => q.id === selectedQuestionId);
                  if (qObj) {
                    setDeleteModal({ 
                      isOpen: true, 
                      table: "question_bank", 
                      id: qObj.id, 
                      title: `Question: ${qObj.question}` 
                    });
                  }
                }} 
                className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 h-11 text-xs shrink-0 disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected Question
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MANAGE BLOGS */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0"><Terminal className="w-5 h-5" /></div>
            <div><h2 className="text-xl font-semibold">Manage Articles</h2><p className="text-xs text-zinc-400">All published tech blogs</p></div>
          </div>
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-400 w-max">{safeBlogs.length} Blogs</span>
        </div>
        {safeBlogs.length === 0 ? ( <p className="text-sm text-zinc-500 italic text-center py-8">No blogs published yet.</p> ) : (
          <div className="space-y-3">
            {safeBlogs.map((blog: any) => (
              <div key={blog.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-white">{blog.title}</p>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Read Time: {blog.read_time}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDeleteModal({ isOpen: true, table: "blogs", id: blog.id, title: blog.title! })} className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs w-full sm:w-auto"><Trash2 className="w-4 h-4 mr-2" /> Delete Article</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔴 EDIT DIGITAL NOTE MODAL 🔴 */}
      {editDigitalModal.isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Pencil className="w-6 h-6 text-emerald-500" /> Edit Digital Note
              </h3>
              <button onClick={() => setEditDigitalModal({ isOpen: false, topic: null })} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTopic} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Topic Title</label>
                  <input 
                    required 
                    type="text" 
                    value={editForm.title} 
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })} 
                    className="w-full bg-black/50 border border-white/10 text-white h-12 rounded-xl px-4 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Read Time</label>
                  <input 
                    required 
                    type="text" 
                    value={editForm.read_time} 
                    onChange={e => setEditForm({ ...editForm, read_time: e.target.value })} 
                    className="w-full bg-black/50 border border-white/10 text-white h-12 rounded-xl px-4 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-300 block border-b border-white/10 pb-2">Edit Pages Content</label>
                
                {editForm.pages.map((page, index) => (
                  <div key={index} className="relative bg-zinc-900/50 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-500 font-bold text-sm">Page {index + 1}</span>
                      {editForm.pages.length > 1 && (
                        <button type="button" onClick={() => {
                          const newPages = editForm.pages.filter((_, i) => i !== index);
                          setEditForm({ ...editForm, pages: newPages });
                        }} className="text-red-400 text-xs font-bold hover:underline">
                          Remove Page
                        </button>
                      )}
                    </div>
                    <textarea 
                      required
                      value={page}
                      onChange={(e) => {
                        const newPages = [...editForm.pages];
                        newPages[index] = e.target.value;
                        setEditForm({ ...editForm, pages: newPages });
                      }}
                      className="flex min-h-[200px] w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 custom-scrollbar" 
                    />
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  onClick={() => setEditForm({ ...editForm, pages: [...editForm.pages, ''] })} 
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-dashed border-white/20 h-12 rounded-xl"
                >
                  + Add Another Page
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <Button type="button" onClick={() => setEditDigitalModal({ isOpen: false, topic: null })} className="w-full sm:w-1/3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-12">Cancel</Button>
                <Button type="submit" disabled={isPending} className="w-full sm:w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12">
                  {isPending ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2">Confirm Content Deletion</h3>
            <p className="text-zinc-400 text-sm mb-6">Are you sure you want to delete <br/><b className="text-white mt-2 inline-block bg-white/5 px-2 py-1 rounded max-w-full truncate">{deleteModal.title}</b>?</p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteModal({ isOpen: false, table: null, id: null, title: "" })} className="w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-11">Cancel</Button>
              <Button onClick={confirmDeleteContent} className="w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11">{isPending ? "Deleting..." : "Delete"}</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}