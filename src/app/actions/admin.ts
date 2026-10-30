"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

// ============================================================================
// 🔒 SECURITY HELPERS (Checklist #4, #6, #8, #9, #12, #13, #17, #25)
// ============================================================================

// Simple In-Memory Rate Limiter for Admin Actions (Check #12)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkAdminRateLimit(userId: string, maxRequests = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

// Strict Server-Side Admin Verification (Check #4, #6, #13)
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false as const, error: "Unauthorized: Please sign in first." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { authorized: false as const, error: "Forbidden: Admin privileges required." };
  }

  if (!checkAdminRateLimit(user.id)) {
    return { authorized: false as const, error: "Too many requests. Please wait a minute." };
  }

  return { authorized: true as const, supabase, user };
}

// Server-Side URL Validator (Check #8 & #25: Prevent SSRF & javascript: XSS)
function isSafeHttpsUrl(urlStr: string | null | undefined): boolean {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Server-Side HTML Sanitizer for Digital Notes (Check #9: Prevent Stored XSS)
function sanitizeHtmlServer(dirtyHtml: string): string {
  if (!dirtyHtml) return "";
  return String(dirtyHtml)
    .replace(/<(script|iframe|object|embed|form|meta|link)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "")
    .replace(/<(script|iframe|object|embed|form|meta|link)\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*["']?\s*(javascript:|data:text\/html)[^"'\s>]*/gi, '$1="#"');
}

// Safe Error Formatter (Check #17: Hide raw DB details in production)
function safeErrorMessage(error: any, fallbackMessage: string): string {
  console.error("[Admin Action Error]:", error);
  if (process.env.NODE_ENV === "development" && error?.message) {
    return error.message;
  }
  return fallbackMessage;
}

const VALID_PAPERS = ["paper1", "paper2"];
const VALID_UNITS = ["unit1", "unit2", "unit3", "unit4", "unit5", "unit6", "unit7", "unit8", "unit9", "unit10"];
const VALID_OPTIONS = ["A", "B", "C", "D"];
const ALLOWED_DELETE_TABLES = ["apps", "notes", "blogs", "messages", "digital_topics", "class_notes"] as const;

// ============================================================================
// 🚀 SECURED CONTENT ACTIONS
// ============================================================================

export async function createAppAction(formData: FormData) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const version = (formData.get("version") as string)?.trim();
  const download_url = (formData.get("download_url") as string)?.trim();
  const file_size = (formData.get("file_size") as string)?.trim();
  const logo_url = (formData.get("logo_url") as string)?.trim();
  const screenshots_str = formData.get("screenshot_urls") as string;

  if (!title || !description || !version) {
    return { error: "Title, description, and version are required." };
  }
  if (!isSafeHttpsUrl(download_url) || !isSafeHttpsUrl(logo_url)) {
    return { error: "Invalid download or logo URL. Must be a valid HTTPS link." };
  }

  let screenshot_urls: string[] | null = null;
  if (screenshots_str) {
    try {
      const parsed = JSON.parse(screenshots_str);
      if (Array.isArray(parsed)) {
        screenshot_urls = parsed.filter((u) => typeof u === "string" && isSafeHttpsUrl(u)).slice(0, 4);
      }
    } catch {
      screenshot_urls = [];
    }
  }

  const { error } = await supabase.from("apps").insert({
    title,
    description,
    version,
    download_url,
    file_size,
    logo_url,
    screenshot_urls,
  });

  if (error) return { error: safeErrorMessage(error, "Failed to publish app.") };
  revalidatePath("/apps");
  revalidatePath("/admin");
  return { success: true, message: "Flutter App published successfully!" };
}

export async function createNoteAction(formData: FormData) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  const title = (formData.get("title") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const file_url = (formData.get("file_url") as string)?.trim();

  if (!title || !subject || !description) {
    return { error: "All note fields are required." };
  }
  if (!isSafeHttpsUrl(file_url)) {
    return { error: "Invalid PDF URL. Must be a secure HTTPS link." };
  }

  const { error } = await supabase.from("notes").insert({ title, subject, description, file_url });
  if (error) return { error: safeErrorMessage(error, "Failed to publish study notes.") };
  revalidatePath("/notes");
  revalidatePath("/admin");
  return { success: true, message: "Study Notes published successfully!" };
}

export async function createDigitalNoteAction(formData: FormData) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  const rawSubjectId = formData.get("subject_id") as string;
  const subject_id = (rawSubjectId || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");

  const paper_type = (formData.get("paper_type") as string)?.trim();
  const unit_number = (formData.get("unit_number") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const read_time = (formData.get("read_time") as string)?.trim();

  if (!subject_id || !title || !VALID_PAPERS.includes(paper_type) || !VALID_UNITS.includes(unit_number)) {
    return { error: "Invalid paper, unit, subject, or title provided." };
  }

  const content = formData.get("content") as string;
  const pagesRaw = formData.get("pages") as string;

  let pages: string[] | null = null;
  if (pagesRaw) {
    try {
      const parsed = JSON.parse(pagesRaw);
      if (Array.isArray(parsed)) {
        pages = parsed.map((p) => sanitizeHtmlServer(String(p)));
      }
    } catch {
      return { error: "Invalid pages format." };
    }
  }

  const insertData: Record<string, any> = {
    subject_id,
    title,
    description,
    read_time,
    paper_type,
    unit_number,
  };

  if (content) insertData.content = sanitizeHtmlServer(content);
  if (pages) insertData.pages = pages;

  const { error } = await supabase.from("digital_topics").insert(insertData);

  if (error) {
    return { error: safeErrorMessage(error, "Failed to publish digital note.") };
  }

  revalidatePath("/notes");
  revalidatePath("/admin");
  return { success: true, message: "Digital Note Published Successfully!" };
}

export async function createBlogAction(formData: FormData) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const read_time = (formData.get("read_time") as string)?.trim();
  const content = formData.get("content") as string;

  if (!title || !excerpt || !content) {
    return { error: "Title, excerpt, and content are required." };
  }

  const { error } = await supabase.from("blogs").insert({
    title,
    excerpt,
    read_time,
    content: sanitizeHtmlServer(content),
  });
  if (error) return { error: safeErrorMessage(error, "Failed to publish blog article.") };
  revalidatePath("/blog");
  revalidatePath("/admin");
  return { success: true, message: "Blog article published successfully!" };
}

export async function deleteItemAction(
  table: "apps" | "notes" | "blogs" | "messages" | "digital_topics",
  id: string
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  // Runtime Table Whitelist Check (Check #8 & #10)
  if (!ALLOWED_DELETE_TABLES.includes(table) || !id || typeof id !== "string") {
    return { error: "Invalid delete request." };
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return { error: safeErrorMessage(error, "Database error while deleting item.") };
    }

    if (!data || data.length === 0) {
      return { error: "Item not found in database!" };
    }

    revalidatePath("/admin");
    revalidatePath("/apps");
    revalidatePath("/notes");
    revalidatePath("/blog");

    return { success: true, message: "Item permanently deleted from database!" };
  } catch (err: any) {
    return { error: safeErrorMessage(err, "An unexpected error occurred while deleting.") };
  }
}

// ============================================================================
// 👤 SECURED USER MANAGEMENT ACTIONS
// ============================================================================

export async function updateUserRoleAction(id: string, newRole: "admin" | "user") {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase, user } = auth;

  if (!id || !["admin", "user"].includes(newRole)) {
    return { error: "Invalid user ID or role specified." };
  }

  // Prevent Admin from accidentally demoting themselves
  if (id === user.id && newRole !== "admin") {
    return { error: "Safety Lock: You cannot remove your own Admin role!" };
  }

  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
  if (error) return { error: safeErrorMessage(error, "Failed to update user role.") };
  revalidatePath("/admin");
  return { success: true, message: `User role updated to ${newRole.toUpperCase()}!` };
}

export async function updateUserPermissionsAction(
  id: string,
  permissions: { can_view_apps: boolean; can_view_notes: boolean; can_view_blogs: boolean }
) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  if (!id || typeof permissions !== "object" || permissions === null) {
    return { error: "Invalid permissions payload." };
  }

  // Prevent Mass Assignment Vulnerability: Only pick the 3 allowed boolean fields!
  const safePermissions = {
    can_view_apps: Boolean(permissions.can_view_apps),
    can_view_notes: Boolean(permissions.can_view_notes),
    can_view_blogs: Boolean(permissions.can_view_blogs),
  };

  const { error } = await supabase.from("profiles").update(safePermissions).eq("id", id);
  if (error) return { error: safeErrorMessage(error, "Failed to update user permissions.") };
  revalidatePath("/admin");
  return { success: true, message: "User permissions updated successfully!" };
}

export async function deleteUserAccountAction(id: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { user } = auth;

  if (!id || typeof id !== "string") {
    return { error: "Invalid user ID." };
  }

  // Prevent Admin from deleting their own account
  if (id === user.id) {
    return { error: "Safety Lock: You cannot delete your own Admin account!" };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[Config Error]: SUPABASE_SERVICE_ROLE_KEY is missing.");
    return { error: "Server configuration error: Unable to delete user." };
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) return { error: safeErrorMessage(error, "Failed to delete user account.") };
  revalidatePath("/admin");
  return { success: true, message: "User account permanently deleted!" };
}

// ============================================================================
// ⭐ SECURED REVIEW & SUBJECT ACTIONS
// ============================================================================

export async function replyToReviewAction(reviewId: string, replyText: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  if (!reviewId || typeof replyText !== "string") {
    return { error: "Invalid review ID or reply text." };
  }

  const cleanReply = sanitizeHtmlServer(replyText.trim()).slice(0, 1000);

  const { error } = await supabase
    .from("app_reviews")
    .update({ admin_reply: cleanReply })
    .eq("id", reviewId);
  if (error) return { error: safeErrorMessage(error, "Failed to post reply.") };
  revalidatePath("/admin");
  return { success: true, message: "Reply posted successfully!" };
}

export async function deleteReviewAction(reviewId: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  if (!reviewId) return { error: "Invalid review ID." };

  const { error } = await supabase.from("app_reviews").delete().eq("id", reviewId);
  if (error) return { error: safeErrorMessage(error, "Failed to delete review.") };
  revalidatePath("/admin");
  return { success: true, message: "Review deleted successfully!" };
}

export async function createDigitalSubjectAction(id: string, name: string, icon: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  const safeId = (id || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const safeName = (name || "").trim().slice(0, 80);
  const safeIcon = (icon || "").trim().slice(0, 4);

  if (!safeId || !safeName) {
    return { error: "Valid Subject ID and Name are required." };
  }

  const { error } = await supabase.from("digital_subjects").insert({
    id: safeId,
    name: safeName,
    icon: safeIcon,
  });

  if (error) return { error: safeErrorMessage(error, "Failed to add new subject.") };

  revalidatePath("/notes");
  revalidatePath("/admin");
  return { success: true, message: "New Subject Added!" };
}

// ============================================================================
// ❓ SECURED QUESTION BANK ACTIONS
// ============================================================================

export async function createQuestionAction(data: {
  paper_type: string;
  unit_number: string;
  question: string;
  opta: string;
  optb: string;
  optc: string;
  optd: string;
  correct_answer: string;
  explanation: string;
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  const answer = data.correct_answer?.trim().toUpperCase();
  if (
    !VALID_PAPERS.includes(data.paper_type) ||
    !VALID_UNITS.includes(data.unit_number) ||
    !VALID_OPTIONS.includes(answer) ||
    !data.question?.trim()
  ) {
    return { error: "Invalid question data provided." };
  }

  const cleanData = {
    paper_type: data.paper_type,
    unit_number: data.unit_number,
    question: data.question.trim(),
    opta: data.opta?.trim() || "",
    optb: data.optb?.trim() || "",
    optc: data.optc?.trim() || "",
    optd: data.optd?.trim() || "",
    correct_answer: answer,
    explanation: data.explanation?.trim() || "",
  };

  const { error } = await supabase.from("question_bank").insert(cleanData);

  if (error) {
    return { error: safeErrorMessage(error, "Failed to save question.") };
  }

  revalidatePath("/practice");
  revalidatePath("/admin");
  return { success: true, message: "Question saved successfully!" };
}

export async function createBulkQuestionsAction(questionsArray: any[]) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };
  const { supabase } = auth;

  if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
    return { error: "Question list cannot be empty." };
  }

  // Prevent DoS via huge array payload (Max 500 questions per batch)
  if (questionsArray.length > 500) {
    return { error: "Maximum 500 questions allowed per bulk upload." };
  }

  const formattedData = questionsArray
    .filter((q) => q && typeof q.question === "string" && q.question.trim().length > 0)
    .map((q) => {
      const ans = String(q.correct_answer || "A").trim().toUpperCase();
      return {
        paper_type: VALID_PAPERS.includes(q.paper_type) ? q.paper_type : "paper1",
        unit_number: VALID_UNITS.includes(q.unit_number) ? q.unit_number : "unit1",
        question: String(q.question).trim(),
        opta: String(q.opta || "").trim(),
        optb: String(q.optb || "").trim(),
        optc: String(q.optc || "").trim(),
        optd: String(q.optd || "").trim(),
        correct_answer: VALID_OPTIONS.includes(ans) ? ans : "A",
        explanation: String(q.explanation || "").trim(),
      };
    });

  if (formattedData.length === 0) {
    return { error: "No valid questions found in the uploaded file." };
  }

  const { error } = await supabase.from("question_bank").insert(formattedData);

  if (error) {
    return { error: safeErrorMessage(error, "Failed to bulk upload questions.") };
  }

  revalidatePath("/practice");
  revalidatePath("/admin");
  return { success: true };
}