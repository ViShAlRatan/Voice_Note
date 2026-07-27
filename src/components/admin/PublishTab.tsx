"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, BookOpen, Terminal, Loader2, UploadCloud, X, Link as LinkIcon, MonitorSmartphone, PenTool } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createAppAction, createNoteAction, createBlogAction, createDigitalNoteAction, createDigitalSubjectAction } from "@/app/actions/admin"; 

// SMART PROGRESS SIMULATOR 
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

export default function PublishTab() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  // 🔴 CANCEL FLAG REF
  const isCancelledRef = useRef({ logo: false, screenshots: false, apk: false });

  // 🔴 INPUT KEYS
  const [inputKeys, setInputKeys] = useState({ logo: Date.now(), screenshots: Date.now()+1, apk: Date.now()+2, note: Date.now()+3 });

  // 🔥 ALL MODES & STATES (Now properly inside the component) 🔥
  const [apkMode, setApkMode] = useState<'upload' | 'link'>('upload');
  const [noteMode, setNoteMode] = useState<'handwritten' | 'digital' | 'questions'>('digital');
  
  // Digital Notes ke Multi-pages ke liye state
  const [topicPages, setTopicPages] = useState<string[]>(['']); 

  // Question Bank ke form ke liye state
  const [questionData, setQuestionData] = useState({
    paper_type: 'paper1',
    unit_number: 'unit1',
    question: '',
    optA: '', optB: '', optC: '', optD: '',
    correct_answer: 'A',
    explanation: ''
  });

  const [externalApkUrl, setExternalApkUrl] = useState("");
  const [externalApkSize, setExternalApkSize] = useState("");

  // LOADING STATES
  const [isAppUploading, setIsAppUploading] = useState(false);
  const [isNoteUploading, setIsNoteUploading] = useState(false);
  const [isDigitalNotePending, setIsDigitalNotePending] = useState(false);
  const [isBlogPending, setIsBlogPending] = useState(false);

  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isScreenshotsUploading, setIsScreenshotsUploading] = useState(false);
  const [isApkUploading, setIsApkUploading] = useState(false);

  // PERCENTAGE STATES
  const [logoProgress, setLogoProgress] = useState<number | null>(null);
  const [screenshotProgress, setScreenshotProgress] = useState<number | null>(null);
  const [apkProgress, setApkProgress] = useState<number | null>(null);
  const [noteProgress, setNoteProgress] = useState<number | null>(null);

  // FILE STATES
  const [appFile, setAppFile] = useState<File | null>(null);
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const [appLogo, setAppLogo] = useState<File | null>(null);
  const [appScreenshots, setAppScreenshots] = useState<File[]>([]);

  // UPLOADED URLS
  const [uploadedAppUrl, setUploadedAppUrl] = useState("");
  const [uploadedAppSize, setUploadedAppSize] = useState("");
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [uploadedScreenshotUrls, setUploadedScreenshotUrls] = useState<string[]>([]);

  // ==========================================
  // 🔥 SUBJECTS 🔥
  // ==========================================
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSubjectAdding, setIsSubjectAdding] = useState(false);
  const [newSub, setNewSub] = useState({ id: "", name: "", icon: "" });

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from('digital_subjects').select('*');
      if (data) setSubjects(data);
    };
    fetchSubjects();
  }, [supabase]);

  const handleAddSubject = async () => {
    if (!newSub.id || !newSub.name) {
      toast.error("Subject ID and Name are required.");
      return;
    }
    setIsSubjectAdding(true);
    startTransition(async () => {
      const result = await createDigitalSubjectAction(newSub.id, newSub.name, newSub.icon);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Subject added successfully!");
        setIsSubjectModalOpen(false);
        setNewSub({ id: "", name: "", icon: "" });
        const { data } = await supabase.from('digital_subjects').select('*');
        if (data) setSubjects(data);
        router.refresh();
      }
      setIsSubjectAdding(false);
    });
  };

  // ==========================================
  //       UPLOAD HANDLERS 
  // ==========================================

  // 1. LOGO UPLOAD
  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    isCancelledRef.current.logo = false;
    setAppLogo(file);
    setIsLogoUploading(true);
    
    const toastId = toast.loading("Uploading App Logo...");
    const interval = startSimulatedProgress(file.size, setLogoProgress);

    try {
      const logoName = `logo-${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from("app-images").upload(logoName, file);
      if (error) throw error;
      
      if (isCancelledRef.current.logo) return;

      const { data } = supabase.storage.from("app-images").getPublicUrl(logoName);
      setUploadedLogoUrl(data.publicUrl);
      clearInterval(interval);
      setLogoProgress(100);
      toast.success("Logo Uploaded Successfully! ✅", { id: toastId });
    } catch (error: any) {
      if (isCancelledRef.current.logo) return; 
      clearInterval(interval);
      setLogoProgress(null);
      toast.error(`Logo upload failed: ${error.message}`, { id: toastId });
    } finally {
      if (!isCancelledRef.current.logo) setIsLogoUploading(false);
    }
  };

  // 2. SCREENSHOTS UPLOAD
  const handleScreenshotSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    if (filesArray.length > 4) { toast.error("You can only select up to 4 screenshots."); return; }
    
    isCancelledRef.current.screenshots = false;
    setAppScreenshots(filesArray);
    setIsScreenshotsUploading(true);

    const totalSize = filesArray.reduce((acc, file) => acc + file.size, 0);
    const interval = startSimulatedProgress(totalSize, setScreenshotProgress);
    const toastId = toast.loading(`Uploading ${filesArray.length} Screenshots...`);
    
    try {
      let urls: string[] = [];
      for (let i = 0; i < filesArray.length; i++) {
        if (isCancelledRef.current.screenshots) return;
        
        const file = filesArray[i];
        const shotName = `shot-${Date.now()}-${i}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from("app-images").upload(shotName, file);
        if (error) throw error;
        const { data } = supabase.storage.from("app-images").getPublicUrl(shotName);
        urls.push(data.publicUrl);
      }
      if (isCancelledRef.current.screenshots) return;

      setUploadedScreenshotUrls(urls);
      clearInterval(interval);
      setScreenshotProgress(100);
      toast.success("All Screenshots Uploaded! ✅", { id: toastId });
    } catch (error: any) {
      if (isCancelledRef.current.screenshots) return;
      clearInterval(interval);
      setScreenshotProgress(null);
      toast.error(`Screenshot upload failed: ${error.message}`, { id: toastId });
    } finally {
      if (!isCancelledRef.current.screenshots) setIsScreenshotsUploading(false);
    }
  };

  // 3. APK UPLOAD
  const handleApkSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    isCancelledRef.current.apk = false;
    setAppFile(file);
    setIsApkUploading(true);

    const interval = startSimulatedProgress(file.size, setApkProgress);
    const toastId = toast.loading("Uploading APK File...");
    
    try {
      const apkName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error } = await supabase.storage.from('apps').upload(apkName, file);
      if (error) throw error;

      if (isCancelledRef.current.apk) return; 

      const { data } = supabase.storage.from('apps').getPublicUrl(apkName);
      setUploadedAppUrl(data.publicUrl);
      setUploadedAppSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      
      clearInterval(interval);
      setApkProgress(100);
      toast.success("APK Uploaded Successfully! ✅", { id: toastId });
    } catch (error: any) {
      if (isCancelledRef.current.apk) return;
      clearInterval(interval);
      setApkProgress(null);
      toast.error(`APK upload failed: ${error.message}`, { id: toastId });
    } finally {
      if (!isCancelledRef.current.apk) setIsApkUploading(false);
    }
  };

  // ==========================================
  //          CANCEL HANDLERS
  // ==========================================
  
  const handleLogoCancel = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm("Are you sure you want to cancel and remove this Logo?")) return;
    
    isCancelledRef.current.logo = true;
    toast.dismiss();
    setIsLogoUploading(false); setAppLogo(null); setLogoProgress(null); setUploadedLogoUrl("");
    setInputKeys(prev => ({ ...prev, logo: Date.now() }));
  };

  const handleScreenshotCancel = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm("Are you sure you want to cancel and remove these Screenshots?")) return;
    
    isCancelledRef.current.screenshots = true;
    toast.dismiss();
    setIsScreenshotsUploading(false); setAppScreenshots([]); setScreenshotProgress(null); setUploadedScreenshotUrls([]);
    setInputKeys(prev => ({ ...prev, screenshots: Date.now() }));
  };

  const handleApkCancel = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm("Are you sure you want to cancel and remove this APK?")) return;
    
    isCancelledRef.current.apk = true;
    toast.dismiss();
    setIsApkUploading(false); setAppFile(null); setApkProgress(null); setUploadedAppUrl(""); setUploadedAppSize("");
    setInputKeys(prev => ({ ...prev, apk: Date.now() }));
  };

  const handleNoteCancel = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this PDF?")) return;
    setNoteFile(null);
    setInputKeys(prev => ({ ...prev, note: Date.now() }));
  };

  // ==========================================
  // 🔥 FINAL PUBLISH ACTIONS 🔥
  // ==========================================

  const handleAppPublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    
    if (!uploadedLogoUrl) { toast.error("Please upload the App Logo first."); return; }
    if (apkMode === 'upload' && !uploadedAppUrl) { toast.error("Please let the APK finish uploading first."); return; }
    if (apkMode === 'link' && (!externalApkUrl || !externalApkSize)) { toast.error("Please provide the external APK link and its size."); return; }
    
    setIsAppUploading(true);
    const formData = new FormData(form);
    
    if (apkMode === 'upload') {
      formData.append("download_url", uploadedAppUrl);
      if(!formData.get("file_size")) formData.append("file_size", uploadedAppSize);
    } else {
      formData.append("download_url", externalApkUrl);
      if(!formData.get("file_size")) formData.append("file_size", externalApkSize);
    }

    formData.append("logo_url", uploadedLogoUrl);
    if (uploadedScreenshotUrls.length > 0) formData.append("screenshot_urls", JSON.stringify(uploadedScreenshotUrls));

    startTransition(async () => {
      const result = await createAppAction(formData);
      if (result?.error) toast.error(result.error);
      else { 
        toast.success("App Published Successfully! 🚀"); 
        form.reset(); 
        setAppFile(null); setAppLogo(null); setAppScreenshots([]); 
        setUploadedAppUrl(""); setUploadedLogoUrl(""); setUploadedScreenshotUrls([]);
        setLogoProgress(null); setScreenshotProgress(null); setApkProgress(null);
        setExternalApkUrl(""); setExternalApkSize("");
        setInputKeys({ logo: Date.now(), screenshots: Date.now()+1, apk: Date.now()+2, note: Date.now()+3 });
        router.refresh(); 
      }
      setIsAppUploading(false);
    });
  };

  const handleNotePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    
    if (!noteFile) { toast.error("Please select a PDF file to upload."); return; }
    
    setIsNoteUploading(true);
    const interval = startSimulatedProgress(noteFile.size, setNoteProgress);
    const formData = new FormData(form);
    const fileName = `${Date.now()}-${noteFile.name.replace(/\s+/g, '-')}`;

    try {
      const { error: uploadError } = await supabase.storage.from('notes').upload(fileName, noteFile);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('notes').getPublicUrl(fileName);
      formData.append("file_url", publicUrlData.publicUrl);

      clearInterval(interval);
      setNoteProgress(100);

      startTransition(async () => {
        const result = await createNoteAction(formData);
        if (result?.error) toast.error(result.error);
        else { 
          toast.success("Handwritten Notes Published Successfully!"); 
          form.reset(); 
          setNoteFile(null); setNoteProgress(null);
          setInputKeys(prev => ({ ...prev, note: Date.now() }));
          router.refresh(); 
        }
        setIsNoteUploading(false);
      });
    } catch (error) {
      clearInterval(interval);
      setNoteProgress(null); setIsNoteUploading(false);
      toast.error("File upload failed!");
    }
  };

  const handleDigitalNotePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsDigitalNotePending(true);
    
    startTransition(async () => {
      // Yahan abhi temporary array bhej rahe hain actions file mein update karna hoga backend logic ke liye
      const result = await createDigitalNoteAction(new FormData(form));
      if (result?.error) toast.error(result.error);
      else { 
        toast.success(result.message || "Digital Topic Published!"); 
        form.reset(); 
        setTopicPages(['']); // reset pages
        router.refresh(); 
      }
      setIsDigitalNotePending(false);
    });
  };

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>, action: Function, successMsg: string) {
    e.preventDefault();
    const form = e.currentTarget; 
    setIsBlogPending(true);
    
    startTransition(async () => {
      const result = await action(new FormData(form));
      if (result?.error) toast.error(result.error);
      else { 
        toast.success(result?.message || successMsg); 
        form.reset(); 
        router.refresh(); 
      }
      setIsBlogPending(false);
    });
  }

  // --- UI ---
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* 1. APPS PUBLISH */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div><h2 className="text-xl font-semibold">Publish Flutter App</h2><p className="text-xs text-zinc-400">Upload APK to the Apps Hub</p></div>
        </div>
        
        <form onSubmit={handleAppPublish} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-zinc-300">App Title</Label><Input name="title" required disabled={isAppUploading} placeholder="e.g. TrueBond Chat App" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
            <div className="space-y-2"><Label className="text-zinc-300">Version</Label><Input name="version" required disabled={isAppUploading} placeholder="e.g. 1.2.0" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
          </div>
          <div className="space-y-2"><Label className="text-zinc-300">Description</Label><Input name="description" required disabled={isAppUploading} placeholder="Brief overview of features..." className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo Input */}
            <div className="space-y-2">
              <Label className="text-zinc-300">App Logo</Label>
              <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
                <input key={inputKeys.logo} type="file" accept="image/*" onChange={handleLogoSelect} disabled={isLogoUploading || isAppUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
                <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                  {isLogoUploading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin"/> : <UploadCloud className="w-4 h-4 text-indigo-400"/>}
                  {isLogoUploading ? <span className="text-indigo-400 font-bold ml-1">Uploading... {logoProgress}%</span> : appLogo ? <span className="text-emerald-400 font-bold ml-1 truncate max-w-[150px]">{logoProgress === 100 ? `Uploaded: ${appLogo.name}` : appLogo.name}</span> : "Select App Logo"}
                </div>
                {(appLogo || isLogoUploading) && (
                  <button type="button" onClick={handleLogoCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm" title="Cancel/Remove">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Screenshots Input */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Screenshots (Max 4)</Label>
              <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
                <input key={inputKeys.screenshots} type="file" accept="image/*" multiple onChange={handleScreenshotSelect} disabled={isScreenshotsUploading || isAppUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
                <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                  {isScreenshotsUploading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin"/> : <UploadCloud className="w-4 h-4 text-indigo-400"/>}
                  {isScreenshotsUploading ? <span className="text-indigo-400 font-bold ml-1">Uploading... {screenshotProgress}%</span> : appScreenshots.length > 0 ? <span className="text-emerald-400 font-bold ml-1">{screenshotProgress === 100 ? `100% Uploaded` : `${appScreenshots.length} images selected`}</span> : "Select up to 4 images"}
                </div>
                {(appScreenshots.length > 0 || isScreenshotsUploading) && (
                  <button type="button" onClick={handleScreenshotCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm" title="Cancel/Remove">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">App File (APK)</Label>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button type="button" onClick={() => setApkMode('upload')} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${apkMode === 'upload' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Upload File</button>
                <button type="button" onClick={() => setApkMode('link')} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${apkMode === 'link' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Paste Link</button>
              </div>
            </div>

            {apkMode === 'upload' ? (
              <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
                <input key={inputKeys.apk} type="file" accept=".apk" onChange={handleApkSelect} disabled={isApkUploading || isAppUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
                <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                  {isApkUploading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin"/> : <UploadCloud className="w-4 h-4 text-indigo-400"/>}
                  {isApkUploading ? <span className="text-indigo-400 font-bold ml-1">Uploading APK... {apkProgress}%</span> : appFile ? <span className="text-emerald-400 font-bold ml-1 truncate max-w-[300px]">{apkProgress === 100 ? `Uploaded: ${appFile.name}` : appFile.name}</span> : "Click to select .apk file"}
                </div>
                {(appFile || isApkUploading) && (
                  <button type="button" onClick={handleApkCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm" title="Cancel/Remove">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                <div className="md:col-span-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-zinc-500" />
                  </div>
                  <Input type="url" value={externalApkUrl} onChange={(e) => setExternalApkUrl(e.target.value)} disabled={isAppUploading} placeholder="https://drive.google.com/..." className="bg-black/50 border-white/10 text-white h-12 pl-10 rounded-xl" />
                </div>
                <div className="md:col-span-1">
                  <Input type="text" value={externalApkSize} onChange={(e) => setExternalApkSize(e.target.value)} disabled={isAppUploading} placeholder="e.g. 98 MB" className="bg-black/50 border-white/10 text-white h-12 rounded-xl" />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isAppUploading || isLogoUploading || isScreenshotsUploading || (apkMode === 'upload' && isApkUploading)} className="w-full bg-white text-black hover:bg-zinc-200 font-medium h-11 rounded-xl mt-4">
            {isAppUploading ? <><Loader2 className="animate-spin w-4 h-4 mr-2"/> Publishing App...</> : "Publish App"}
          </Button>
        </form>
      </div>

      {/* 2. NOTES PUBLISH ( SMART TOGGLE: HANDWRITTEN VS DIGITAL VS QUESTIONS) */}
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

          {/* 🔥 3 Tabs Toggle Button 🔥 */}
          <div className="flex bg-zinc-900/80 border border-white/10 rounded-xl p-1 w-full md:w-max shrink-0">
            <button type="button" onClick={() => setNoteMode('digital')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'digital' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <MonitorSmartphone className="w-4 h-4" /> Digital Content
            </button>
            <button type="button" onClick={() => setNoteMode('handwritten')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'handwritten' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <PenTool className="w-4 h-4" /> Handwritten
            </button>
            <button type="button" onClick={() => setNoteMode('questions')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg font-bold transition-all ${noteMode === 'questions' ? 'bg-emerald-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <BookOpen className="w-4 h-4" /> Questions
            </button>
          </div>
        </div>

        {/* --- FORM A: HANDWRITTEN NOTES (PDF UPLOAD) --- */}
        {noteMode === 'handwritten' && (
          <form onSubmit={handleNotePublish} className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-zinc-300">Note Title</Label><Input name="title" required disabled={isNoteUploading} placeholder="e.g. Relational Algebra PDF" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-zinc-300">Subject Category</Label><Input name="subject" required disabled={isNoteUploading} placeholder="e.g. Database Systems" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
            </div>
            <div className="space-y-2"><Label className="text-zinc-300">Description</Label><Input name="description" required disabled={isNoteUploading} placeholder="Topics covered in this PDF..." className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Upload Document (PDF)</Label>
              <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
                <input key={inputKeys.note} type="file" accept=".pdf" onChange={(e) => setNoteFile(e.target.files?.[0] || null)} disabled={isNoteUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
                <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                  <UploadCloud className="w-4 h-4 text-emerald-400"/>
                  {noteFile ? <span className="text-emerald-400 font-bold ml-1">{noteFile.name}</span> : "Click to select .pdf file"}
                </div>
                {noteFile && (
                  <button type="button" onClick={handleNoteCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm" title="Remove PDF">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isNoteUploading} className="w-full bg-white text-black hover:bg-zinc-200  h-11 rounded-xl mt-4">
              {isNoteUploading ? <><Loader2 className="animate-spin w-4 h-4 mr-2"/> Uploading Note... {noteProgress ? `${noteProgress}%` : ''}</> : "Publish PDF Note"}
            </Button>
          </form>
        )}

        {/* --- FORM B: DIGITAL NOTES (HTML/MARKDOWN) --- */}
        {noteMode === 'digital' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <form onSubmit={handleDigitalNotePublish} className="space-y-6">
              
              {/* Paper Type (Pehle Select Karwayein) */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-emerald-400 font-bold mb-2">1. Select Target Syllabus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">UGC NET Paper</Label>
                    <select name="paper_type" required className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3">
                      <option value="">-- Select Paper --</option>
                      <option value="paper1">Paper 1 (General)</option>
                      <option value="paper2">Paper 2 (Computer Science)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Select Unit</Label>
                    <select name="unit_number" required className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3">
                      <option value="">-- Select Unit --</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(unit => (
                        <option key={unit} value={`unit${unit}`}>Unit {unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Topic Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Topic Title</Label>
                  <Input name="title" required placeholder="e.g. Relational Algebra Basics" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Read Time</Label>
                  <Input name="read_time" required placeholder="e.g. 10 min" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" />
                </div>
              </div>

              {/* 🚀 MULTI-PAGE CONTENT SECTION 🚀 */}
              <div className="space-y-4">
                <Label className="text-zinc-300">Topic Pages Content</Label>
                
                {topicPages.map((page, index) => (
                  <div key={index} className="relative bg-zinc-950 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-500 font-bold text-sm">Page {index + 1}</span>
                      {topicPages.length > 1 && (
                        <button type="button" onClick={() => setTopicPages(topicPages.filter((_, i) => i !== index))} className="text-red-400 text-xs hover:underline">
                          Remove Page
                        </button>
                      )}
                    </div>
                    <textarea 
                      value={page}
                      required
                      onChange={(e) => {
                        const newPages = [...topicPages];
                        newPages[index] = e.target.value;
                        setTopicPages(newPages);
                      }}
                      placeholder={`Write content for Page ${index + 1} here...`} 
                      className="flex min-h-[150px] w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500" 
                    />
                  </div>
                ))}
                
                {/* Dynamic Add Page Button */}
                <Button 
                  type="button" 
                  onClick={() => setTopicPages([...topicPages, ''])} 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-dashed border-white/20 h-11 rounded-xl"
                >
                  + Add New Page
                </Button>
              </div>

              <Button type="submit" disabled={isDigitalNotePending} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 rounded-xl mt-4">
                {isDigitalNotePending ? "Publishing..." : "Publish Digital Topic"}
              </Button>
            </form>
          </div>
        )}

        {/* --- FORM C: QUESTION BANK --- */}
        {noteMode === 'questions' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                // Yahan par Supabase 'question_bank' table mein insert karne ka logic aayega
                console.log("Submitting Question:", questionData);
            }}>
              
              {/* Target Syllabus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">UGC NET Paper</Label>
                  <select 
                    value={questionData.paper_type} 
                    onChange={(e) => setQuestionData({...questionData, paper_type: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3"
                  >
                    <option value="paper1">Paper 1 (General)</option>
                    <option value="paper2">Paper 2 (Computer Science)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Select Unit</Label>
                  <select 
                    value={questionData.unit_number} 
                    onChange={(e) => setQuestionData({...questionData, unit_number: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 text-white h-11 rounded-xl px-3"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(unit => (
                      <option key={unit} value={`unit${unit}`}>Unit {unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Question */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Question Text</Label>
                <textarea 
                  required 
                  value={questionData.question}
                  onChange={(e) => setQuestionData({...questionData, question: e.target.value})}
                  placeholder="Type the MCQ question here..." 
                  className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-200" 
                />
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <div key={opt} className="space-y-2">
                    <Label className="text-zinc-400">Option {opt}</Label>
                    <Input 
                      required 
                      value={(questionData as any)[`opt${opt}`]}
                      onChange={(e) => setQuestionData({...questionData, [`opt${opt}`]: e.target.value})}
                      placeholder={`Value for Option ${opt}`} 
                      className="bg-black/50 border-white/10 text-white rounded-xl" 
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer & Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-emerald-400 font-bold">Correct Option</Label>
                  <select 
                    value={questionData.correct_answer}
                    onChange={(e) => setQuestionData({...questionData, correct_answer: e.target.value})}
                    className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold h-11 rounded-xl px-3"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label className="text-zinc-300">Explanation (Optional but Recommended)</Label>
                  <Input 
                    value={questionData.explanation}
                    onChange={(e) => setQuestionData({...questionData, explanation: e.target.value})}
                    placeholder="Why is this answer correct? (Helps students understand)" 
                    className="bg-black/50 border-white/10 text-white h-11 rounded-xl" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-xl mt-4">
                Save Question
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* 3. BLOGS PUBLISH */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl">
         <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><Terminal className="w-5 h-5" /></div>
          <div><h2 className="text-xl font-semibold">Publish Tech Blog Article</h2><p className="text-xs text-zinc-400">Write and broadcast an engineering deep-dive</p></div>
        </div>
         <form onSubmit={(e) => handleFormSubmit(e, createBlogAction, "Blog Published!")} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="text-zinc-300">Article Title</Label><Input name="title" required disabled={isBlogPending} placeholder="e.g. Mastering Next.js" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
            <div className="space-y-2"><Label className="text-zinc-300">Read Time</Label><Input name="read_time" required disabled={isBlogPending} placeholder="e.g. 5 min read" className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
          </div>
          <div className="space-y-2"><Label className="text-zinc-300">Excerpt / Summary</Label><Input name="excerpt" required disabled={isBlogPending} placeholder="Short preview text..." className="bg-black/50 border-white/10 text-white h-11 rounded-xl" /></div>
          <div className="space-y-2"><Label className="text-zinc-300">Full Content / Markdown</Label><textarea name="content" required disabled={isBlogPending} placeholder="Write your full article body here..." className="flex min-h-[120px] w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 mt-1" /></div>
          <Button type="submit" disabled={isBlogPending} className="w-full bg-white text-black hover:bg-zinc-200 font-medium h-11 rounded-xl mt-4">{isBlogPending ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : "Publish Article"}</Button>
        </form>
      </div>
    </div>
  );
}