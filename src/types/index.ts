export * from './listing';
export * from './profile';
export * from './favorite';

export interface ListingFilters {
  maxPrice: number | null;
  propertyTypes: import('./listing').PropertyType[];
  bedrooms: number | null;
  furnished: boolean | null;
  availableFrom: string | null;
}

export const emptyFilters: ListingFilters = {
  maxPrice: null,
  propertyTypes: [],
  bedrooms: null,
  furnished: null,
  availableFrom: null,
};
