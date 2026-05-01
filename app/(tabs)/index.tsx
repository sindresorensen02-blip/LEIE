import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { FilterButton } from '../../src/components/FilterButton';
import { FilterSheet } from '../../src/components/FilterSheet';
import { IlluminatedMap } from '../../src/components/IlluminatedMap';
import { ListingBottomSheet } from '../../src/components/ListingBottomSheet';
import { Legend } from '../../src/components/Legend';
import { LoadingState } from '../../src/components/LoadingState';
import { EmptyState } from '../../src/components/EmptyState';
import { useListings } from '../../src/hooks/useListings';
import { useFiltersContext } from '../../src/hooks/useFiltersContext';
import { useFavorites } from '../../src/hooks/useFavorites';
import { isMapboxConfigured } from '../../src/lib/config';
import { colors, spacing } from '../../src/theme';

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { filters, reset, activeCount, setFilters } = useFiltersContext();
  const { listings, loading } = useListings(filters);
  const { isFavorite, toggle } = useFavorites();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selected = listings.find((l) => l.id === selectedId) ?? null;

  const mapHeight = height - 230;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Bergen sentrum"
        subtitle={`${listings.length} boliger på kartet`}
        right={<FilterButton count={activeCount} onPress={() => setFiltersOpen(true)} />}
      />

      <View style={styles.mapWrap}>
        {loading ? (
          <LoadingState />
        ) : listings.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="Ingen boliger funnet"
            subtitle="Prøv å justere filtrene dine."
          />
        ) : (
          <IlluminatedMap
            width={width}
            height={mapHeight}
            listings={listings}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isMapboxConfigured={isMapboxConfigured}
          />
        )}

        <View style={styles.legendWrap} pointerEvents="none">
          <Legend />
        </View>

        {selected ? (
          <ListingBottomSheet
            listing={selected}
            onClose={() => setSelectedId(null)}
            onOpenDetail={() => router.push(`/listing/${selected.id}`)}
            isFavorite={isFavorite(selected.id)}
            onToggleFavorite={() => toggle(selected.id)}
          />
        ) : null}
      </View>

      <FilterSheet
        visible={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={(next) => {
          setFilters(next);
          setFiltersOpen(false);
        }}
        onReset={() => {
          reset();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  mapWrap: {
    flex: 1,
    position: 'relative',
  },
  legendWrap: {
    position: 'absolute',
    bottom: spacing.lg + 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
