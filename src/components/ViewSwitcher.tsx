import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

export type MapListMode = 'map' | 'list';

interface Props {
  value: MapListMode;
  onChange: (v: MapListMode) => void;
}

export const ViewSwitcher = ({ value, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <SwitchOption
        label="Kart"
        icon="map-outline"
        active={value === 'map'}
        onPress={() => onChange('map')}
      />
      <SwitchOption
        label="Liste"
        icon="list-outline"
        active={value === 'list'}
        onPress={() => onChange('list')}
      />
    </View>
  );
};

const SwitchOption = ({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={[styles.option, active && styles.optionActive]}>
    <Ionicons name={icon} size={16} color={active ? colors.bg : colors.textMuted} />
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  optionActive: {
    backgroundColor: colors.cyan,
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.bg,
  },
});
