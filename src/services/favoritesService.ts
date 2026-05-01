import { getSupabase } from '../lib/supabase';
import { readJSON, storageKeys, writeJSON } from '../lib/storage';

export const favoritesService = {
  async list(userId: string | null): Promise<string[]> {
    const sb = getSupabase();
    if (!sb || !userId) {
      return readJSON<string[]>(storageKeys.favorites, []);
    }
    const { data, error } = await sb
      .from('favorites')
      .select('listing_id')
      .eq('user_id', userId);
    if (error || !data) {
      return readJSON<string[]>(storageKeys.favorites, []);
    }
    return data.map((row) => row.listing_id as string);
  },

  async add(listingId: string, userId: string | null): Promise<string[]> {
    const current = await this.list(userId);
    if (current.includes(listingId)) return current;
    const next = [listingId, ...current];

    const sb = getSupabase();
    if (sb && userId) {
      await sb.from('favorites').insert({ user_id: userId, listing_id: listingId });
    } else {
      await writeJSON(storageKeys.favorites, next);
    }
    return next;
  },

  async remove(listingId: string, userId: string | null): Promise<string[]> {
    const current = await this.list(userId);
    const next = current.filter((id) => id !== listingId);

    const sb = getSupabase();
    if (sb && userId) {
      await sb
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', listingId);
    } else {
      await writeJSON(storageKeys.favorites, next);
    }
    return next;
  },

  async toggle(listingId: string, userId: string | null): Promise<{ ids: string[]; isFavorite: boolean }> {
    const current = await this.list(userId);
    const isFav = current.includes(listingId);
    const ids = isFav
      ? await this.remove(listingId, userId)
      : await this.add(listingId, userId);
    return { ids, isFavorite: !isFav };
  },
};
