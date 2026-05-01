import { useCallback, useState } from 'react';
import { emptyFilters, ListingFilters } from '../types';

export const useFilters = () => {
  const [filters, setFilters] = useState<ListingFilters>(emptyFilters);

  const reset = useCallback(() => setFilters(emptyFilters), []);
  const update = useCallback(
    (patch: Partial<ListingFilters>) => setFilters((prev) => ({ ...prev, ...patch })),
    [],
  );

  const activeCount =
    (filters.maxPrice != null ? 1 : 0) +
    (filters.propertyTypes.length > 0 ? 1 : 0) +
    (filters.bedrooms != null ? 1 : 0) +
    (filters.furnished != null ? 1 : 0) +
    (filters.availableFrom ? 1 : 0);

  return { filters, setFilters, reset, update, activeCount };
};
