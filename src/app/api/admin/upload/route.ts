import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import path from "path";
import fs from "fs/promises";

// Allowed MIME types & extensions for security
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

// Helper to verify Compact JWS format (three dot-separated base64url segments)
function isCompactJws(token?: string | null): token is string {
  if (!token || typeof token !== "string") return false;
  const parts = token.trim().split(".");
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization check
    const cookieHeader = req.headers.get("cookie") || "";
    const hasAdminCookie = cookieHeader.includes("admin_verified=true");

    let isSupabaseAdmin = false;
    let serverSupabase = null;
    try {
      serverSupabase = await createServerSupabase();
      const { data: { user } } = await serverSupabase.auth.getUser();
      if (user) {
        const { data: profile } = await serverSupabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        if (profile && (profile.is_admin === true || profile.is_admin === 1 || profile.is_admin === "1")) {
          isSupabaseAdmin = true;
        }
      }
    } catch {
      // Supabase server client cookie resolution is optional if admin_verified cookie is present
    }

    if (!hasAdminCookie && !isSupabaseAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const file = formData.get("file") as File | null;
    const rawPrefix = (formData.get("prefix") as string) || "";

    const allFiles = files.length > 0 ? files : file ? [file] : [];

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const safePrefix = rawPrefix.replace(/[^a-zA-Z0-9_-]/g, "");

    // Supabase project URL
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "https://rxdxykvpnzwontnmgikb.supabase.co";

    // Validate Supabase Service Role Key: Must be a valid 3-part Compact JWS token (never an invented string)
    const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY;
    let supabaseAdmin = null;

    if (rawServiceKey) {
      if (isCompactJws(rawServiceKey)) {
        supabaseAdmin = createClient(supabaseUrl, rawServiceKey.trim());
      } else {
        console.warn(
          "[Upload] SUPABASE_SERVICE_ROLE_KEY is provided but is not a valid Compact JWS. Expected 3 base64url parts (header.payload.signature)."
        );
      }
    }

    const urls: string[] = [];

    // Local storage directory
    const localDir = path.join(process.cwd(), "public", "images");
    try {
      await fs.mkdir(localDir, { recursive: true });
    } catch {}

    for (const f of allFiles) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File ${f.name} exceeds maximum limit of 10MB` },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.has(f.type.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Unsupported file format for ${f.name}. Only JPEG, PNG, WEBP, GIF, and AVIF images are permitted.`,
          },
          { status: 400 }
        );
      }

      const rawExt = path.extname(f.name).toLowerCase() || ".webp";
      if (!ALLOWED_EXTENSIONS.has(rawExt)) {
        return NextResponse.json(
          { error: `Invalid file extension (${rawExt}).` },
          { status: 400 }
        );
      }

      const bytes = await f.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const prefixClean = safePrefix ? `${safePrefix}_` : "";
      const uniqueName = `${prefixClean}${Math.random().toString(36).substring(2, 12)}_${Date.now()}${rawExt}`;

      // 1. Save to local public/images directory
      await fs.writeFile(path.join(localDir, uniqueName), buffer);
      let publicUrl = `/images/${uniqueName}`;

      // 2. If valid Supabase Admin Client is configured, upload to Supabase Storage bucket 'product-images'
      let uploadedToCloud = false;
      if (supabaseAdmin) {
        try {
          const { error: uploadError } = await supabaseAdmin.storage
            .from("product-images")
            .upload(uniqueName, buffer, {
              contentType: f.type || "image/webp",
              upsert: true,
            });

          if (!uploadError) {
            const { data: urlData } = supabaseAdmin.storage
              .from("product-images")
              .getPublicUrl(uniqueName);
            if (urlData?.publicUrl) {
              publicUrl = urlData.publicUrl;
              uploadedToCloud = true;
            }
          } else {
            console.warn("[Upload] Supabase service role upload error:", uploadError.message);
          }
        } catch (storageErr: any) {
          console.warn("[Upload] Supabase storage exception:", storageErr.message);
        }
      }

      // 3. If service role key is not configured, attempt upload via authenticated Supabase admin session
      if (!uploadedToCloud && serverSupabase && isSupabaseAdmin) {
        try {
          const { error: userUploadError } = await serverSupabase.storage
            .from("product-images")
            .upload(uniqueName, buffer, {
              contentType: f.type || "image/webp",
              upsert: true,
            });

          if (!userUploadError) {
            const { data: urlData } = serverSupabase.storage
              .from("product-images")
              .getPublicUrl(uniqueName);
            if (urlData?.publicUrl) {
              publicUrl = urlData.publicUrl;
              uploadedToCloud = true;
            }
          }
        } catch (userErr: any) {
          console.warn("[Upload] Supabase user session upload exception:", userErr.message);
        }
      }

      urls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      url: urls[0],
      urls: urls,
      storage: urls[0].startsWith("http") ? "supabase" : "local",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
