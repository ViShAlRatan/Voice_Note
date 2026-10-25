"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, UploadCloud, X, Link as LinkIcon, MonitorSmartphone, PenTool } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createNoteAction, createDigitalNoteAction, createQuestionAction, createBulkQuestionsAction } from "@/app/actions/admin";

interface NotePublishFormProps {
  subjects: any[];
  onOpenSubjectModal: () => void;
}

const startSimulatedProgress = (fileSize: number, setProgress: (val: number | null) => void) => {
  setProgress(0);
  const estimatedTimeMs = Math.max((fileSize / 2000000) * 1000, 2000); 
  const updateInterval = 150;
  const totalSteps = estimatedTimeMs / updateInterval;
  let currentStep = 0;
  const interval = setInterval(() => {
    currentStep++;
    let percentage = Math.round((currentStep / totalSteps) * 100);
    if (percentage >= 98) percentage = 98; 
    setProgress(percentage);
  }, updateInterval);
  return interval;
};

export default function NotePublishForm({ subjects, onOpenSubjectModal }: NotePublishFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  // Mode States
  const [noteMode, setNoteMode] = useState<'handwritten' | 'digital' | 'questions'>('digital');
  const [pdfMode, setPdfMode] = useState<'upload' | 'link'>('upload');
  
  // 🔥 NEW: Digital Note Upload Type 🔥
  const [digitalUploadType, setDigitalUploadType] = useState<'single' | 'bulk'>('single');
  const [questionUploadType, setQuestionUploadType] = useState<'single' | 'bulk'>('single');

  // Input Data States
  const [externalPdfUrl, setExternalPdfUrl] = useState("");
  const [topicPages, setTopicPages] = useState<string[]>(['']); 
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [noteProgress, setNoteProgress] = useState<number | null>(null);
  const [isNoteUploading, setIsNoteUploading] = useState(false);
  const [isDigitalNotePending, setIsDigitalNotePending] = useState(false);
  
  const [questionData, setQuestionData] = useState({
    paper_type: 'paper1', unit_number: 'unit1', question: '', opta: '', optb: '', optc: '', optd: '', correct_answer: 'A', explanation: ''
  });
  const [isQuestionPending, setIsQuestionPending] = useState(false);

  // 1. HANDWRITTEN PUBLISH
  const handleNotePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    if (pdfMode === 'upload' && !noteFile) { toast.error("Please select a PDF file to upload."); return; }
    if (pdfMode === 'link' && !externalPdfUrl) { toast.error("Please paste the Google Drive link."); return; }
    
    setIsNoteUploading(true);
    const formData = new FormData(form);

    if (pdfMode === 'upload') {
      const interval = startSimulatedProgress(noteFile!.size, setNoteProgress);
      const fileName = `${Date.now()}-${noteFile!.name.replace(/\s+/g, '-')}`;
      try {
        const { error: uploadError } = await supabase.storage.from('notes').upload(fileName, noteFile!);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('notes').getPublicUrl(fileName);
        formData.append("file_url", publicUrlData.publicUrl);
        clearInterval(interval);
        setNoteProgress(100);
      } catch (error) {
        clearInterval(interval);
        setNoteProgress(null); setIsNoteUploading(false);
        toast.error("File upload failed!"); return;
      }
    } else {
      formData.append("file_url", externalPdfUrl);
    }

    startTransition(async () => {
      const result = await createNoteAction(formData);
      if (result?.error) toast.error(result.error);
      else { 
        toast.success("Handwritten Notes Published Successfully!"); 
        form.reset(); setNoteFile(null); setNoteProgress(null); setExternalPdfUrl(""); setInputKey(Date.now());
        router.refresh(); 
      }
      setIsNoteUploading(false);
    });
  };

  // 2. DIGITAL NOTE PUBLISH (SINGLE)
  const handleDigitalNotePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsDigitalNotePending(true);
    
    startTransition(async () => {
      const formData = new FormData(form);
      formData.append("pages", JSON.stringify(topicPages));
      
      const result = await createDigitalNoteAction(formData);
      if (result?.error) { toast.error(result.error); } 
      else { 
        toast.success(result.message || "Digital Topic Published!"); 
        form.reset(); setTopicPages(['']); router.refresh(); 
      }
      setIsDigitalNotePending(false);
    });
  };

  // 3. DIGITAL NOTE PUBLISH (BULK JSON)
  const handleBulkDigitalNotes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const toastId = toast.loading("Parsing JSON & Uploading...");
    try {
      const text = await file.text();
      let parsedData = JSON.parse(text);
      
      if (!Array.isArray(parsedData) && !parsedData.pages) {
         // Agar JSON single object ho par array mein na ho
         parsedData = [parsedData];
      }
      
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

      if (dataArray.length === 0) {
        toast.error("File is empty or formatted incorrectly!", { id: toastId }); return;
      }

      for (const item of dataArray) {
        const fd = new FormData();
        fd.append("paper_type", item.paper_type || "paper2");
        fd.append("unit_number", item.unit_number || "unit2");
        fd.append("subject_id", item.subject_id || "coa");
        fd.append("main_topic", item.main_topic || "General Topics");
        fd.append("title", item.title || "Untitled Topic");
        fd.append("read_time", item.read_time || "10 min");
        fd.append("pages", JSON.stringify(item.pages || []));
        
        await createDigitalNoteAction(fd);
      }
      toast.success(`Successfully uploaded ${dataArray.length} digital topics! 🎉`, { id: toastId });
      router.refresh();
    } catch (err: any) {
      toast.error("Upload failed: " + err.message, { id: toastId });
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            {noteMode === 'handwritten' ? <PenTool className="w-5 h-5" /> : noteMode === 'digital' ? <MonitorSmartphone className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Publish Notes</h2>
            <p className="text-xs text-zinc-400">
              {noteMode === 'handwritten' ? 'Upload PDF Documents' : noteMode === 'digital' ? 'Write Digital Content (GFG Style)' : 'Add MCQs to Question Bank'}
            </p>
          </div>
        </div>

        <div className="flex bg-zinc-900/80 border border-white/10 rounded-xl p-1 w-full md:w-max shrink-0">
          <button type="button" onClick={() => setNoteMode('digital')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'digital' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><MonitorSmartphone className="w-4 h-4" /> Digital Content</button>
          <button type="button" onClick={() => setNoteMode('handwritten')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'handwritten' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><PenTool className="w-4 h-4" /> Handwritten</button>
          <button type="button" onClick={() => setNoteMode('questions')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'questions' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><BookOpen className="w-4 h-4" /> Questions</button>
        </div>
      </div>

      {/* A. HANDWRITTEN */}
      {noteMode === 'handwritten' && (
        <form onSubmit={handleNotePublish} className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-zinc-300">Note Title</Label><Input name="title" required disabled={isNoteUploading} placeholder="e.g. Relational Algebra PDF" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
            <div className="space-y-2"><Label className="text-zinc-300">Subject Category</Label><Input name="subject" required disabled={isNoteUploading} placeholder="e.g. Database Systems" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
          </div>
          <div className="space-y-2"><Label className="text-zinc-300">Description</Label><Input name="description" required disabled={isNoteUploading} placeholder="Topics covered in this PDF..." className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Upload Document (PDF)</Label>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button type="button" onClick={() => setPdfMode('upload')} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${pdfMode === 'upload' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Upload File</button>
                <button type="button" onClick={() => setPdfMode('link')} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${pdfMode === 'link' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Drive Link</button>
              </div>
            </div>

            {pdfMode === 'upload' ? (
              <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
                <input key={inputKey} type="file" accept=".pdf" onChange={(e) => setNoteFile(e.target.files?.[0] || null)} disabled={isNoteUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
                <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                  <UploadCloud className="w-4 h-4 text-emerald-400"/>
                  {noteFile ? <span className="text-emerald-400 font-bold ml-1">{noteFile.name}</span> : "Click to select .pdf file"}
                </div>
                {noteFile && <button type="button" onClick={() => { setNoteFile(null); setInputKey(Date.now()); }} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><X className="w-4 h-4" /></button>}
              </div>
            ) : (
              <div className="relative animate-in fade-in duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LinkIcon className="h-4 w-4 text-zinc-500" /></div>
                <Input type="url" value={externalPdfUrl} onChange={(e) => setExternalPdfUrl(e.target.value)} disabled={isNoteUploading} placeholder="https://drive.google.com/file/d/..." className="bg-black/50 border-white/10 text-white h-12 pl-10 rounded-xl" />
              </div>
            )}
          </div>
          <Button type="submit" disabled={isNoteUploading} className="w-full bg-white text-black hover:bg-zinc-200  h-11 rounded-xl mt-4">
            {isNoteUploading ? <><Loader2 className="animate-spin w-4 h-4 mr-2"/> Publishing... {noteProgress ? `${noteProgress}%` : ''}</> : "Publish PDF Note"}
          </Button>
        </form>
      )}

      {/* B. DIGITAL NOTES */}
      {noteMode === 'digital' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex bg-zinc-900/80 border border-white/10 rounded-xl p-1.5 w-full">
            <button type="button" onClick={() => setDigitalUploadType('single')} className={`flex-1 py-2.5 text-sm rounded-lg font-bold transition-all ${digitalUploadType === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>📝 Write Single Note</button>
            <button type="button" onClick={() => setDigitalUploadType('bulk')} className={`flex-1 py-2.5 text-sm rounded-lg font-bold transition-all ${digitalUploadType === 'bulk' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>⚡ Bulk Upload (JSON)</button>
          </div>

          {digitalUploadType === 'single' ? (
            <form onSubmit={handleDigitalNotePublish} className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-emerald-400 font-bold mb-2">1. Select Target Syllabus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">UGC NET Paper</Label>
                    <select name="paper_type" required className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="">-- Select Paper --</option>
                      <option value="paper1">Paper 1 (General)</option>
                      <option value="paper2">Paper 2 (Computer Science)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Select Unit</Label>
                    <select name="unit_number" required className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="">-- Select Unit --</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(unit => <option key={unit} value={`unit${unit}`}>Unit {unit}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/10 space-y-4">
                <div className="space-y-2 relative">
                  <Label className="text-emerald-400 font-bold mb-2 block">2. Select Subject Category</Label>
                  <div className="flex gap-2">
                    <select name="subject_id" required disabled={isDigitalNotePending} className="flex-1 bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="">-- Choose Subject --</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                    </select>
                    <Button type="button" onClick={onOpenSubjectModal} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 h-11 px-4 rounded-xl shrink-0">+ Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Main Topic (Chapter Heading)</Label>
                  <Input name="main_topic" placeholder="e.g. Mathematical Logic" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-zinc-300">Topic Title (Sub Topic)</Label><Input name="title" required placeholder="e.g. Relational Algebra Basics" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
                  <div className="space-y-2"><Label className="text-zinc-300">Read Time</Label><Input name="read_time" required placeholder="e.g. 10 min" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-zinc-300">Topic Pages Content</Label>
                {topicPages.map((page, index) => (
                  <div key={index} className="relative bg-zinc-950 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-500 font-bold text-sm">Page {index + 1}</span>
                      {topicPages.length > 1 && <button type="button" onClick={() => setTopicPages(topicPages.filter((_, i) => i !== index))} className="text-red-400 text-xs hover:underline">Remove Page</button>}
                    </div>
                    <textarea value={page} required onChange={(e) => { const newPages = [...topicPages]; newPages[index] = e.target.value; setTopicPages(newPages); }} placeholder={`Write HTML content for Page ${index + 1} here...`} className="flex min-h-[150px] w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500" />
                  </div>
                ))}
                <Button type="button" onClick={() => setTopicPages([...topicPages, ''])} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-dashed border-white/20 h-11 rounded-xl">+ Add New Page</Button>
              </div>
              <Button type="submit" disabled={isDigitalNotePending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 rounded-xl mt-4">{isDigitalNotePending ? "Publishing..." : "Publish Digital Topic"}</Button>
            </form>
          ) : (
            // 🔥 BULK JSON UPLOAD FOR DIGITAL NOTES 🔥
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold text-emerald-400">⚡ Bulk Upload Digital Notes</h3>
                <p className="text-xs text-zinc-400 mt-1">Upload a JSON file containing all topic configurations and HTML pages.</p>
              </div>
              <div className="relative w-full h-32 rounded-2xl border border-dashed border-emerald-500/40 bg-black/50 flex flex-col items-center justify-center px-4 cursor-pointer hover:border-emerald-500 transition-all group">
                <input type="file" accept=".json" onChange={handleBulkDigitalNotes} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <UploadCloud className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-zinc-200 font-semibold">Click to drop JSON file</span>
                <span className="text-xs text-zinc-500 mt-1">Keys: paper_type, unit_number, subject_id, main_topic, title, read_time, pages[]</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* C. QUESTION BANK */}
      {noteMode === 'questions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex bg-zinc-900/80 border border-white/10 rounded-xl p-1.5 w-full">
            <button type="button" onClick={() => setQuestionUploadType('single')} className={`flex-1 py-2.5 text-sm rounded-lg font-bold transition-all ${questionUploadType === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>📝 Single Question Upload</button>
            <button type="button" onClick={() => setQuestionUploadType('bulk')} className={`flex-1 py-2.5 text-sm rounded-lg font-bold transition-all ${questionUploadType === 'bulk' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}>⚡ Bulk Upload (CSV / JSON)</button>
          </div>

          {questionUploadType === 'single' ? (
            <form className="space-y-6 animate-in fade-in duration-200" onSubmit={async (e) => {
                e.preventDefault(); setIsQuestionPending(true);
                const result = await createQuestionAction(questionData);
                if (result?.error) toast.error(result.error);
                else {
                  toast.success("Question Saved! 🎉");
                  setQuestionData({ ...questionData, question: '', opta: '', optb: '', optc: '', optd: '', explanation: '' });
                  router.refresh();
                }
                setIsQuestionPending(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Paper Type</Label>
                  <select value={questionData.paper_type} onChange={(e) => setQuestionData({...questionData, paper_type: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3">
                    <option value="paper1">Paper 1 (General)</option>
                    <option value="paper2">Paper 2 (Computer Science)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Unit Number</Label>
                  <select value={questionData.unit_number} onChange={(e) => setQuestionData({...questionData, unit_number: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(u => <option key={u} value={`unit${u}`}>Unit {u}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Question Text</Label>
                <textarea required value={questionData.question} onChange={(e) => setQuestionData({...questionData, question: e.target.value})} className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['opta', 'optb', 'optc', 'optd'].map((key) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-zinc-400">Option {key.replace('opt', '').toUpperCase()}</Label>
                    <Input required value={(questionData as any)[key]} onChange={(e) => setQuestionData({...questionData, [key]: e.target.value})} className="bg-black/50 border-white/10 text-white rounded-xl" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-emerald-400 font-bold">Correct Option</Label>
                  <select value={questionData.correct_answer} onChange={(e) => setQuestionData({...questionData, correct_answer: e.target.value})} className="w-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold h-11 rounded-xl px-3">
                    <option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-zinc-300">Explanation</Label>
                  <Input value={questionData.explanation} onChange={(e) => setQuestionData({...questionData, explanation: e.target.value})} className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
                </div>
              </div>
              <Button type="submit" disabled={isQuestionPending} className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-xl mt-4">{isQuestionPending ? "Saving..." : "Save Question"}</Button>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-6 animate-in fade-in duration-200">
              <div><h3 className="text-lg font-bold text-emerald-400">⚡ Bulk Upload Questions</h3><p className="text-xs text-zinc-400 mt-1">Select Paper & Unit, then upload your CSV/JSON file.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Target Paper</Label>
                  <select value={questionData.paper_type} onChange={(e) => setQuestionData({...questionData, paper_type: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="paper1">Paper 1 (General)</option><option value="paper2">Paper 2 (Computer Science)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Target Unit</Label>
                  <select value={questionData.unit_number} onChange={(e) => setQuestionData({...questionData, unit_number: e.target.value})} className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(u => <option key={u} value={`unit${u}`}>Unit {u}</option>)}
                  </select>
                </div>
              </div>
              <div className="relative w-full h-32 rounded-2xl border border-dashed border-emerald-500/40 bg-black/50 flex flex-col items-center justify-center px-4 cursor-pointer hover:border-emerald-500 transition-all group">
                <input type="file" accept=".csv, .json" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  let parsedData: any[] = [];
                  try {
                    if (file.name.endsWith('.json')) parsedData = JSON.parse(text);
                    else if (file.name.endsWith('.csv')) {
                      const lines = text.split('\n');
                      const headers = lines[0].split(',').map(h => h.trim());
                      for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue;
                        const currentLine = lines[i].split(',');
                        const obj: any = {};
                        headers.forEach((h, idx) => obj[h] = currentLine[idx]?.trim() || '');
                        parsedData.push(obj);
                      }
                    }
                    if (parsedData.length === 0) return toast.error("File is empty!");
                    const dataToUpload = parsedData.map(item => ({ ...item, paper_type: questionData.paper_type, unit_number: questionData.unit_number, explanation: item.explanation || "" }));
                    const toastId = toast.loading(`Uploading ${dataToUpload.length} questions...`);
                    const result = await createBulkQuestionsAction(dataToUpload);
                    if (result?.error) toast.error(result.error, { id: toastId });
                    else { toast.success(`Uploaded ${dataToUpload.length} questions! 🎉`, { id: toastId }); router.refresh(); }
                  } catch (err: any) { toast.error("Parsing failed: " + err.message); }
                }} />
                <UploadCloud className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-zinc-200 font-semibold">Drop CSV / JSON file</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}