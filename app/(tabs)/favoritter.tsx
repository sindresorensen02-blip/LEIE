import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ListingCard } from '../../src/components/ListingCard';
import { EmptyState } from '../../src/components/EmptyState';
import { LoadingState } from '../../src/components/LoadingState';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useListings } from '../../src/hooks/useListings';
import { emptyFilters } from '../../src/types';
import { colors, spacing } from '../../src/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const { ids, isFavorite, toggle, loading: favLoading } = useFavorites();
  const { allListings, loading: listingsLoading } = useListings(emptyFilters);

  const favorites = useMemo(
    () => allListings.filter((l) => ids.includes(l.id)),
    [allListings, ids],
  );

  const loading = favLoading || listingsLoading;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Favoritter"
        subtitle={favorites.length > 0 ? `${favorites.length} lagrede boliger` : 'Lagre boliger fra kartet eller listen'}
      />

      {loading ? (
        <LoadingState label="Laster favoritter…" />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Du har ingen favoritter ennå."
          subtitle="Trykk på hjertet på en bolig for å lagre den her."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(it) => it.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => router.push(`/listing/${item.id}`)}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggle(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
});
