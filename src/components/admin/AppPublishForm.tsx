"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Loader2, UploadCloud, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createAppAction } from "@/app/actions/admin";

// SMART PROGRESS SIMULATOR (Local Helper)
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

export default function AppPublishForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const isCancelledRef = useRef({ logo: false, screenshots: false, apk: false });
  const [inputKeys, setInputKeys] = useState({ logo: Date.now(), screenshots: Date.now()+1, apk: Date.now()+2 });

  const [apkMode, setApkMode] = useState<'upload' | 'link'>('upload');
  
  const [externalApkUrl, setExternalApkUrl] = useState("");
  const [externalApkSize, setExternalApkSize] = useState("");

  const [isAppUploading, setIsAppUploading] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isScreenshotsUploading, setIsScreenshotsUploading] = useState(false);
  const [isApkUploading, setIsApkUploading] = useState(false);

  const [logoProgress, setLogoProgress] = useState<number | null>(null);
  const [screenshotProgress, setScreenshotProgress] = useState<number | null>(null);
  const [apkProgress, setApkProgress] = useState<number | null>(null);

  const [appFile, setAppFile] = useState<File | null>(null);
  const [appLogo, setAppLogo] = useState<File | null>(null);
  const [appScreenshots, setAppScreenshots] = useState<File[]>([]);

  const [uploadedAppUrl, setUploadedAppUrl] = useState("");
  const [uploadedAppSize, setUploadedAppSize] = useState("");
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [uploadedScreenshotUrls, setUploadedScreenshotUrls] = useState<string[]>([]);

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
        setInputKeys({ logo: Date.now(), screenshots: Date.now()+1, apk: Date.now()+2 });
        router.refresh(); 
      }
      setIsAppUploading(false);
    });
  };

  return (
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
          <div className="space-y-2">
            <Label className="text-zinc-300">App Logo</Label>
            <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
              <input key={inputKeys.logo} type="file" accept="image/*" onChange={handleLogoSelect} disabled={isLogoUploading || isAppUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
              <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                {isLogoUploading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin"/> : <UploadCloud className="w-4 h-4 text-indigo-400"/>}
                {isLogoUploading ? <span className="text-indigo-400 font-bold ml-1">Uploading... {logoProgress}%</span> : appLogo ? <span className="text-emerald-400 font-bold ml-1 truncate max-w-[150px]">{logoProgress === 100 ? `Uploaded: ${appLogo.name}` : appLogo.name}</span> : "Select App Logo"}
              </div>
              {(appLogo || isLogoUploading) && (
                <button type="button" onClick={handleLogoCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Screenshots (Max 4)</Label>
            <div className="relative w-full h-12 rounded-xl border border-dashed border-white/20 bg-black/50 hover:bg-white/5 transition-colors flex items-center justify-between px-4 overflow-hidden">
              <input key={inputKeys.screenshots} type="file" accept="image/*" multiple onChange={handleScreenshotSelect} disabled={isScreenshotsUploading || isAppUploading} className="absolute inset-0 opacity-0 cursor-pointer z-0" />
              <div className="flex items-center gap-2 pointer-events-none text-sm text-zinc-400 z-0">
                {isScreenshotsUploading ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin"/> : <UploadCloud className="w-4 h-4 text-indigo-400"/>}
                {isScreenshotsUploading ? <span className="text-indigo-400 font-bold ml-1">Uploading... {screenshotProgress}%</span> : appScreenshots.length > 0 ? <span className="text-emerald-400 font-bold ml-1">{screenshotProgress === 100 ? `100% Uploaded` : `${appScreenshots.length} images selected`}</span> : "Select up to 4 images"}
              </div>
              {(appScreenshots.length > 0 || isScreenshotsUploading) && (
                <button type="button" onClick={handleScreenshotCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
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
                <button type="button" onClick={handleApkCancel} className="relative z-10 p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
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
  );
}