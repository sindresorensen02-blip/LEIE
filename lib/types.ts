import { z } from "zod";

export type RentalSource =
  | "finn"
  | "airbnb"
  | "hybel"
  | "utleiemegleren"
  | "heimstaden"
  | "mock";

export type PropertyType =
  | "house"
  | "apartment"
  | "room"
  | "shared_room"
  | "studio"
  | "unknown";

export type NormalizedListing = {
  id: string;
  externalId: string | null;
  source: RentalSource;
  title: string;
  listingUrl: string;
  priceMonthlyNok: number | null;
  priceNightlyNok: number | null;
  estimatedMonthlyNok: number | null;
  depositNok: number | null;
  propertyType: PropertyType;
  address: string | null;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  sizeM2: number | null;
  availableFrom: string | null;
  images: string[];
  description: string | null;
  scrapedAt: string;
  updatedAt: string;
};

export type ListingBadge =
  | "Cheapest"
  | "Good value"
  | "Under market"
  | "Market price"
  | "Above market"
  | "Room"
  | "Short-term"
  | "Available now";

export type MarketSignal = "under_market" | "market_price" | "above_market" | "unknown";

export type RankedListing = NormalizedListing & {
  badges: ListingBadge[];
  marketPriceNok?: number | null;
  marketDeltaPercent?: number | null;
  marketSignal?: MarketSignal;
  distanceKm?: number | null;
};

export type ListingSort = "cheapest" | "newest" | "largest" | "closest";

export type ListingFilters = {
  maxPrice?: number | null;
  propertyType?: PropertyType | "all";
  source?: RentalSource | "all";
  minSize?: number | null;
  minBedrooms?: number | null;
  onlyAvailableNow?: boolean;
  includeShortTerm?: boolean;
  sort?: ListingSort;
  lat?: number | null;
  lng?: number | null;
};

export const rentalSourceSchema = z.enum([
  "finn",
  "airbnb",
  "hybel",
  "utleiemegleren",
  "heimstaden",
  "mock"
]);

export const propertyTypeSchema = z.enum([
  "house",
  "apartment",
  "room",
  "shared_room",
  "studio",
  "unknown"
]);

export const listingSortSchema = z.enum([
  "cheapest",
  "newest",
  "largest",
  "closest"
]);

export const normalizedListingSchema = z.object({
  id: z.string(),
  externalId: z.string().nullable(),
  source: rentalSourceSchema,
  title: z.string(),
  listingUrl: z.string(),
  priceMonthlyNok: z.number().nullable(),
  priceNightlyNok: z.number().nullable(),
  estimatedMonthlyNok: z.number().nullable(),
  depositNok: z.number().nullable(),
  propertyType: propertyTypeSchema,
  address: z.string().nullable(),
  area: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  bedrooms: z.number().nullable(),
  sizeM2: z.number().nullable(),
  availableFrom: z.string().nullable(),
  images: z.array(z.string()),
  description: z.string().nullable(),
  scrapedAt: z.string(),
  updatedAt: z.string()
});

export const propertyTypeLabels: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  room: "Room",
  shared_room: "Shared room",
  studio: "Studio",
  unknown: "Unknown"
};

export const sourceLabels: Record<RentalSource, string> = {
  finn: "FINN.no",
  airbnb: "Airbnb",
  hybel: "Hybel.no",
  utleiemegleren: "Utleiemegleren",
  heimstaden: "Heimstaden",
  mock: "Mock"
};
