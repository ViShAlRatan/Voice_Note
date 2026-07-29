"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OnlineTracker() {
  useEffect(() => {
    const supabase = createClient();

    const updateOnlineStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Sirf last_seen time update karte raho
        await supabase
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', user.id);
      }
    };

    // Jaise hi page khule, time update kar do
    updateOnlineStatus();

    // Har 2 minute mein chupchap time update karta rahega (Heartbeat)
    const interval = setInterval(updateOnlineStatus, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; 
}