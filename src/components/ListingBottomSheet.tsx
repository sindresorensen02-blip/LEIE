import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { Listing, propertyTypeLabel } from '../types';
import { formatBedrooms, formatPrice, formatSize } from '../hooks/format';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  listing: Listing;
  onClose: () => void;
  onOpenDetail: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ListingBottomSheet = ({
  listing,
  onClose,
  onOpenDetail,
  isFavorite,
  onToggleFavorite,
}: Props) => {
  const [first] = listing.images;

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />

      <View style={styles.row}>
        {first ? (
          <Image source={{ uri: first }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Ionicons name="home-outline" size={22} color={colors.textDim} />
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {listing.title}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            {listing.area} · {propertyTypeLabel[listing.propertyType]}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.price}>{formatPrice(listing.priceMonthly)}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaSmall}>{formatSize(listing.sizeM2)}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaSmall}>{formatBedrooms(listing.bedrooms)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onToggleFavorite}
          style={[styles.iconBtn, isFavorite && styles.iconBtnActive]}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? colors.cyan : colors.text}
          />
        </Pressable>
        <PrimaryButton label="Se annonse" onPress={onOpenDetail} style={{ flex: 1 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.borderStrong,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  thumb: {
    width: 78,
    height: 78,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    flex: 1,
  },
  meta: {
    ...typography.small,
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.cyan,
  },
  metaSmall: {
    ...typography.small,
    color: colors.textMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.borderStrong,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
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
