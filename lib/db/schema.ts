import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const skillCollectionsTable = pgTable("skill_collections", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  description: text("description").notNull().default(""),
  badge: text("badge").notNull().default("Collection"),
  accentColor: text("accent_color"),
  pairedCmkIds: jsonb("paired_cmk_ids").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const skillRefsTable = pgTable("skill_refs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  collectionId: text("collection_id").notNull(),
  additionalCollectionIds: jsonb("additional_collection_ids")
    .$type<string[]>()
    .notNull()
    .default([]),
  sourcePlatform: text("source_platform").notNull().default("x"),
  postUrl: text("post_url"),
  creatorName: text("creator_name").notNull(),
  creatorHandle: text("creator_handle").notNull(),
  creatorProfileUrl: text("creator_profile_url").notNull(),
  githubRepo: text("github_repo").notNull(),
  githubUrl: text("github_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  installCommand: text("install_command"),
  stylePrompt: text("style_prompt"),
  pairsWithCmk: jsonb("pairs_with_cmk").$type<string[]>().notNull().default([]),
  starsOrInstalls: text("stars_or_installs"),
  pinnedSha: text("pinned_sha"),
  vettedAt: text("vetted_at").notNull(),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  status: text("status").notNull().default("published"),
  sortPriority: integer("sort_priority").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SkillCollectionRow = typeof skillCollectionsTable.$inferSelect;
export type NewSkillCollectionRow = typeof skillCollectionsTable.$inferInsert;
export type SkillRefRow = typeof skillRefsTable.$inferSelect;
export type NewSkillRefRow = typeof skillRefsTable.$inferInsert;
