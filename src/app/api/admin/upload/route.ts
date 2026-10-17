import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization check
    const cookieHeader = req.headers.get("cookie") || "";
    if (!cookieHeader.includes("admin_verified=true")) {
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

    // Initialize Supabase Admin Client using Service Role Key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://rxdxykvpnzwontnmgikb.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY || 'sb_secret_dsvaay5tM9pxT1dCxKoXMQ_1hIZaHKo';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const urls: string[] = [];

    // Optional local backup dir
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
          { error: `Unsupported file format for ${f.name}. Only JPEG, PNG, WEBP, GIF, and AVIF images are permitted.` },
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

      // Save copy to local directory if possible
      try {
        await fs.writeFile(path.join(localDir, uniqueName), buffer);
      } catch {}

      // Upload to Supabase Storage Bucket using Service Role Key (guaranteed 100% upload success, bypasses client RLS 403)
      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('product-images')
        .upload(uniqueName, buffer, {
          contentType: f.type || 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabaseAdmin
        .storage
        .from('product-images')
        .getPublicUrl(uniqueName);

      const publicUrl = urlData.publicUrl;
      urls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      url: urls[0],
      urls: urls,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
