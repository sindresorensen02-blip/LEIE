import Database from "better-sqlite3";
import path from "node:path";
import { mockListings } from "./mockListings";
import { normalizedListingSchema, type NormalizedListing } from "./types";

const dbPath = process.env.DATABASE_URL?.replace("file:", "") ?? "./leie.db";
const resolvedPath = path.resolve(process.cwd(), dbPath);

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(resolvedPath);
    db.pragma("journal_mode = WAL");
    migrate();
  }
  return db;
}

export function migrate() {
  const database = db ?? new Database(resolvedPath);
  database.exec(`
    create table if not exists listings (
      id text primary key,
      external_id text,
      source text not null,
      title text not null,
      listing_url text not null,
      price_monthly_nok integer,
      price_nightly_nok integer,
      estimated_monthly_nok integer,
      deposit_nok integer,
      property_type text not null,
      address text,
      area text,
      latitude real,
      longitude real,
      bedrooms integer,
      size_m2 integer,
      available_from text,
      images text not null,
      description text,
      scraped_at text not null,
      updated_at text not null
    );

    create table if not exists geocode_cache (
      query text primary key,
      latitude real not null,
      longitude real not null,
      provider text not null,
      updated_at text not null
    );
  `);
  if (!db) database.close();
}

function rowToListing(row: Record<string, unknown>): NormalizedListing {
  return normalizedListingSchema.parse({
    id: row.id,
    externalId: row.external_id ?? null,
    source: row.source,
    title: row.title,
    listingUrl: row.listing_url,
    priceMonthlyNok: row.price_monthly_nok ?? null,
    priceNightlyNok: row.price_nightly_nok ?? null,
    estimatedMonthlyNok: row.estimated_monthly_nok ?? null,
    depositNok: row.deposit_nok ?? null,
    propertyType: row.property_type,
    address: row.address ?? null,
    area: row.area ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    bedrooms: row.bedrooms ?? null,
    sizeM2: row.size_m2 ?? null,
    availableFrom: row.available_from ?? null,
    images: JSON.parse(String(row.images || "[]")),
    description: row.description ?? null,
    scrapedAt: row.scraped_at,
    updatedAt: row.updated_at
  });
}

export function listListings() {
  const rows = getDb().prepare("select * from listings").all() as Record<string, unknown>[];
  if (!rows.length) return mockListings;
  return rows.map(rowToListing);
}

export function upsertListings(listings: NormalizedListing[]) {
  const database = getDb();
  const existing = new Set(
    (database.prepare("select id from listings").all() as { id: string }[]).map((row) => row.id)
  );
  const statement = database.prepare(`
    insert into listings (
      id, external_id, source, title, listing_url, price_monthly_nok, price_nightly_nok,
      estimated_monthly_nok, deposit_nok, property_type, address, area, latitude, longitude,
      bedrooms, size_m2, available_from, images, description, scraped_at, updated_at
    ) values (
      @id, @externalId, @source, @title, @listingUrl, @priceMonthlyNok, @priceNightlyNok,
      @estimatedMonthlyNok, @depositNok, @propertyType, @address, @area, @latitude, @longitude,
      @bedrooms, @sizeM2, @availableFrom, @images, @description, @scrapedAt, @updatedAt
    )
    on conflict(id) do update set
      external_id=excluded.external_id,
      source=excluded.source,
      title=excluded.title,
      listing_url=excluded.listing_url,
      price_monthly_nok=excluded.price_monthly_nok,
      price_nightly_nok=excluded.price_nightly_nok,
      estimated_monthly_nok=excluded.estimated_monthly_nok,
      deposit_nok=excluded.deposit_nok,
      property_type=excluded.property_type,
      address=excluded.address,
      area=excluded.area,
      latitude=excluded.latitude,
      longitude=excluded.longitude,
      bedrooms=excluded.bedrooms,
      size_m2=excluded.size_m2,
      available_from=excluded.available_from,
      images=excluded.images,
      description=excluded.description,
      scraped_at=excluded.scraped_at,
      updated_at=excluded.updated_at
  `);

  const insertMany = database.transaction((items: NormalizedListing[]) => {
    for (const listing of items) {
      statement.run({
        ...listing,
        images: JSON.stringify(listing.images)
      });
    }
  });

  insertMany(listings);

  return {
    inserted: listings.filter((listing) => !existing.has(listing.id)).length,
    updated: listings.filter((listing) => existing.has(listing.id)).length
  };
}

export function seedDatabase() {
  migrate();
  return upsertListings(mockListings);
}
