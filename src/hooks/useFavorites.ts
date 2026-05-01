import { createContext, useContext } from 'react';

export interface FavoritesState {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  loading: boolean;
}

export const FavoritesContext = createContext<FavoritesState>({
  ids: [],
  isFavorite: () => false,
  toggle: async () => undefined,
  loading: false,
});

export const useFavorites = () => useContext(FavoritesContext);
