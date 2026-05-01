import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../src/theme';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ikke funnet' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Siden finnes ikke</Text>
        <Link href="/" style={styles.link}>
          Tilbake til kart
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    padding: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },
  link: {
    ...typography.body,
    color: colors.cyan,
  },
});
