"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  newSub: { id: string; name: string; icon: string };
  setNewSub: (val: { id: string; name: string; icon: string }) => void;
  onAdd: () => void;
  isAdding: boolean;
}

export default function SubjectModal({ isOpen, onClose, newSub, setNewSub, onAdd, isAdding }: SubjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
        <h3 className="text-lg font-bold mb-4 text-white">Add New Subject</h3>
        <div className="space-y-4 mb-6">
          <div>
            <Label className="text-zinc-300">Subject ID (e.g., java, os)</Label>
            <Input value={newSub.id} onChange={(e) => setNewSub({ ...newSub, id: e.target.value })} className="bg-black border-white/10 mt-1" />
          </div>
          <div>
            <Label className="text-zinc-300">Full Name (e.g., Java Programming)</Label>
            <Input value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} className="bg-black border-white/10 mt-1" />
          </div>
          <div>
            <Label className="text-zinc-300">Emoji Icon (e.g., ☕, 💻)</Label>
            <Input value={newSub.icon} onChange={(e) => setNewSub({ ...newSub, icon: e.target.value })} maxLength={2} className="bg-black border-white/10 mt-1" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">Cancel</Button>
          <Button type="button" onClick={onAdd} disabled={isAdding} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}