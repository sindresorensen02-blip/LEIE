import { seedDatabase } from "../lib/db";

const result = seedDatabase();
console.log(`Seeded Leie listings: ${result.inserted} inserted, ${result.updated} updated`);
