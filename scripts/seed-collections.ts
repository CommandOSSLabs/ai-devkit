import { seedAllStaticCollectionsToDb } from "../lib/collections-store";

async function main() {
  try {
    const result = await seedAllStaticCollectionsToDb();
    console.log(
      `[seed-collections] Seeded ${result.collectionsCount} collections and ${result.refsCount} skill refs.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("[seed-collections] Failed to seed collections:", error);
    process.exit(1);
  }
}

void main();
