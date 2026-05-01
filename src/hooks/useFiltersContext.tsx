import { createContext, ReactNode, useContext, useMemo } from 'react';
import { ListingFilters } from '../types';
import { useFilters } from './useFilters';

interface FiltersContextValue {
  filters: ListingFilters;
  setFilters: (f: ListingFilters) => void;
  update: (patch: Partial<ListingFilters>) => void;
  reset: () => void;
  activeCount: number;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const { filters, setFilters, update, reset, activeCount } = useFilters();
  const value = useMemo(
    () => ({ filters, setFilters, update, reset, activeCount }),
    [filters, setFilters, update, reset, activeCount],
  );
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFiltersContext = () => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFiltersContext must be used inside FiltersProvider');
  return ctx;
};
