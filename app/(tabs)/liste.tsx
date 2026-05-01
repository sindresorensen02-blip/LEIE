import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { FilterButton } from '../../src/components/FilterButton';
import { FilterSheet } from '../../src/components/FilterSheet';
import { ListingCard } from '../../src/components/ListingCard';
import { LoadingState } from '../../src/components/LoadingState';
import { EmptyState } from '../../src/components/EmptyState';
import { useListings } from '../../src/hooks/useListings';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useFiltersContext } from '../../src/hooks/useFiltersContext';
import { colors, spacing } from '../../src/theme';

export default function ListScreen() {
  const router = useRouter();
  const { filters, setFilters, reset, activeCount } = useFiltersContext();
  const { listings, loading } = useListings(filters);
  const { isFavorite, toggle } = useFavorites();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Alle boliger"
        subtitle={`${listings.length} treff i Bergen`}
        right={<FilterButton count={activeCount} onPress={() => setFiltersOpen(true)} />}
      />

      {loading ? (
        <LoadingState />
      ) : listings.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Ingen boliger funnet"
          subtitle="Prøv å justere filtrene dine."
        />
      ) : (
        <FlatList
          data={listings}
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

      <FilterSheet
        visible={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={(next) => {
          setFilters(next);
          setFiltersOpen(false);
        }}
        onReset={reset}
      />
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
