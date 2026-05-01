import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { Listing, propertyTypeLabel } from '../types';
import { formatBedrooms, formatPrice, formatSize } from '../hooks/format';

interface Props {
  listing: Listing;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ListingCard = ({ listing, onPress, isFavorite, onToggleFavorite }: Props) => {
  const [first] = listing.images;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      <View style={styles.imageWrap}>
        {first ? (
          <Image source={{ uri: first }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="home-outline" size={28} color={colors.textDim} />
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{propertyTypeLabel[listing.propertyType]}</Text>
        </View>
        {onToggleFavorite ? (
          <Pressable onPress={onToggleFavorite} hitSlop={10} style={styles.favBtn}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? colors.cyan : colors.text}
            />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.area} numberOfLines={1}>
          {listing.area} · {listing.city}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>{formatPrice(listing.priceMonthly)}</Text>
          <View style={styles.dot} />
          <Text style={styles.meta}>{formatSize(listing.sizeM2)}</Text>
          <View style={styles.dot} />
          <Text style={styles.meta}>{formatBedrooms(listing.bedrooms)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 168,
    backgroundColor: colors.bgElevated,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.scrim,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  typeBadgeText: {
    ...typography.micro,
    color: colors.cyan,
    textTransform: 'uppercase',
  },
  favBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.scrim,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  body: {
    padding: spacing.lg,
    gap: 4,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  area: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.cyan,
  },
  meta: {
    ...typography.small,
    color: colors.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.borderStrong,
  },
});
