"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/app/actions/auth";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    // 1. Action start hote hi loading toast
    toast.loading("Logging out...", { id: "logout-toast" });

    startTransition(async () => {
      const result = await signOutUser();
      
      if (result?.error) {
        toast.dismiss("logout-toast");
        toast.error(`Error: ${result.error}`);
      } else {
        toast.dismiss("logout-toast");
        
        // 🔥 PREMIUM LOGOUT TOAST 🔥
        toast("Logged out securely! 👋", {
          icon: "🔒",
          description: "System secured. See you next time.",
          duration: 2000,
          style: {
            background: "#18181b",
            color: "white",
            border: "1px solid #f59e0b",
          },
        });
        
        // 800ms ka delay taaki user premium toast dekh sake
        setTimeout(() => {
          router.push("/login");
          router.refresh(); // Session completely clear ho jayega
        }, 800);
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      disabled={isPending}
      className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-full text-xs h-10 px-4 transition-all"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <LogOut className="w-3.5 h-3.5 mr-2" />}
      {isPending ? "Signing Out..." : "Sign Out"}
    </Button>
  );
}