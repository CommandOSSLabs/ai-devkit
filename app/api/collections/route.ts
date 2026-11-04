import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  listCollectionsAndRefs,
  slugifyId,
  upsertSkillCollection,
  verifyAdminPasskey,
  type UpsertSkillCollectionInput,
} from "@/lib/collections-store";

function extractAdminSecret(
  request: NextRequest,
  bodySecret?: string | null,
): string | null {
  const headerSecret =
    request.headers.get("x-admin-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.nextUrl.searchParams.get("adminSecret");
  return (headerSecret || bodySecret || "").trim() || null;
}

function revalidateCollectionsCache() {
  try {
    revalidatePath("/skills/collections");
    revalidatePath("/skills/explore");
    revalidateTag("skill-collections");
  } catch {
    // Ignore when called outside Next.js request context (e.g. unit tests)
  }
}

export async function GET(request: NextRequest) {
  try {
    const secret = extractAdminSecret(request);
    const isAdmin = verifyAdminPasskey(secret);
    const includePendingParam = request.nextUrl.searchParams.get("includePending");
    const includePending =
      isAdmin || includePendingParam === "1" || includePendingParam === "true";

    const payload = await listCollectionsAndRefs({ includePending });
    return NextResponse.json(
      {
        ok: true,
        ...payload,
        isAdmin,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load collections",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      adminSecret?: string;
      collection?: Partial<UpsertSkillCollectionInput>;
    } & Partial<UpsertSkillCollectionInput>;

    const secret = extractAdminSecret(request, body.adminSecret);
    if (!verifyAdminPasskey(secret)) {
      return NextResponse.json(
        { ok: false, error: "Invalid or missing admin passkey." },
        { status: 401 },
      );
    }

    const rawCollection = body.collection ?? body;
    const title = (rawCollection.title ?? "").trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Collection title is required." },
        { status: 400 },
      );
    }

    const id = slugifyId(rawCollection.id || title);
    const saved = await upsertSkillCollection({
      id,
      title,
      subtitle: rawCollection.subtitle,
      description: rawCollection.description,
      badge: rawCollection.badge,
      accentColor: rawCollection.accentColor,
      pairedCmkIds: rawCollection.pairedCmkIds,
      sortOrder: rawCollection.sortOrder,
    });

    revalidateCollectionsCache();

    return NextResponse.json({
      ok: true,
      collection: saved,
      isAdmin: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to save collection",
      },
      { status: 500 },
    );
  }
}
