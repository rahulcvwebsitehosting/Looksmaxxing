import { NextRequest, NextResponse } from "next/server";
import { ProviderRouter } from "@/providers";


const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: `Invalid image type: ${imageFile.type}. Allowed: JPEG, PNG, WebP` },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Maximum 15MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = btoa(
      Array.from(new Uint8Array(arrayBuffer))
        .map((b) => String.fromCharCode(b))
        .join("")
    );

    const router = new ProviderRouter();
    const { result, providerUsed } = await router.analyze(base64, imageFile.type);

    return NextResponse.json({
      success: true,
      result,
      provider: providerUsed,
    });
  } catch (err) {
    console.error("[analyze] Error:", err instanceof Error ? err.message : err);
    const message = err instanceof Error ? "Analysis failed. Please try again." : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}