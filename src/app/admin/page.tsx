import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch all existing items and profiles
  const { data: apps } = await supabase.from("apps").select("*").order("created_at", { ascending: false });
  const { data: notes } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  const { data: blogs } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <AdminDashboardClient 
      initialApps={apps || []} 
      initialNotes={notes || []} 
      initialBlogs={blogs || []} 
      initialMessages={messages || []}
      initialProfiles={profiles || []}
    />
  );
}