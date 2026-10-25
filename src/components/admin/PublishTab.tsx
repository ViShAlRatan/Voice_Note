"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createDigitalSubjectAction } from "@/app/actions/admin";

// Import independent components
import AppPublishForm from "@/components/admin/AppPublishForm";
import NotePublishForm from "@/components/admin/NotePublishForm";
import BlogPublishForm from "@/components/admin/BlogPublishForm";
import SubjectModal from "@/components/admin/SubjectModal";

export default function PublishTab() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  
  // State required for NotePublishForm & SubjectModal
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSubjectAdding, setIsSubjectAdding] = useState(false);
  const [newSub, setNewSub] = useState({ id: "", name: "", icon: "" });

  // Fetch subjects only once on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from('digital_subjects').select('*');
      if (data) setSubjects(data);
    };
    fetchSubjects();
  }, [supabase]);

  // Handle adding new Subject globally
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
        
        // Refresh subjects directly
        const { data } = await supabase.from('digital_subjects').select('*');
        if (data) setSubjects(data);
        router.refresh();
      }
      setIsSubjectAdding(false);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      
      {/* 1. App Publish */}
      <AppPublishForm />

      {/* 2. Notes Publish (Handwritten, Digital, Questions) */}
      <NotePublishForm 
        subjects={subjects} 
        onOpenSubjectModal={() => setIsSubjectModalOpen(true)} 
      />

      {/* 3. Tech Blog Publish */}
      <BlogPublishForm />

      {/* Global Subject Modal */}
      <SubjectModal 
        isOpen={isSubjectModalOpen} 
        onClose={() => setIsSubjectModalOpen(false)} 
        newSub={newSub} 
        setNewSub={setNewSub} 
        onAdd={handleAddSubject} 
        isAdding={isSubjectAdding} 
      />

    </div>
  );
}