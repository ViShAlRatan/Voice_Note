import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Jab bhi admin dashboard refresh karega, uska status update ho jayega
  await supabase.from("profiles")
    .update({ 
      is_online: true, 
      last_seen: new Date().toISOString() 
    })
    .eq("id", user.id);

  // Fetch all existing items and profiles
  const { data: apps } = await supabase.from("apps").select("*").order("created_at", { ascending: false });
  const { data: notes } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  const { data: blogs } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  
  //  TOTAL VISITORS FETCH 
  const { data: siteStats } = await supabase.from("site_stats").select("total_visitors").eq("id", 1).single();

  return (
    <AdminDashboardClient 
      initialApps={apps || []} 
      initialNotes={notes || []} 
      initialBlogs={blogs || []} 
      initialMessages={messages || []}
      initialProfiles={profiles || []}
      initialVisitors={siteStats?.total_visitors || 0} // Ye pass kar sakte hain client ko
    />
  );
}