"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// --- EXISTING CONTENT ACTIONS ---
export async function createAppAction(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const version = formData.get("version") as string;
  const download_url = formData.get("download_url") as string;
  const file_size = formData.get("file_size") as string;

  
  //  Logo aur Screenshots nikal kar parse kiya
  const logo_url = formData.get("logo_url") as string;
  const screenshots_str = formData.get("screenshot_urls") as string;
  
  let screenshot_urls = null;
  if (screenshots_str) {
    try {
      screenshot_urls = JSON.parse(screenshots_str);
    } catch (error) {
      screenshot_urls = [];
    }
  }

  //  Insert mein logo_url aur screenshot_urls add kiye
  const { error } = await supabase.from("apps").insert({ 
    title, 
    description, 
    version, 
    download_url, 
    file_size,
    logo_url,
    screenshot_urls
  });
  
  if (error) return { error: error.message };
  revalidatePath("/apps"); revalidatePath("/admin");
  return { success: true, message: "Flutter App published successfully!" };
}

export async function createNoteAction(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const file_url = formData.get("file_url") as string;

  const { error } = await supabase.from("notes").insert({ title, subject, description, file_url });
  if (error) return { error: error.message };
  revalidatePath("/notes"); revalidatePath("/admin");
  return { success: true, message: "Study Notes published successfully!" };
}

// Add this in app/actions/admin.ts
export async function createDigitalNoteAction(formData: FormData) {
  const supabase = await createClient();

  const rawSubjectId = formData.get("subject_id") as string;
  const subject_id = rawSubjectId.trim().toLowerCase();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const read_time = formData.get("read_time") as string;
  const content = formData.get("content") as string;

  // Inserting into digital_topics table
  const { error } = await supabase.from("digital_topics").insert({
    subject_id, title, description, read_time, content
  });
  
  if (error) return { error: error.message };
  revalidatePath("/notes"); 
  revalidatePath("/admin");
  return { success: true, message: "Digital Note Published Successfully!" };
}

export async function createBlogAction(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const read_time = formData.get("read_time") as string;
  const content = formData.get("content") as string;

  const { error } = await supabase.from("blogs").insert({ title, excerpt, read_time, content });
  if (error) return { error: error.message };
  revalidatePath("/blog"); revalidatePath("/admin");
  return { success: true, message: "Blog article published successfully!" };
}

export async function deleteItemAction(
  table: "apps" | "notes" | "blogs" | "messages" | "digital_topics", 
  id: string
) {
  const supabase = await createClient();

  try {
    // 1. Sabse pehle item ko database se delete karna (HARD DELETE)
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .select(); // Select return karne se pata chalta hai ki sach me delete hua ya nahi

    if (error) {
      console.error(`Error deleting from ${table}:`, error.message);
      return { error: `Database Error: ${error.message}` };
    }

    // Agar data array khali hai, iska matlab ID galat thi ya item nahi mila
    if (!data || data.length === 0) {
       console.error(`Item with ID ${id} not found in ${table}`);
       return { error: "Item not found in database!" };
    }

    // 2. Cache clear karna taaki refresh hone par purana data wapas na dikhe
    revalidatePath("/admin");
    revalidatePath("/apps");
    revalidatePath("/notes");
    revalidatePath("/blog");
    
    return { success: true, message: "Item permanently deleted from database!" };
    
  } catch (err: any) {
    console.error("Server Action Error:", err.message);
    return { error: "An unexpected error occurred while deleting." };
  }
}

// ---   USER MANAGEMENT ACTIONS ---

export async function updateUserRoleAction(id: string, newRole: "admin" | "user") {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, message: `User role updated to ${newRole.toUpperCase()}!` };
}

export async function updateUserPermissionsAction(id: string, permissions: { can_view_apps: boolean, can_view_notes: boolean, can_view_blogs: boolean }) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(permissions).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, message: "User permissions updated successfully!" };
}

export async function deleteUserAccountAction(id: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Service Role Key missing in .env.local! Cannot delete user." };
  }
  // Use Admin API to fully delete user from Auth
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, message: "User account permanently deleted!" };
}

// --- REVIEW MANAGEMENT ACTIONS ---
export async function replyToReviewAction(reviewId: string, replyText: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("app_reviews").update({ admin_reply: replyText }).eq("id", reviewId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, message: "Reply posted successfully!" };
}

export async function deleteReviewAction(reviewId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("app_reviews").delete().eq("id", reviewId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { success: true, message: "Review deleted successfully!" };
}

export async function createDigitalSubjectAction(id: string, name: string, icon: string) {
  const supabase = await createClient();
  const safeId = id.trim().toLowerCase().replace(/\s+/g, '-');
  
  const { error } = await supabase.from('digital_subjects').insert({ 
    id: safeId, name, icon 
  });
  
  if (error) return { error: error.message };
  
  revalidatePath('/notes'); 
  revalidatePath('/admin');
  return { success: true, message: "New Subject Added!" };
}