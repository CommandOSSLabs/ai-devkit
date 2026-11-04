import { asc, desc, eq } from "drizzle-orm";
import {
  ensureCollectionsSchemaAndSeed,
  getDb,
  mapStaticRefToInsertValues,
} from "./db";
import {
  skillCollectionsTable,
  skillRefsTable,
  type NewSkillCollectionRow,
  type NewSkillRefRow,
  type SkillCollectionRow,
  type SkillRefRow,
} from "./db/schema";
import {
  CURATED_SKILL_REFS,
  detectSocialPlatform,
  SKILL_COLLECTIONS,
  type CuratedSkillRef,
  type SkillCollection,
  type SocialPlatform,
} from "./skill-collections";

export type RefRecordStatus = "published" | "pending_review" | "archived";

export type StoredSkillRef = CuratedSkillRef & {
  status?: RefRecordStatus;
  sortPriority?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CollectionsPayload = {
  collections: SkillCollection[];
  refs: StoredSkillRef[];
  pendingRefs: StoredSkillRef[];
  source: "postgres" | "memory-fallback";
};

export type UpsertSkillRefInput = Partial<StoredSkillRef> & {
  id?: string;
  title: string;
  collectionId: string;
};

export type UpsertSkillCollectionInput = Partial<SkillCollection> & {
  id: string;
  title: string;
  accentColor?: string;
  pairedCmkIds?: string[];
  sortOrder?: number;
};

type MemoryCollectionRecord = SkillCollection & {
  accentColor?: string;
  pairedCmkIds?: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type MemoryStoreState = {
  collections: Map<string, MemoryCollectionRecord>;
  refs: Map<string, StoredSkillRef>;
};

const globalForMemoryStore = globalThis as unknown as {
  __aiDevkitCollectionsMemoryStore?: MemoryStoreState;
};

function getMemoryStore(): MemoryStoreState {
  if (!globalForMemoryStore.__aiDevkitCollectionsMemoryStore) {
    const nowIso = new Date().toISOString();
    const collections = new Map<string, MemoryCollectionRecord>();
    SKILL_COLLECTIONS.forEach((col, index) => {
      collections.set(col.id, {
        ...col,
        sortOrder: index,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    });

    const refs = new Map<string, StoredSkillRef>();
    const total = CURATED_SKILL_REFS.length;
    CURATED_SKILL_REFS.forEach((ref, index) => {
      refs.set(ref.id, {
        ...ref,
        status: "published",
        sortPriority: (total - index) * 10,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    });

    globalForMemoryStore.__aiDevkitCollectionsMemoryStore = {
      collections,
      refs,
    };
  }
  return globalForMemoryStore.__aiDevkitCollectionsMemoryStore;
}

export function slugifyId(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || `skill-${Date.now()}`;
}

function normalizePlatform(raw?: string | null): SocialPlatform {
  switch (raw) {
    case "x":
    case "threads":
    case "instagram":
    case "facebook":
    case "youtube":
    case "github":
    case "web":
      return raw;
    default:
      return "x";
  }
}

export function verifyAdminPasskey(secret?: string | null): boolean {
  if (!secret || typeof secret !== "string") {
    return false;
  }
  const expected = (
    process.env.COLLECTIONS_ADMIN_SECRET || "cmk-admin-2026"
  ).trim();
  return secret.trim().length > 0 && secret.trim() === expected;
}

export function dbRowToSkillCollection(
  row: SkillCollectionRow
): SkillCollection {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    badge: row.badge || "Collection",
  };
}

export function dbRowToStoredRef(row: SkillRefRow): StoredSkillRef {
  const platform = normalizePlatform(row.sourcePlatform);
  const handle = (row.creatorHandle || row.creatorName || "community")
    .replace(/^@/, "")
    .trim();
  const profileUrl =
    row.creatorProfileUrl ||
    (platform === "github"
      ? `https://github.com/${handle}`
      : `https://x.com/${handle}`);
  const postUrl = row.postUrl || undefined;
  const thumbnailUrl = row.thumbnailUrl || undefined;
  const videoUrl = row.videoUrl || undefined;
  const avatarUrl = row.avatarUrl || undefined;
  const bannerUrl = row.bannerUrl || undefined;
  const githubRepo = row.githubRepo || "";
  const githubUrl =
    row.githubUrl ||
    (githubRepo ? `https://github.com/${githubRepo}` : profileUrl);
  const status: RefRecordStatus =
    row.status === "pending_review" || row.status === "archived"
      ? row.status
      : "published";

  return {
    id: row.id,
    name: row.name || row.id,
    title: row.title,
    tagline: row.tagline ?? "",
    collectionId: row.collectionId,
    additionalCollectionIds: Array.isArray(row.additionalCollectionIds)
      ? row.additionalCollectionIds
      : [],
    creator: {
      name: row.creatorName || handle,
      xHandle: handle,
      xUrl: profileUrl,
      ...(postUrl ? { xPostUrl: postUrl, postUrl } : {}),
      platform,
      handle,
      profileUrl,
      githubRepo,
      githubUrl,
    },
    source: {
      platform,
      ...(postUrl ? { postUrl } : {}),
      profileUrl,
      handle,
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      ...(videoUrl ? { videoUrl } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
      ...(bannerUrl ? { bannerUrl } : {}),
    },
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    ...(videoUrl ? { xVideoUrl: videoUrl } : {}),
    ...(avatarUrl ? { xAvatarUrl: avatarUrl } : {}),
    ...(bannerUrl ? { xBannerUrl: bannerUrl } : {}),
    ...(row.installCommand ? { installCommand: row.installCommand } : {}),
    ...(row.stylePrompt ? { stylePrompt: row.stylePrompt } : {}),
    ...(row.pinnedSha ? { pinnedSha: row.pinnedSha } : {}),
    vettedAt: row.vettedAt || new Date().toISOString().slice(0, 10),
    ...(row.starsOrInstalls ? { starsOrInstalls: row.starsOrInstalls } : {}),
    pairsWithCmk: Array.isArray(row.pairsWithCmk) ? row.pairsWithCmk : [],
    featured: Boolean(row.featured),
    isNew: Boolean(row.isNew),
    status,
    sortPriority: typeof row.sortPriority === "number" ? row.sortPriority : 0,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt ?? ""),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : String(row.updatedAt ?? ""),
  };
}

function normalizeInputToStoredRef(
  input: UpsertSkillRefInput,
  options?: { status?: RefRecordStatus; existing?: StoredSkillRef }
): StoredSkillRef {
  const existing = options?.existing;
  const rawId =
    input.id?.trim() ||
    existing?.id ||
    input.name?.trim() ||
    input.title?.trim() ||
    `skill-${Date.now()}`;
  const id = existing?.id ? existing.id : slugifyId(rawId);
  const name = (input.name ?? existing?.name ?? id).trim() || id;
  const title = (input.title ?? existing?.title ?? name).trim();
  const tagline = (input.tagline ?? existing?.tagline ?? "").trim();
  const collectionId =
    (input.collectionId ?? existing?.collectionId ?? "design").trim() ||
    "design";

  const rawAdditional =
    input.additionalCollectionIds ?? existing?.additionalCollectionIds ?? [];
  const additionalCollectionIds = Array.from(
    new Set(
      rawAdditional
        .map((cid) => cid.trim())
        .filter((cid) => Boolean(cid) && cid !== collectionId)
    )
  );

  const postUrl =
    input.source?.postUrl ??
    input.creator?.postUrl ??
    input.creator?.xPostUrl ??
    existing?.source?.postUrl ??
    existing?.creator?.postUrl ??
    existing?.creator?.xPostUrl ??
    undefined;

  const explicitPlatform =
    input.source?.platform ??
    input.creator?.platform ??
    existing?.source?.platform ??
    existing?.creator?.platform;

  const platform: SocialPlatform = explicitPlatform
    ? normalizePlatform(explicitPlatform)
    : detectSocialPlatform(
        postUrl ||
          input.source?.profileUrl ||
          input.creator?.profileUrl ||
          input.creator?.xUrl ||
          input.creator?.githubUrl
      );

  const handle =
    (
      input.source?.handle ??
      input.creator?.handle ??
      input.creator?.xHandle ??
      existing?.source?.handle ??
      existing?.creator?.handle ??
      existing?.creator?.xHandle ??
      input.creator?.name ??
      existing?.creator?.name ??
      "community"
    )
      .replace(/^@/, "")
      .trim() || "community";

  const creatorName =
    (input.creator?.name ?? existing?.creator?.name ?? handle).trim() || handle;

  const profileUrl =
    (
      input.source?.profileUrl ??
      input.creator?.profileUrl ??
      input.creator?.xUrl ??
      existing?.source?.profileUrl ??
      existing?.creator?.profileUrl ??
      existing?.creator?.xUrl ??
      (platform === "github"
        ? `https://github.com/${handle}`
        : `https://x.com/${handle}`)
    ).trim() || `https://x.com/${handle}`;

  const githubRepo = (
    input.creator?.githubRepo ??
    existing?.creator?.githubRepo ??
    ""
  ).trim();

  const githubUrl = (
    input.creator?.githubUrl ??
    existing?.creator?.githubUrl ??
    (githubRepo ? `https://github.com/${githubRepo}` : profileUrl)
  ).trim();

  // Prefer explicit top-level or source override from input before falling back to existing
  const thumbnailUrl =
    (input.thumbnailUrl !== undefined
      ? input.thumbnailUrl
      : input.source?.thumbnailUrl !== undefined
        ? input.source.thumbnailUrl
        : existing?.thumbnailUrl ?? existing?.source?.thumbnailUrl) ||
    undefined;

  const videoUrl =
    (input.xVideoUrl !== undefined
      ? input.xVideoUrl
      : input.source?.videoUrl !== undefined
        ? input.source.videoUrl
        : existing?.xVideoUrl ?? existing?.source?.videoUrl) || undefined;

  const avatarUrl =
    (input.xAvatarUrl !== undefined
      ? input.xAvatarUrl
      : input.source?.avatarUrl !== undefined
        ? input.source.avatarUrl
        : existing?.xAvatarUrl ?? existing?.source?.avatarUrl) || undefined;

  const bannerUrl =
    (input.xBannerUrl !== undefined
      ? input.xBannerUrl
      : input.source?.bannerUrl !== undefined
        ? input.source.bannerUrl
        : existing?.xBannerUrl ?? existing?.source?.bannerUrl) || undefined;

  const installCommand =
    (input.installCommand !== undefined
      ? input.installCommand
      : existing?.installCommand) || undefined;

  const stylePrompt =
    (input.stylePrompt !== undefined
      ? input.stylePrompt
      : existing?.stylePrompt) || undefined;

  const pinnedSha =
    (input.pinnedSha !== undefined ? input.pinnedSha : existing?.pinnedSha) ||
    undefined;

  const starsOrInstalls =
    (input.starsOrInstalls !== undefined
      ? input.starsOrInstalls
      : existing?.starsOrInstalls) || undefined;

  const pairsWithCmk = Array.isArray(input.pairsWithCmk)
    ? Array.from(new Set(input.pairsWithCmk.map((s) => s.trim()).filter(Boolean)))
    : existing?.pairsWithCmk ?? ["design", "workflow"];

  const status: RefRecordStatus =
    options?.status ?? input.status ?? existing?.status ?? "published";

  const sortPriority =
    typeof input.sortPriority === "number"
      ? input.sortPriority
      : typeof existing?.sortPriority === "number"
        ? existing.sortPriority
        : status === "published"
          ? 1000
          : 100;

  const vettedAt =
    input.vettedAt ||
    existing?.vettedAt ||
    new Date().toISOString().slice(0, 10);

  const featured =
    input.featured !== undefined
      ? Boolean(input.featured)
      : existing?.featured !== undefined
        ? Boolean(existing.featured)
        : status === "published";

  const isNew =
    input.isNew !== undefined
      ? Boolean(input.isNew)
      : existing?.isNew !== undefined
        ? Boolean(existing.isNew)
        : true;

  const nowIso = new Date().toISOString();

  return {
    id,
    name,
    title,
    tagline,
    collectionId,
    additionalCollectionIds,
    creator: {
      name: creatorName,
      xHandle: handle,
      xUrl: profileUrl,
      ...(postUrl ? { xPostUrl: postUrl, postUrl } : {}),
      platform,
      handle,
      profileUrl,
      githubRepo,
      githubUrl,
    },
    source: {
      platform,
      ...(postUrl ? { postUrl } : {}),
      profileUrl,
      handle,
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      ...(videoUrl ? { videoUrl } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
      ...(bannerUrl ? { bannerUrl } : {}),
    },
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    ...(videoUrl ? { xVideoUrl: videoUrl } : {}),
    ...(avatarUrl ? { xAvatarUrl: avatarUrl } : {}),
    ...(bannerUrl ? { xBannerUrl: bannerUrl } : {}),
    ...(installCommand ? { installCommand } : {}),
    ...(stylePrompt ? { stylePrompt } : {}),
    ...(pinnedSha ? { pinnedSha } : {}),
    vettedAt,
    ...(starsOrInstalls ? { starsOrInstalls } : {}),
    pairsWithCmk,
    featured,
    isNew,
    status,
    sortPriority,
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
  };
}

function storedRefToDbValues(ref: StoredSkillRef): NewSkillRefRow {
  const base = mapStaticRefToInsertValues(ref, ref.sortPriority ?? 1000);
  return {
    ...base,
    status: ref.status ?? "published",
    sortPriority: typeof ref.sortPriority === "number" ? ref.sortPriority : 1000,
  };
}

function listFromMemory(options?: {
  includePending?: boolean;
}): CollectionsPayload {
  const includePending = options?.includePending ?? true;
  const mem = getMemoryStore();

  const collections = Array.from(mem.collections.values())
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.createdAt.localeCompare(b.createdAt);
    })
    .map(({ id, title, subtitle, description, badge }) => ({
      id,
      title,
      subtitle,
      description,
      badge,
    }));

  const allRefs = Array.from(mem.refs.values()).sort((a, b) => {
    const prioDiff = (b.sortPriority ?? 0) - (a.sortPriority ?? 0);
    if (prioDiff !== 0) return prioDiff;
    return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
  });

  const refs = allRefs.filter(
    (r) => !r.status || r.status === "published"
  );
  const pendingRefs = includePending
    ? allRefs.filter((r) => r.status === "pending_review")
    : [];

  return {
    collections,
    refs,
    pendingRefs,
    source: "memory-fallback",
  };
}

export async function listCollectionsAndRefs(options?: {
  includePending?: boolean;
}): Promise<CollectionsPayload> {
  const includePending = options?.includePending ?? true;
  const dbReady = await ensureCollectionsSchemaAndSeed();
  const db = getDb();

  if (!dbReady || !db) {
    return listFromMemory(options);
  }

  try {
    const [collectionRows, refRows] = await Promise.all([
      db
        .select()
        .from(skillCollectionsTable)
        .orderBy(
          asc(skillCollectionsTable.sortOrder),
          asc(skillCollectionsTable.createdAt)
        ),
      db
        .select()
        .from(skillRefsTable)
        .orderBy(
          desc(skillRefsTable.sortPriority),
          desc(skillRefsTable.createdAt)
        ),
    ]);

    const collections =
      collectionRows.length > 0
        ? collectionRows.map(dbRowToSkillCollection)
        : SKILL_COLLECTIONS;

    const mappedRefs = refRows.map(dbRowToStoredRef);
    const refs = mappedRefs.filter(
      (r) => !r.status || r.status === "published"
    );
    const pendingRefs = includePending
      ? mappedRefs.filter((r) => r.status === "pending_review")
      : [];

    return {
      collections,
      refs,
      pendingRefs,
      source: "postgres",
    };
  } catch (error) {
    console.warn(
      "[collections-store] Postgres query failed, using memory fallback:",
      error instanceof Error ? error.message : String(error)
    );
    return listFromMemory(options);
  }
}

export async function upsertSkillRef(
  input: UpsertSkillRefInput,
  options?: { status?: RefRecordStatus }
): Promise<StoredSkillRef> {
  const mem = getMemoryStore();
  const candidateId = slugifyId(
    input.id || input.name || input.title || `skill-${Date.now()}`
  );
  const existingMem = mem.refs.get(candidateId);
  const normalized = normalizeInputToStoredRef(
    { ...input, id: candidateId },
    { status: options?.status, existing: existingMem }
  );

  mem.refs.set(normalized.id, normalized);

  const dbReady = await ensureCollectionsSchemaAndSeed();
  const db = getDb();
  if (!dbReady || !db) {
    return normalized;
  }

  try {
    const values = storedRefToDbValues(normalized);
    const [savedRow] = await db
      .insert(skillRefsTable)
      .values(values)
      .onConflictDoUpdate({
        target: skillRefsTable.id,
        set: {
          name: values.name,
          title: values.title,
          tagline: values.tagline,
          collectionId: values.collectionId,
          additionalCollectionIds: values.additionalCollectionIds,
          sourcePlatform: values.sourcePlatform,
          postUrl: values.postUrl,
          creatorName: values.creatorName,
          creatorHandle: values.creatorHandle,
          creatorProfileUrl: values.creatorProfileUrl,
          githubRepo: values.githubRepo,
          githubUrl: values.githubUrl,
          thumbnailUrl: values.thumbnailUrl,
          videoUrl: values.videoUrl,
          avatarUrl: values.avatarUrl,
          bannerUrl: values.bannerUrl,
          installCommand: values.installCommand,
          stylePrompt: values.stylePrompt,
          pairsWithCmk: values.pairsWithCmk,
          starsOrInstalls: values.starsOrInstalls,
          pinnedSha: values.pinnedSha,
          vettedAt: values.vettedAt,
          featured: values.featured,
          isNew: values.isNew,
          status: values.status,
          sortPriority: values.sortPriority,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (savedRow) {
      const fromDb = dbRowToStoredRef(savedRow);
      mem.refs.set(fromDb.id, fromDb);
      return fromDb;
    }
    return normalized;
  } catch (error) {
    console.warn(
      "[collections-store] Postgres upsertSkillRef failed, stored in memory fallback:",
      error instanceof Error ? error.message : String(error)
    );
    return normalized;
  }
}

export async function updateSkillRefById(
  id: string,
  patch: Partial<StoredSkillRef>
): Promise<StoredSkillRef | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;

  const mem = getMemoryStore();
  let existing: StoredSkillRef | undefined = mem.refs.get(cleanId);

  const dbReady = await ensureCollectionsSchemaAndSeed();
  const db = getDb();

  if (dbReady && db) {
    try {
      const [row] = await db
        .select()
        .from(skillRefsTable)
        .where(eq(skillRefsTable.id, cleanId))
        .limit(1);
      if (row) {
        existing = dbRowToStoredRef(row);
      }
    } catch (error) {
      console.warn(
        "[collections-store] Failed to fetch existing ref from Postgres:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (!existing) {
    return null;
  }

  const merged = normalizeInputToStoredRef(
    {
      ...existing,
      ...patch,
      id: existing.id,
      title: patch.title ?? existing.title,
      collectionId: patch.collectionId ?? existing.collectionId,
      creator: {
        ...existing.creator,
        ...(patch.creator ?? {}),
      },
      source: {
        ...(existing.source ?? {}),
        ...(patch.source ?? {}),
      },
    },
    {
      status: patch.status ?? existing.status,
      existing,
    }
  );

  mem.refs.set(merged.id, merged);

  if (!dbReady || !db) {
    return merged;
  }

  try {
    const values = storedRefToDbValues(merged);
    const [updatedRow] = await db
      .update(skillRefsTable)
      .set({
        name: values.name,
        title: values.title,
        tagline: values.tagline,
        collectionId: values.collectionId,
        additionalCollectionIds: values.additionalCollectionIds,
        sourcePlatform: values.sourcePlatform,
        postUrl: values.postUrl,
        creatorName: values.creatorName,
        creatorHandle: values.creatorHandle,
        creatorProfileUrl: values.creatorProfileUrl,
        githubRepo: values.githubRepo,
        githubUrl: values.githubUrl,
        thumbnailUrl: values.thumbnailUrl,
        videoUrl: values.videoUrl,
        avatarUrl: values.avatarUrl,
        bannerUrl: values.bannerUrl,
        installCommand: values.installCommand,
        stylePrompt: values.stylePrompt,
        pairsWithCmk: values.pairsWithCmk,
        starsOrInstalls: values.starsOrInstalls,
        pinnedSha: values.pinnedSha,
        vettedAt: values.vettedAt,
        featured: values.featured,
        isNew: values.isNew,
        status: values.status,
        sortPriority: values.sortPriority,
        updatedAt: new Date(),
      })
      .where(eq(skillRefsTable.id, cleanId))
      .returning();

    if (updatedRow) {
      const result = dbRowToStoredRef(updatedRow);
      mem.refs.set(result.id, result);
      return result;
    }
    return merged;
  } catch (error) {
    console.warn(
      "[collections-store] Postgres updateSkillRefById failed, updated memory fallback:",
      error instanceof Error ? error.message : String(error)
    );
    return merged;
  }
}

export async function deleteSkillRefById(id: string): Promise<boolean> {
  const cleanId = id.trim();
  if (!cleanId) return false;

  const mem = getMemoryStore();
  const existedInMem = mem.refs.delete(cleanId);

  const dbReady = await ensureCollectionsSchemaAndSeed();
  const db = getDb();
  if (!dbReady || !db) {
    return existedInMem;
  }

  try {
    const deleted = await db
      .delete(skillRefsTable)
      .where(eq(skillRefsTable.id, cleanId))
      .returning({ id: skillRefsTable.id });
    return deleted.length > 0 || existedInMem;
  } catch (error) {
    console.warn(
      "[collections-store] Postgres deleteSkillRefById failed:",
      error instanceof Error ? error.message : String(error)
    );
    return existedInMem;
  }
}

export const deleteSkillRef = deleteSkillRefById;

export async function upsertSkillCollection(
  input: UpsertSkillCollectionInput
): Promise<SkillCollection> {
  const mem = getMemoryStore();
  const id = slugifyId(input.id || input.title);
  const existing = mem.collections.get(id);
  const nowIso = new Date().toISOString();

  const sortOrder =
    typeof input.sortOrder === "number"
      ? input.sortOrder
      : existing?.sortOrder ?? mem.collections.size;

  const record: MemoryCollectionRecord = {
    id,
    title: input.title.trim(),
    subtitle: (input.subtitle ?? existing?.subtitle ?? "").trim(),
    description: (input.description ?? existing?.description ?? "").trim(),
    badge: (input.badge ?? existing?.badge ?? "Collection").trim() || "Collection",
    accentColor: input.accentColor ?? existing?.accentColor,
    pairedCmkIds: input.pairedCmkIds ?? existing?.pairedCmkIds ?? [],
    sortOrder,
    createdAt: existing?.createdAt ?? nowIso,
    updatedAt: nowIso,
  };

  mem.collections.set(id, record);

  const collectionResult: SkillCollection = {
    id: record.id,
    title: record.title,
    subtitle: record.subtitle,
    description: record.description,
    badge: record.badge,
  };

  const dbReady = await ensureCollectionsSchemaAndSeed();
  const db = getDb();
  if (!dbReady || !db) {
    return collectionResult;
  }

  try {
    const values: NewSkillCollectionRow = {
      id: record.id,
      title: record.title,
      subtitle: record.subtitle,
      description: record.description,
      badge: record.badge,
      accentColor: record.accentColor ?? null,
      pairedCmkIds: record.pairedCmkIds ?? [],
      sortOrder: record.sortOrder,
    };

    const [savedRow] = await db
      .insert(skillCollectionsTable)
      .values(values)
      .onConflictDoUpdate({
        target: skillCollectionsTable.id,
        set: {
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          badge: values.badge,
          accentColor: values.accentColor,
          pairedCmkIds: values.pairedCmkIds,
          sortOrder: values.sortOrder,
          updatedAt: new Date(),
        },
      })
      .returning();

    return savedRow ? dbRowToSkillCollection(savedRow) : collectionResult;
  } catch (error) {
    console.warn(
      "[collections-store] Postgres upsertSkillCollection failed, stored in memory fallback:",
      error instanceof Error ? error.message : String(error)
    );
    return collectionResult;
  }
}

export async function seedAllStaticCollectionsToDb(): Promise<{
  collectionsCount: number;
  refsCount: number;
}> {
  const mem = getMemoryStore();
  const nowIso = new Date().toISOString();

  SKILL_COLLECTIONS.forEach((col, index) => {
    mem.collections.set(col.id, {
      ...col,
      sortOrder: index,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  });

  const totalRefs = CURATED_SKILL_REFS.length;
  CURATED_SKILL_REFS.forEach((ref, index) => {
    mem.refs.set(ref.id, {
      ...ref,
      status: "published",
      sortPriority: (totalRefs - index) * 10,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  });

  const dbReady = await ensureCollectionsSchemaAndSeed();
  const db = getDb();
  if (!dbReady || !db) {
    return {
      collectionsCount: SKILL_COLLECTIONS.length,
      refsCount: CURATED_SKILL_REFS.length,
    };
  }

  for (let i = 0; i < SKILL_COLLECTIONS.length; i++) {
    const col = SKILL_COLLECTIONS[i];
    const values: NewSkillCollectionRow = {
      id: col.id,
      title: col.title,
      subtitle: col.subtitle ?? "",
      description: col.description ?? "",
      badge: col.badge || "Collection",
      accentColor: null,
      pairedCmkIds: [],
      sortOrder: i,
    };

    await db
      .insert(skillCollectionsTable)
      .values(values)
      .onConflictDoUpdate({
        target: skillCollectionsTable.id,
        set: {
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          badge: values.badge,
          sortOrder: values.sortOrder,
          updatedAt: new Date(),
        },
      });
  }

  for (let i = 0; i < CURATED_SKILL_REFS.length; i++) {
    const ref = CURATED_SKILL_REFS[i];
    const priority = (totalRefs - i) * 10;
    const values = mapStaticRefToInsertValues(ref, priority);

    await db
      .insert(skillRefsTable)
      .values(values)
      .onConflictDoUpdate({
        target: skillRefsTable.id,
        set: {
          name: values.name,
          title: values.title,
          tagline: values.tagline,
          collectionId: values.collectionId,
          additionalCollectionIds: values.additionalCollectionIds,
          sourcePlatform: values.sourcePlatform,
          postUrl: values.postUrl,
          creatorName: values.creatorName,
          creatorHandle: values.creatorHandle,
          creatorProfileUrl: values.creatorProfileUrl,
          githubRepo: values.githubRepo,
          githubUrl: values.githubUrl,
          thumbnailUrl: values.thumbnailUrl,
          videoUrl: values.videoUrl,
          avatarUrl: values.avatarUrl,
          bannerUrl: values.bannerUrl,
          installCommand: values.installCommand,
          stylePrompt: values.stylePrompt,
          pairsWithCmk: values.pairsWithCmk,
          starsOrInstalls: values.starsOrInstalls,
          pinnedSha: values.pinnedSha,
          vettedAt: values.vettedAt,
          featured: values.featured,
          isNew: values.isNew,
          status: values.status,
          sortPriority: values.sortPriority,
          updatedAt: new Date(),
        },
      });
  }

  return {
    collectionsCount: SKILL_COLLECTIONS.length,
    refsCount: CURATED_SKILL_REFS.length,
  };
}
