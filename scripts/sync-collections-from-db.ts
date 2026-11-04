import fs from "node:fs/promises";
import path from "node:path";
import { listCollectionsAndRefs } from "../lib/collections-store";

async function main() {
  try {
    let payload = await listCollectionsAndRefs({ includePending: true });

    if (
      payload.source === "memory-fallback" &&
      process.env.COLLECTIONS_API_URL !== "local"
    ) {
      const remoteBase = (
        process.env.COLLECTIONS_API_URL || "https://skills.commandoss.com"
      ).replace(/\/$/, "");
      try {
        const res = await fetch(
          `${remoteBase}/api/collections?includePending=1`,
          {
            headers: {
              "x-admin-secret":
                process.env.COLLECTIONS_ADMIN_SECRET || "cmk-admin-2026",
            },
          },
        );
        if (res.ok) {
          const remoteJson = await res.json();
          if (
            remoteJson?.ok &&
            Array.isArray(remoteJson.collections) &&
            Array.isArray(remoteJson.refs)
          ) {
            payload = {
              collections: remoteJson.collections,
              refs: remoteJson.refs,
              pendingRefs: Array.isArray(remoteJson.pendingRefs)
                ? remoteJson.pendingRefs
                : [],
              source: remoteJson.source || "postgres",
            };
          }
        }
      } catch {
        // Keep local payload if remote endpoint is not yet deployed or offline
      }
    }

    const snapshotPath = path.resolve(
      process.cwd(),
      "docs/guides/collections-db-snapshot.json",
    );

    await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
    await fs.writeFile(
      snapshotPath,
      `${JSON.stringify(
        {
          syncedAt: new Date().toISOString(),
          source: payload.source,
          counts: {
            collections: payload.collections.length,
            publishedRefs: payload.refs.length,
            pendingRefs: payload.pendingRefs.length,
          },
          collections: payload.collections,
          refs: payload.refs,
          pendingRefs: payload.pendingRefs,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    console.log(
      `[sync-collections-from-db] Wrote ${payload.collections.length} collections and ${payload.refs.length} published refs (${payload.pendingRefs.length} pending) from ${payload.source} to ${snapshotPath}`,
    );
    process.exit(0);
  } catch (error) {
    console.error(
      "[sync-collections-from-db] Failed to export DB snapshot:",
      error,
    );
    process.exit(1);
  }
}

void main();
