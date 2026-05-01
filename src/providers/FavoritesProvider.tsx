import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { favoritesService } from '../services/favoritesService';
import { useAuth } from '../hooks/useAuth';
import { FavoritesContext } from '../hooks/useFavorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.userId ?? null;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    favoritesService
      .list(userId)
      .then((res) => {
        if (mounted) setIds(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [userId]);

  const toggle = useCallback(
    async (listingId: string) => {
      const { ids: next } = await favoritesService.toggle(listingId, userId);
      setIds(next);
    },
    [userId],
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({ ids, isFavorite, toggle, loading }),
    [ids, isFavorite, toggle, loading],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
