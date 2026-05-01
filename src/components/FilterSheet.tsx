import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { ListingFilters, PropertyType, propertyTypePlural } from '../types';
import { Chip } from './Chip';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  visible: boolean;
  filters: ListingFilters;
  onClose: () => void;
  onApply: (next: ListingFilters) => void;
  onReset: () => void;
}

const TYPES: PropertyType[] = ['room', 'studio', 'apartment', 'house'];
const BEDROOMS = [0, 1, 2, 3];

export const FilterSheet = ({ visible, filters, onClose, onApply, onReset }: Props) => {
  const [draft, setDraft] = useState<ListingFilters>(filters);
  const [priceText, setPriceText] = useState<string>(
    filters.maxPrice != null ? String(filters.maxPrice) : '',
  );

  const toggleType = (t: PropertyType) => {
    setDraft((d) => ({
      ...d,
      propertyTypes: d.propertyTypes.includes(t)
        ? d.propertyTypes.filter((x) => x !== t)
        : [...d.propertyTypes, t],
    }));
  };

  const setBedrooms = (n: number | null) => setDraft((d) => ({ ...d, bedrooms: n }));
  const setFurnished = (v: boolean | null) => setDraft((d) => ({ ...d, furnished: v }));

  const handleApply = () => {
    const trimmed = priceText.replace(/\s/g, '');
    const parsed = trimmed ? Number(trimmed) : NaN;
    onApply({
      ...draft,
      maxPrice: Number.isFinite(parsed) && parsed > 0 ? parsed : null,
    });
  };

  const handleReset = () => {
    onReset();
    setDraft({
      maxPrice: null,
      propertyTypes: [],
      bedrooms: null,
      furnished: null,
      availableFrom: null,
    });
    setPriceText('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtre</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Section title="Maks pris per måned">
              <TextInput
                value={priceText}
                onChangeText={setPriceText}
                keyboardType="number-pad"
                placeholder="f.eks. 18 000"
                placeholderTextColor={colors.textDim}
                style={styles.input}
              />
            </Section>

            <Section title="Type bolig">
              <View style={styles.chipRow}>
                {TYPES.map((t) => (
                  <Chip
                    key={t}
                    label={propertyTypePlural[t]}
                    selected={draft.propertyTypes.includes(t)}
                    onPress={() => toggleType(t)}
                  />
                ))}
              </View>
            </Section>

            <Section title="Soverom (minimum)">
              <View style={styles.chipRow}>
                <Chip
                  label="Alle"
                  selected={draft.bedrooms == null}
                  onPress={() => setBedrooms(null)}
                />
                {BEDROOMS.map((n) => (
                  <Chip
                    key={n}
                    label={n === 0 ? 'Studio' : `${n}+`}
                    selected={draft.bedrooms === n}
                    onPress={() => setBedrooms(n)}
                  />
                ))}
              </View>
            </Section>

            <Section title="Møblering">
              <View style={styles.chipRow}>
                <Chip
                  label="Alle"
                  selected={draft.furnished == null}
                  onPress={() => setFurnished(null)}
                />
                <Chip
                  label="Møblert"
                  selected={draft.furnished === true}
                  onPress={() => setFurnished(true)}
                />
                <Chip
                  label="Umøblert"
                  selected={draft.furnished === false}
                  onPress={() => setFurnished(false)}
                />
              </View>
            </Section>

            <Section title="Ledig fra (ÅÅÅÅ-MM-DD)">
              <TextInput
                value={draft.availableFrom ?? ''}
                onChangeText={(v) => setDraft((d) => ({ ...d, availableFrom: v || null }))}
                placeholder="f.eks. 2026-08-01"
                placeholderTextColor={colors.textDim}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Section>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Nullstill filtre</Text>
            </Pressable>
            <PrimaryButton label="Bruk" onPress={handleApply} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.scrim,
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text,
    ...typography.body,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resetBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  resetText: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
});
