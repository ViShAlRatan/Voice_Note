"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MaintenanceRealtimeListener() {
  const supabase = createClient();

  useEffect(() => {
    // Supabase Realtime channel jo site_settings table par nazar rakhega
    const channel = supabase
      .channel("maintenance_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_settings",
          filter: "id=eq.1",
        },
        () => {
          // Jaise hi admin maintenance on/off karega, page instant reload ho jayega
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return null;
}