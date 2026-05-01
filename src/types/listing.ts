export type PropertyType = 'room' | 'studio' | 'apartment' | 'house';
export type ListingStatus = 'draft' | 'active' | 'rented' | 'archived';

export interface Listing {
  id: string;
  ownerId: string | null;
  title: string;
  description: string;
  propertyType: PropertyType;
  priceMonthly: number;
  sizeM2: number;
  bedrooms: number;
  furnished: boolean;
  addressText: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  availableFrom: string;
  externalUrl: string | null;
  status: ListingStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const propertyTypeLabel: Record<PropertyType, string> = {
  room: 'Rom',
  studio: 'Hybel',
  apartment: 'Leilighet',
  house: 'Hus',
};

export const propertyTypePlural: Record<PropertyType, string> = {
  room: 'Rom',
  studio: 'Hybler',
  apartment: 'Leiligheter',
  house: 'Hus',
};
