import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  CURATED_SKILL_REFS,
  resolveRefHandle,
  resolveRefPlatform,
  resolveRefPostUrl,
  SKILL_COLLECTIONS,
  type CuratedSkillRef,
} from "../skill-collections";
import * as schema from "./schema";

type GlobalDbCache = {
  connStr?: string | null;
  pool?: Pool | null;
  db?: NodePgDatabase<typeof schema> | null;
  initPromise?: Promise<boolean> | null;
  initializedConnStr?: string | null;
};

const globalForDb = globalThis as unknown as {
  __aiDevkitDbCache?: GlobalDbCache;
};

function getCache(): GlobalDbCache {
  if (!globalForDb.__aiDevkitDbCache) {
    globalForDb.__aiDevkitDbCache = {};
  }
  return globalForDb.__aiDevkitDbCache;
}

export function getDbConnectionString(): string | null {
  const raw =
    process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_PUBLIC_URL?.trim() ||
    "";
  return raw.length > 0 ? raw : null;
}

export function getPool(): Pool | null {
  const connStr = getDbConnectionString();
  const cache = getCache();

  if (!connStr) {
    return null;
  }

  if (cache.pool && cache.connStr === connStr) {
    return cache.pool;
  }

  if (cache.pool && cache.connStr !== connStr) {
    cache.pool.end().catch(() => {});
    cache.pool = null;
    cache.db = null;
    cache.initPromise = null;
    cache.initializedConnStr = null;
  }

  const useSsl =
    connStr.includes("sslmode=require") ||
    connStr.includes("neon.tech") ||
    connStr.includes("supabase.co");

  const pool = new Pool({
    connectionString: connStr,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  pool.on("error", (err) => {
    console.warn("[db] Background Postgres pool error:", err.message);
  });

  cache.connStr = connStr;
  cache.pool = pool;
  cache.db = drizzle(pool, { schema });
  return pool;
}

export function getDb(): NodePgDatabase<typeof schema> | null {
  const pool = getPool();
  if (!pool) {
    return null;
  }
  const cache = getCache();
  if (!cache.db) {
    cache.db = drizzle(pool, { schema });
  }
  return cache.db;
}

export function mapStaticRefToInsertValues(
  ref: CuratedSkillRef,
  sortPriority: number
): schema.NewSkillRefRow {
  const platform = resolveRefPlatform(ref);
  const handle = resolveRefHandle(ref);
  const postUrl = resolveRefPostUrl(ref) ?? null;
  const profileUrl =
    ref.source?.profileUrl ||
    ref.creator.profileUrl ||
    ref.creator.xUrl ||
    (platform === "github"
      ? `https://github.com/${handle}`
      : `https://x.com/${handle}`);
  const githubRepo = ref.creator.githubRepo || "";
  const githubUrl =
    ref.creator.githubUrl ||
    (githubRepo ? `https://github.com/${githubRepo}` : profileUrl);
  const thumbnailUrl = ref.source?.thumbnailUrl ?? ref.thumbnailUrl ?? null;
  const videoUrl = ref.source?.videoUrl ?? ref.xVideoUrl ?? null;
  const avatarUrl = ref.source?.avatarUrl ?? ref.xAvatarUrl ?? null;
  const bannerUrl = ref.source?.bannerUrl ?? ref.xBannerUrl ?? null;

  return {
    id: ref.id,
    name: ref.name || ref.id,
    title: ref.title,
    tagline: ref.tagline ?? "",
    collectionId: ref.collectionId,
    additionalCollectionIds: Array.isArray(ref.additionalCollectionIds)
      ? ref.additionalCollectionIds
      : [],
    sourcePlatform: platform,
    postUrl,
    creatorName: ref.creator.name || handle,
    creatorHandle: handle,
    creatorProfileUrl: profileUrl,
    githubRepo,
    githubUrl,
    thumbnailUrl,
    videoUrl,
    avatarUrl,
    bannerUrl,
    installCommand: ref.installCommand ?? null,
    stylePrompt: ref.stylePrompt ?? null,
    pairsWithCmk: Array.isArray(ref.pairsWithCmk) ? ref.pairsWithCmk : [],
    starsOrInstalls: ref.starsOrInstalls ?? null,
    pinnedSha: ref.pinnedSha ?? null,
    vettedAt: ref.vettedAt || new Date().toISOString().slice(0, 10),
    featured: Boolean(ref.featured),
    isNew: Boolean(ref.isNew),
    status: "published",
    sortPriority,
  };
}

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS skill_collections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  badge TEXT NOT NULL DEFAULT 'Collection',
  accent_color TEXT,
  paired_cmk_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_refs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  collection_id TEXT NOT NULL,
  additional_collection_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_platform TEXT NOT NULL DEFAULT 'x',
  post_url TEXT,
  creator_name TEXT NOT NULL,
  creator_handle TEXT NOT NULL,
  creator_profile_url TEXT NOT NULL,
  github_repo TEXT NOT NULL,
  github_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  install_command TEXT,
  style_prompt TEXT,
  pairs_with_cmk JSONB NOT NULL DEFAULT '[]'::jsonb,
  stars_or_installs TEXT,
  pinned_sha TEXT,
  vetted_at TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published',
  sort_priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_collections_sort_order
  ON skill_collections (sort_order ASC, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_skill_refs_status_priority
  ON skill_refs (status, sort_priority DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_skill_refs_collection_id
  ON skill_refs (collection_id);
`;

export async function ensureCollectionsSchemaAndSeed(): Promise<boolean> {
  const connStr = getDbConnectionString();
  const pool = getPool();
  const db = getDb();
  if (!connStr || !pool || !db) {
    return false;
  }

  const cache = getCache();
  if (cache.initializedConnStr === connStr) {
    return true;
  }
  if (cache.initPromise) {
    return cache.initPromise;
  }

  const runInit = async (): Promise<boolean> => {
    try {
      await pool.query(CREATE_TABLES_SQL);

      const countRes = await pool.query<{
        collections_count: number;
        refs_count: number;
      }>(`
        SELECT
          (SELECT COUNT(*)::int FROM skill_collections) AS collections_count,
          (SELECT COUNT(*)::int FROM skill_refs) AS refs_count
      `);

      const row = countRes.rows[0] ?? { collections_count: 0, refs_count: 0 };

      if (Number(row.collections_count) === 0 && SKILL_COLLECTIONS.length > 0) {
        const collectionRows: schema.NewSkillCollectionRow[] =
          SKILL_COLLECTIONS.map((col, index) => ({
            id: col.id,
            title: col.title,
            subtitle: col.subtitle ?? "",
            description: col.description ?? "",
            badge: col.badge || "Collection",
            accentColor: null,
            pairedCmkIds: [],
            sortOrder: index,
          }));

        await db
          .insert(schema.skillCollectionsTable)
          .values(collectionRows)
          .onConflictDoNothing({ target: schema.skillCollectionsTable.id });
      }

      if (Number(row.refs_count) === 0 && CURATED_SKILL_REFS.length > 0) {
        const total = CURATED_SKILL_REFS.length;
        const refRows: schema.NewSkillRefRow[] = CURATED_SKILL_REFS.map(
          (ref, index) => mapStaticRefToInsertValues(ref, (total - index) * 10)
        );

        await db
          .insert(schema.skillRefsTable)
          .values(refRows)
          .onConflictDoNothing({ target: schema.skillRefsTable.id });
      }

      cache.initializedConnStr = connStr;
      return true;
    } catch (error) {
      cache.initializedConnStr = null;
      console.warn(
        "[db] ensureCollectionsSchemaAndSeed failed, falling back to memory store:",
        error instanceof Error ? error.message : String(error)
      );
      return false;
    } finally {
      cache.initPromise = null;
    }
  };

  cache.initPromise = runInit();
  return cache.initPromise;
}
