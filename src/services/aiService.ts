import { Listing, PropertyType } from '../types';

/**
 * AI placeholders - not implemented in MVP.
 * Service seams for future LLM/embedding integration.
 */
export const aiService = {
  // TODO: parse free-text rental description into structured Listing fields
  async parseRentalText(_text: string): Promise<Partial<Listing>> {
    return {};
  },

  // TODO: classify property_type from images + text
  async classifyPropertyType(_listing: Partial<Listing>): Promise<PropertyType | null> {
    return null;
  },

  // TODO: fraud / quality flagging
  async flagSuspicious(_listing: Listing): Promise<{ flagged: boolean; reason?: string }> {
    return { flagged: false };
  },

  // TODO: smart search via embeddings
  async semanticSearch(_query: string, _listings: Listing[]): Promise<Listing[]> {
    return [];
  },

  // TODO: rank listings by user preferences
  async rankForUser(_userId: string, listings: Listing[]): Promise<Listing[]> {
    return listings;
  },

  // TODO: detect duplicate listings
  async findDuplicates(_listing: Listing, _all: Listing[]): Promise<string[]> {
    return [];
  },
};
