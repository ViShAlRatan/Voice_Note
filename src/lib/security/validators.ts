// lib/security/validators.ts

// 1. Validate File Uploads (Check #23: Size, MIME Type & Extension)
export function validateFileUpload(
  file: File,
  options: {
    maxSizeMB: number;
    allowedExtensions: string[];
    allowedMimeTypes?: string[];
  }
): { valid: boolean; error?: string } {
  const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must be under ${options.maxSizeMB} MB.` };
  }

  const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
  if (!options.allowedExtensions.includes(ext)) {
    return { valid: false, error: `Invalid file type. Allowed: ${options.allowedExtensions.join(", ")}` };
  }

  // Prevent double extension attacks like "malware.php.png"
  const parts = file.name.split(".");
  if (parts.length > 2) {
    const dangerousExts = ["php", "exe", "sh", "bat", "js", "html", "svg"];
    const hasDangerous = parts.slice(0, -1).some((p) => dangerousExts.includes(p.toLowerCase()));
    if (hasDangerous) {
      return { valid: false, error: "Suspicious filename detected." };
    }
  }

  if (options.allowedMimeTypes && file.type && !options.allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: "File format does not match its extension." };
  }

  return { valid: true };
}

// 2. Validate External URLs (Check #8 & #25: Prevent javascript: XSS & unsafe URLs)
export function isValidHttpsUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr.trim());
    // Strictly allow only HTTPS protocol
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

// 3. Sanitize HTML for Digital Notes (Check #9: Prevent Stored XSS without breaking styles)
export function sanitizeNoteHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return "";
  return dirtyHtml
    // Remove <script>, <iframe>, <object>, <embed>, <form> tags completely
    .replace(/<(script|iframe|object|embed|form|meta|link)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "")
    .replace(/<(script|iframe|object|embed|form|meta|link)\b[^>]*>/gi, "")
    // Remove inline event handlers like onload=, onerror=, onclick=
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Remove javascript: or data:text/html protocols inside href/src
    .replace(/(href|src)\s*=\s*["']?\s*(javascript:|data:text\/html)[^"'\s>]*/gi, '$1="#"');
}

// 4. Strict 11-Character YouTube ID Validator (Check #8 & #9)
export function extractSafeYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  const candidate = match && match[2].length === 11 ? match[2] : trimmed;

  // Strictly allow only 11 alphanumeric, dash, or underscore characters
  return /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
}