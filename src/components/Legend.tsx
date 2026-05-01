import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { propertyTypePlural, PropertyType } from '../types';

const ITEMS: { type: PropertyType; color: string }[] = [
  { type: 'room', color: colors.markerRoom },
  { type: 'studio', color: colors.markerStudio },
  { type: 'apartment', color: colors.markerApartment },
  { type: 'house', color: colors.markerHouse },
];

export const Legend = () => (
  <View style={styles.wrap}>
    {ITEMS.map((it) => (
      <View key={it.type} style={styles.item}>
        <View style={[styles.dot, { backgroundColor: it.color, shadowColor: it.color }]} />
        <Text style={styles.label}>{propertyTypePlural[it.type]}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.scrim,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  label: {
    ...typography.micro,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
