import { useCallback, useEffect, useMemo, useState } from 'react';
import { listingsService } from '../services/listingsService';
import { Listing, ListingFilters } from '../types';

const matchesFilters = (listing: Listing, filters: ListingFilters): boolean => {
  if (filters.maxPrice != null && listing.priceMonthly > filters.maxPrice) return false;
  if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(listing.propertyType))
    return false;
  if (filters.bedrooms != null && listing.bedrooms < filters.bedrooms) return false;
  if (filters.furnished != null && listing.furnished !== filters.furnished) return false;
  if (filters.availableFrom) {
    if (new Date(listing.availableFrom).getTime() > new Date(filters.availableFrom).getTime())
      return false;
  }
  return true;
};

export const useListings = (filters: ListingFilters) => {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listingsService.list();
      setAllListings(data);
    } catch (e: any) {
      setError(e?.message ?? 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => allListings.filter((l) => matchesFilters(l, filters)),
    [allListings, filters],
  );

  return { listings: filtered, allListings, loading, error, reload: load };
};
