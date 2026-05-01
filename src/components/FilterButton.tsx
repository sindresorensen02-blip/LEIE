import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  count: number;
  onPress: () => void;
}

export const FilterButton = ({ count, onPress }: Props) => (
  <Pressable onPress={onPress} style={styles.btn}>
    <Ionicons name="options-outline" size={16} color={colors.text} />
    <Text style={styles.label}>Filtre</Text>
    {count > 0 ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  label: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    backgroundColor: colors.cyan,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.micro,
    color: colors.bg,
    fontWeight: '700',
  },
});
