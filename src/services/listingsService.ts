import { getSupabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/config';
import { readJSON, storageKeys, writeJSON } from '../lib/storage';
import { mockListings } from '../data/mockListings';
import { Listing, PropertyType } from '../types';

const rowToListing = (row: any): Listing => ({
  id: row.id,
  ownerId: row.owner_id ?? null,
  title: row.title,
  description: row.description ?? '',
  propertyType: row.property_type as PropertyType,
  priceMonthly: Number(row.price_monthly ?? 0),
  sizeM2: Number(row.size_m2 ?? 0),
  bedrooms: Number(row.bedrooms ?? 0),
  furnished: Boolean(row.furnished),
  addressText: row.address_text ?? '',
  area: row.area ?? '',
  city: row.city ?? 'Bergen',
  latitude: Number(row.latitude ?? 0),
  longitude: Number(row.longitude ?? 0),
  availableFrom: row.available_from ?? '',
  externalUrl: row.external_url ?? null,
  status: row.status,
  images: Array.isArray(row.images)
    ? row.images
    : Array.isArray(row.listing_images)
      ? row.listing_images
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((i: any) => i.url)
      : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const loadLocalListings = async (): Promise<Listing[]> =>
  readJSON<Listing[]>(storageKeys.localListings, []);

export const listingsService = {
  async list(): Promise<Listing[]> {
    const sb = getSupabase();
    if (!sb) {
      const local = await loadLocalListings();
      return [...local, ...mockListings];
    }

    const { data, error } = await sb
      .from('listings')
      .select('*, listing_images(url, sort_order)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !data) {
      const local = await loadLocalListings();
      return [...local, ...mockListings];
    }
    return data.map(rowToListing);
  },

  async get(id: string): Promise<Listing | null> {
    const sb = getSupabase();
    if (!sb) {
      const local = await loadLocalListings();
      return [...local, ...mockListings].find((l) => l.id === id) ?? null;
    }

    const { data, error } = await sb
      .from('listings')
      .select('*, listing_images(url, sort_order)')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return rowToListing(data);
  },

  async create(input: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    const sb = getSupabase();

    if (!sb || !isSupabaseConfigured) {
      const id = `local-${Date.now()}`;
      const now = new Date().toISOString();
      const listing: Listing = { ...input, id, createdAt: now, updatedAt: now };
      const local = await loadLocalListings();
      await writeJSON(storageKeys.localListings, [listing, ...local]);
      return listing;
    }

    const { data: insertedListing, error } = await sb
      .from('listings')
      .insert({
        owner_id: input.ownerId,
        title: input.title,
        description: input.description,
        property_type: input.propertyType,
        price_monthly: input.priceMonthly,
        size_m2: input.sizeM2,
        bedrooms: input.bedrooms,
        furnished: input.furnished,
        address_text: input.addressText,
        area: input.area,
        city: input.city,
        latitude: input.latitude,
        longitude: input.longitude,
        available_from: input.availableFrom,
        external_url: input.externalUrl,
        status: input.status,
      })
      .select()
      .single();

    if (error || !insertedListing) {
      throw new Error(error?.message ?? 'Kunne ikke opprette annonse');
    }

    if (input.images.length > 0) {
      await sb.from('listing_images').insert(
        input.images.map((url, idx) => ({
          listing_id: insertedListing.id,
          url,
          sort_order: idx,
        })),
      );
    }

    return rowToListing({ ...insertedListing, listing_images: input.images.map((url, sort_order) => ({ url, sort_order })) });
  },
};
