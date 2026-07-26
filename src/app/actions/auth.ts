"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Resend } from "resend"; 

// 2. Resend ko initialize kiya
const resend = new Resend(process.env.RESEND_API_KEY); 

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Custom Check: Agar email verify nahi hua hai
    if (error.message.includes("Email not confirmed")) {
      return { error: "⚠️ Please confirm your email first! Check your inbox for the verification link." };
    }
    // Agar sach me password galat hai
    return { error: error.message };
  }

  // Fetch the user's role from the profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return { success: true, role: profile?.role || "user" };
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Agar signup form mein user ka naam aata hai toh wo lenge, warna "Buddy" use karenge
  const name = (formData.get("name") as string) || (formData.get("full_name") as string) || "Buddy";
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Account created! You can now log in." };
}

//  SEPARATE EXPORTED FUNCTION (Isse aapka `RegisterPage` easily call kar payega) 
export async function sendWelcomeEmail(email: string, name: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    await resend.emails.send({
      from: "Voice Note <onboarding@resend.dev>", // Production mein apna domain lagana
      to: email,
      subject: "Welcome to Voice Note ! 💖",
      html: `
        <div style="background-color: #000000; padding: 40px 20px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0c0c0e; border-radius: 24px; border: 1px solid #27272a; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            
            <!-- Hero Section with Soft Glow -->
            <div style="background: linear-gradient(180deg, rgba(16,185,129,0.12) 0%, rgba(12,12,14,0) 100%); padding: 40px 30px 20px; text-align: center;">
              <div style="display: inline-block; padding: 16px; background-color: rgba(16,185,129,0.1); border-radius: 20px; margin-bottom: 20px; border: 1px solid rgba(16,185,129,0.2); box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);">
                <span style="font-size: 32px; line-height: 1;">🥰</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: -1px;">
                VOICE<span style="color: #10b981;">NOTE</span>
              </h1>
              <p style="margin: 10px 0 0; color: #a1a1aa; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">
                Welcome to the Future
              </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 0 30px 30px;">
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; margin-bottom: 16px;">Hello ${name},</h2>
              <p style="color: #d4d4d8; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 35px;">
                Your account is officially active! You've just unlocked access to an exclusive workspace designed to supercharge your knowledge and workflow.
              </p>

              <!-- Premium Feature Section -->
              <div style="background-color: #121214; padding: 25px; border-radius: 16px; border: 1px solid #27272a; margin-bottom: 35px;">
                <p style="color: #10b981; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 20px;">Your Access Includes</p>
                
                <!-- Feature 1 -->
                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                  <div style="background-color: rgba(16,185,129,0.1); border-radius: 10px; padding: 10px; margin-right: 16px; border: 1px solid rgba(16,185,129,0.1);">
                    <span style="font-size: 18px;">📚</span>
                  </div>
                  <div style="padding-top: 2px;">
                    <h4 style="color: #ffffff; margin: 0 0 4px; font-size: 16px; font-weight: 600;">Premium Notes</h4>
                    <p style="color: #a1a1aa; margin: 0; font-size: 14px; line-height: 1.5;">Access high-quality digital and handwritten study materials.</p>
                  </div>
                </div>

                <!-- Feature 2 -->
                <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                  <div style="background-color: rgba(16,185,129,0.1); border-radius: 10px; padding: 10px; margin-right: 16px; border: 1px solid rgba(16,185,129,0.1);">
                    <span style="font-size: 18px;">⚡</span>
                  </div>
                  <div style="padding-top: 2px;">
                    <h4 style="color: #ffffff; margin: 0 0 4px; font-size: 16px; font-weight: 600;">Tech Apps Hub</h4>
                    <p style="color: #a1a1aa; margin: 0; font-size: 14px; line-height: 1.5;">Explore exclusive tools, projects, and source codes.</p>
                  </div>
                </div>

                <!-- Feature 3 -->
                <div style="display: flex; align-items: flex-start;">
                  <div style="background-color: rgba(16,185,129,0.1); border-radius: 10px; padding: 10px; margin-right: 16px; border: 1px solid rgba(16,185,129,0.1);">
                    <span style="font-size: 18px;">💎</span>
                  </div>
                  <div style="padding-top: 2px;">
                    <h4 style="color: #ffffff; margin: 0 0 4px; font-size: 16px; font-weight: 600;">Verified Resources</h4>
                    <p style="color: #a1a1aa; margin: 0; font-size: 14px; line-height: 1.5;">Read top-tier blogs and guides curated by administrators.</p>
                  </div>
                </div>
              </div>

              <!-- Call to Action Button -->
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 36px; border-radius: 12px; box-shadow: 0 10px 20px -10px rgba(16, 185, 129, 0.6); text-transform: uppercase; letter-spacing: 0.5px;">
                  Enter Workspace ➔
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #09090b; padding: 30px; text-align: center; border-top: 1px solid #27272a;">
              <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">
                You received this email because you signed up for Voice Note.<br/>
                If you didn't request this, you can safely ignore it.
              </p>
              <p style="color: #52525b; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                © 2026 Voice Note. All rights reserved.
              </p>
            </div>
            
          </div>
        </div>
      `
    });
    return { success: true, message: "Welcome email sent successfully." };
  } catch (emailError) {
    console.error("Email send failed:", emailError);
    return { error: "Failed to send welcome email." };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signOutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

// 1. Password Reset Link Bhejne ke liye
export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
  });

  if (error) return { error: error.message };
  return { success: true, message: "Password reset link sent to your email!" };
}

// 2. Naya Password Save karne ke liye
export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: true, message: "Password updated successfully!" };
}