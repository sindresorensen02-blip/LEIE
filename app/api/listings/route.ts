import { NextResponse } from "next/server";
import { applyListingQuery } from "@/lib/filtering";
import { listListings } from "@/lib/db";
import { rankListings } from "@/lib/ranking";
import { listingSortSchema, propertyTypeSchema, rentalSourceSchema, type ListingFilters } from "@/lib/types";

function numberParam(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyType = searchParams.get("propertyType");
  const source = searchParams.get("source");
  const sort = searchParams.get("sort");

  const filters: ListingFilters = {
    maxPrice: numberParam(searchParams, "maxPrice"),
    propertyType: propertyType && propertyType !== "all" ? propertyTypeSchema.parse(propertyType) : "all",
    source: source && source !== "all" ? rentalSourceSchema.parse(source) : "all",
    minSize: numberParam(searchParams, "minSize"),
    minBedrooms: numberParam(searchParams, "minBedrooms"),
    includeShortTerm: searchParams.get("includeShortTerm") !== "false",
    onlyAvailableNow: searchParams.get("onlyAvailableNow") === "true",
    sort: sort ? listingSortSchema.parse(sort) : "cheapest",
    lat: numberParam(searchParams, "lat"),
    lng: numberParam(searchParams, "lng")
  };

  const listings = rankListings(applyListingQuery(listListings(), filters));
  return NextResponse.json({ listings, count: listings.length });
}
