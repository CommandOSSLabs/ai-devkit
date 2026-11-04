import { NextRequest, NextResponse } from "next/server";
import { autoEnrichSkillUrl } from "@/lib/auto-enrich-skill";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      url?: string;
      customThumbnailUrl?: string;
      collectionId?: string;
    };

    const rawUrl = (body.url ?? "").trim();
    if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please provide a valid URL starting with http:// or https://",
        },
        { status: 400 },
      );
    }

    const result = await autoEnrichSkillUrl({
      url: rawUrl,
      customThumbnailUrl: body.customThumbnailUrl,
      collectionId: body.collectionId,
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to auto-parse URL";
    const isValidationError = /invalid url/i.test(message);
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: isValidationError ? 400 : 500 },
    );
  }
}
