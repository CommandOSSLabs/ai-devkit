import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { autoEnrichSkillUrl } from "@/lib/auto-enrich-skill";
import {
  listCollectionsAndRefs,
  upsertSkillRef,
  verifyAdminPasskey,
  type RefRecordStatus,
  type UpsertSkillRefInput,
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
      isAdmin ||
      includePendingParam === "1" ||
      includePendingParam === "true" ||
      includePendingParam === null;

    const { refs, pendingRefs, source } = await listCollectionsAndRefs({
      includePending,
    });

    return NextResponse.json(
      {
        ok: true,
        refs,
        pendingRefs,
        source,
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
          error instanceof Error ? error.message : "Failed to list skill refs",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      ref?: Partial<UpsertSkillRefInput>;
      adminSecret?: string;
      status?: RefRecordStatus;
      url?: string;
      customThumbnailUrl?: string;
    } & Partial<UpsertSkillRefInput>;

    const secret = extractAdminSecret(request, body.adminSecret);
    const isAdmin = verifyAdminPasskey(secret);

    const requestedStatus = body.status ?? body.ref?.status;
    const validStatus: RefRecordStatus =
      requestedStatus === "pending_review" ||
      requestedStatus === "archived" ||
      requestedStatus === "published"
        ? requestedStatus
        : "published";

    const finalStatus: RefRecordStatus = isAdmin ? validStatus : "pending_review";

    let refCandidate: Partial<UpsertSkillRefInput> | undefined = body.ref;

    if (!refCandidate && body.url && !body.title) {
      const enriched = await autoEnrichSkillUrl({
        url: body.url,
        customThumbnailUrl: body.customThumbnailUrl,
        collectionId: body.collectionId,
      });
      refCandidate = enriched.ref;
    } else if (!refCandidate) {
      refCandidate = body;
    }

    const title = (refCandidate?.title ?? refCandidate?.name ?? "").trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Skill ref title is required." },
        { status: 400 },
      );
    }

    const collectionId = (refCandidate?.collectionId ?? "design").trim() || "design";

    const saved = await upsertSkillRef(
      {
        ...refCandidate,
        title,
        collectionId,
      },
      { status: finalStatus },
    );

    revalidateCollectionsCache();

    return NextResponse.json({
      ok: true,
      ref: saved,
      status: finalStatus,
      isAdmin,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to save skill ref",
      },
      { status: 500 },
    );
  }
}
