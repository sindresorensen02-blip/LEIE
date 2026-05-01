import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface Props {
  label?: string;
}

export const LoadingState = ({ label = 'Laster boliger…' }: Props) => (
  <View style={styles.wrapper}>
    <ActivityIndicator color={colors.cyan} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
  },
});
