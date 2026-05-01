import { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { listingsService } from '../../src/services/listingsService';
import { Listing, propertyTypeLabel } from '../../src/types';
import { LoadingState } from '../../src/components/LoadingState';
import { EmptyState } from '../../src/components/EmptyState';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { GlassCard } from '../../src/components/GlassCard';
import { useFavorites } from '../../src/hooks/useFavorites';
import { formatBedrooms, formatDateNo, formatPrice, formatSize } from '../../src/hooks/format';
import { colors, radius, spacing, typography } from '../../src/theme';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isFavorite, toggle } = useFavorites();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    listingsService
      .get(id)
      .then((res) => {
        if (mounted) setListing(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackBar onBack={() => router.back()} />
        <LoadingState label="Laster bolig…" />
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <BackBar onBack={() => router.back()} />
        <EmptyState
          icon="alert-circle-outline"
          title="Annonsen finnes ikke"
          subtitle="Den kan ha blitt fjernet."
        />
      </SafeAreaView>
    );
  }

  const fav = isFavorite(listing.id);
  const heroImg = listing.images[0];

  const handleContact = () => {
    if (listing.externalUrl) {
      Linking.openURL(listing.externalUrl).catch(() => undefined);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroWrap, { width, height: width * 0.75 }]}>
          {heroImg ? (
            <Image source={{ uri: heroImg }} style={styles.hero} />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]}>
              <Ionicons name="home-outline" size={48} color={colors.textDim} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          <BackBar onBack={() => router.back()} floating />
          <Pressable
            onPress={() => toggle(listing.id)}
            style={[styles.favFloat, fav && styles.favFloatActive]}
            hitSlop={10}
          >
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={20}
              color={fav ? colors.cyan : colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {propertyTypeLabel[listing.propertyType]}
            </Text>
          </View>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>
            {listing.addressText} · {listing.area} · {listing.city}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(listing.priceMonthly)}</Text>
          </View>

          <GlassCard style={{ flexDirection: 'row' }}>
            <Stat icon="resize-outline" label="Størrelse" value={formatSize(listing.sizeM2)} />
            <Divider />
            <Stat icon="bed-outline" label="Soverom" value={formatBedrooms(listing.bedrooms)} />
            <Divider />
            <Stat
              icon="checkmark-done-outline"
              label="Møblering"
              value={listing.furnished ? 'Møblert' : 'Umøblert'}
            />
          </GlassCard>

          {listing.availableFrom ? (
            <View style={styles.metaCard}>
              <Ionicons name="calendar-outline" size={18} color={colors.cyan} />
              <Text style={styles.metaCardText}>
                Ledig fra <Text style={styles.metaCardStrong}>{formatDateNo(listing.availableFrom)}</Text>
              </Text>
            </View>
          ) : null}

          {listing.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Beskrivelse</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posisjon</Text>
            <Text style={styles.description}>
              {listing.latitude.toFixed(4)}, {listing.longitude.toFixed(4)}
            </Text>
          </View>

          <View style={{ height: spacing.xxl }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={() => toggle(listing.id)}
          style={[styles.iconBtn, fav && styles.iconBtnActive]}
        >
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={20}
            color={fav ? colors.cyan : colors.text}
          />
        </Pressable>
        <PrimaryButton
          label={listing.externalUrl ? 'Se annonse' : 'Kontakt utleier'}
          onPress={handleContact}
          style={{ flex: 1 }}
          disabled={!listing.externalUrl}
        />
      </View>
    </SafeAreaView>
  );
}

const Stat = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.stat}>
    <Ionicons name={icon} size={16} color={colors.cyan} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const BackBar = ({ onBack, floating }: { onBack: () => void; floating?: boolean }) => (
  <View style={[styles.backBar, floating && styles.backBarFloating]}>
    <Pressable onPress={onBack} style={styles.backBtn} hitSlop={10}>
      <Ionicons name="chevron-back" size={20} color={colors.text} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 100,
  },
  heroWrap: {
    position: 'relative',
    backgroundColor: colors.bgElevated,
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 6, 11, 0.25)',
  },
  backBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backBarFloating: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.scrim,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favFloat: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.scrim,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favFloatActive: {
    borderColor: colors.cyan,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(91, 227, 242, 0.12)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBadgeText: {
    ...typography.micro,
    color: colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  location: {
    ...typography.body,
    color: colors.textMuted,
  },
  priceRow: {
    marginVertical: spacing.sm,
  },
  price: {
    ...typography.display,
    color: colors.cyan,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    ...typography.micro,
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  metaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaCardText: {
    ...typography.body,
    color: colors.textMuted,
  },
  metaCardStrong: {
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(91, 227, 242, 0.1)',
  },
});
