import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
}

export const AuthPrompt = ({ title, body, ctaLabel, onCta }: Props) => (
  <View style={styles.wrap}>
    <View style={styles.icon}>
      <Ionicons name="lock-closed-outline" size={22} color={colors.cyan} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
    <PrimaryButton label={ctaLabel} onPress={onCta} style={{ alignSelf: 'stretch' }} />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    alignItems: 'center',
    margin: spacing.lg,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
