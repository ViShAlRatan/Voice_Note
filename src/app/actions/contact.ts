"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactAction(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields." };
  }

  const { error } = await supabase.from("messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Message sent successfully! I'll get back to you soon." };
}