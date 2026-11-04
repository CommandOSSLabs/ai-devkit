import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  deleteSkillRefById,
  updateSkillRefById,
  verifyAdminPasskey,
  type StoredSkillRef,
} from "@/lib/collections-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const id = (resolvedParams?.id ?? "").trim();
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Skill ref ID is required." },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      adminSecret?: string;
      patch?: Partial<StoredSkillRef>;
      ref?: Partial<StoredSkillRef>;
    } & Partial<StoredSkillRef>;

    const secret = extractAdminSecret(request, body.adminSecret);
    if (!verifyAdminPasskey(secret)) {
      return NextResponse.json(
        { ok: false, error: "Invalid or missing admin passkey." },
        { status: 401 },
      );
    }

    const rawPatch: Partial<StoredSkillRef> & {
      adminSecret?: string;
      patch?: unknown;
      ref?: unknown;
    } = {
      ...(body.patch ?? body.ref ?? body),
    };
    delete rawPatch.adminSecret;
    delete rawPatch.patch;
    delete rawPatch.ref;

    const updated = await updateSkillRefById(id, rawPatch);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: `Skill ref '${id}' not found.` },
        { status: 404 },
      );
    }

    revalidateCollectionsCache();

    return NextResponse.json({
      ok: true,
      ref: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update skill ref",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const id = (resolvedParams?.id ?? "").trim();
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Skill ref ID is required." },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      adminSecret?: string;
    };

    const secret = extractAdminSecret(request, body.adminSecret);
    if (!verifyAdminPasskey(secret)) {
      return NextResponse.json(
        { ok: false, error: "Invalid or missing admin passkey." },
        { status: 401 },
      );
    }

    await deleteSkillRefById(id);
    revalidateCollectionsCache();

    return NextResponse.json({
      ok: true,
      deleted: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete skill ref",
      },
      { status: 500 },
    );
  }
}
