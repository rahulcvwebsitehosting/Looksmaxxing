import { NextResponse } from "next/server";
import { ProviderRouter } from "@/providers";

export const maxDuration = 30;
export const runtime = "nodejs";

export async function GET() {
  try {
    const router = new ProviderRouter();
    const statuses = await router.getProviderStatuses();
    return NextResponse.json({ statuses });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ statuses: [], error: message }, { status: 200 });
  }
}