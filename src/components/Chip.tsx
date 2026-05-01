import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const Chip = ({ label, selected, onPress, style }: Props) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.chip,
      selected && styles.selected,
      pressed && { opacity: 0.8 },
      style,
    ]}
  >
    <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(91, 227, 242, 0.12)',
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.cyan,
    fontWeight: '600',
  },
});
