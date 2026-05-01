import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { Chip } from '../../src/components/Chip';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { GlassCard } from '../../src/components/GlassCard';
import { useAuth } from '../../src/hooks/useAuth';
import { listingsService } from '../../src/services/listingsService';
import { isSupabaseConfigured } from '../../src/lib/config';
import {
  Listing,
  ListingStatus,
  PropertyType,
  propertyTypePlural,
} from '../../src/types';
import { bergenSentrum } from '../../src/data/mockListings';
import { colors, radius, spacing, typography } from '../../src/theme';

const TYPES: PropertyType[] = ['room', 'studio', 'apartment', 'house'];
const STATUSES: ListingStatus[] = ['draft', 'active', 'rented', 'archived'];

export default function AdminScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Sentrum');
  const [city] = useState('Bergen');
  const [latitude, setLatitude] = useState(String(bergenSentrum.latitude));
  const [longitude, setLongitude] = useState(String(bergenSentrum.longitude));
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [furnished, setFurnished] = useState(false);
  const [status, setStatus] = useState<ListingStatus>('active');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim() || !size.trim() || !address.trim()) {
      Alert.alert('Mangler felter', 'Tittel, pris, størrelse og adresse er påkrevd.');
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      Alert.alert('Ugyldig posisjon', 'Latitude og longitude må være tall.');
      return;
    }

    const input: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'> = {
      ownerId: session?.userId ?? null,
      title: title.trim(),
      description: description.trim(),
      propertyType,
      priceMonthly: Number(price) || 0,
      sizeM2: Number(size) || 0,
      bedrooms: Number(bedrooms) || 0,
      furnished,
      addressText: address.trim(),
      area: area.trim() || 'Sentrum',
      city,
      latitude: lat,
      longitude: lng,
      availableFrom: availableFrom.trim(),
      externalUrl: externalUrl.trim() || null,
      status,
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
    };

    try {
      setSubmitting(true);
      const created = await listingsService.create(input);
      Alert.alert(
        'Annonse opprettet',
        isSupabaseConfigured ? 'Lagret i Supabase.' : 'Lagret lokalt (Supabase mangler).',
        [{ text: 'Se annonse', onPress: () => router.push(`/listing/${created.id}`) }],
      );
      setTitle('');
      setPrice('');
      setSize('');
      setAddress('');
      setImageUrl('');
      setDescription('');
      setExternalUrl('');
      setAvailableFrom('');
    } catch (e: any) {
      Alert.alert('Feil', e?.message ?? 'Kunne ikke opprette annonse');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="Ny annonse"
        subtitle={isSupabaseConfigured ? 'Lagres i Supabase' : 'Lagres lokalt (demo-modus)'}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Field label="Tittel">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="f.eks. Lys 2-roms ved Bryggen"
              placeholderTextColor={colors.textDim}
              style={styles.input}
            />
          </Field>

          <Field label="Type">
            <View style={styles.chipRow}>
              {TYPES.map((t) => (
                <Chip
                  key={t}
                  label={propertyTypePlural[t]}
                  selected={propertyType === t}
                  onPress={() => setPropertyType(t)}
                />
              ))}
            </View>
          </Field>

          <View style={styles.row}>
            <Field label="Pris/mnd (NOK)" style={{ flex: 1 }}>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="18000"
                placeholderTextColor={colors.textDim}
                style={styles.input}
                keyboardType="number-pad"
              />
            </Field>
            <Field label="Størrelse (m²)" style={{ flex: 1 }}>
              <TextInput
                value={size}
                onChangeText={setSize}
                placeholder="54"
                placeholderTextColor={colors.textDim}
                style={styles.input}
                keyboardType="number-pad"
              />
            </Field>
          </View>

          <Field label="Soverom">
            <TextInput
              value={bedrooms}
              onChangeText={setBedrooms}
              placeholder="1"
              placeholderTextColor={colors.textDim}
              style={styles.input}
              keyboardType="number-pad"
            />
          </Field>

          <Field label="Adresse">
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Bryggen 12"
              placeholderTextColor={colors.textDim}
              style={styles.input}
            />
          </Field>

          <View style={styles.row}>
            <Field label="Område" style={{ flex: 1 }}>
              <TextInput
                value={area}
                onChangeText={setArea}
                placeholder="Bryggen"
                placeholderTextColor={colors.textDim}
                style={styles.input}
              />
            </Field>
            <Field label="By" style={{ flex: 1 }}>
              <TextInput value={city} editable={false} style={[styles.input, { opacity: 0.6 }]} />
            </Field>
          </View>

          <View style={styles.row}>
            <Field label="Latitude" style={{ flex: 1 }}>
              <TextInput
                value={latitude}
                onChangeText={setLatitude}
                style={styles.input}
                keyboardType="numbers-and-punctuation"
              />
            </Field>
            <Field label="Longitude" style={{ flex: 1 }}>
              <TextInput
                value={longitude}
                onChangeText={setLongitude}
                style={styles.input}
                keyboardType="numbers-and-punctuation"
              />
            </Field>
          </View>

          <Field label="Bilde-URL">
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://…"
              placeholderTextColor={colors.textDim}
              style={styles.input}
              autoCapitalize="none"
            />
          </Field>

          <Field label="Beskrivelse">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Skriv en kort beskrivelse…"
              placeholderTextColor={colors.textDim}
              style={[styles.input, styles.textarea]}
              multiline
              numberOfLines={4}
            />
          </Field>

          <Field label="Ekstern lenke">
            <TextInput
              value={externalUrl}
              onChangeText={setExternalUrl}
              placeholder="https://…"
              placeholderTextColor={colors.textDim}
              style={styles.input}
              autoCapitalize="none"
            />
          </Field>

          <Field label="Ledig fra (ÅÅÅÅ-MM-DD)">
            <TextInput
              value={availableFrom}
              onChangeText={setAvailableFrom}
              placeholder="2026-08-01"
              placeholderTextColor={colors.textDim}
              style={styles.input}
              autoCapitalize="none"
            />
          </Field>

          <Field label="Møblering">
            <View style={styles.chipRow}>
              <Chip
                label="Møblert"
                selected={furnished}
                onPress={() => setFurnished(true)}
              />
              <Chip
                label="Umøblert"
                selected={!furnished}
                onPress={() => setFurnished(false)}
              />
            </View>
          </Field>

          <Field label="Status">
            <View style={styles.chipRow}>
              {STATUSES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={status === s}
                  onPress={() => setStatus(s)}
                />
              ))}
            </View>
          </Field>

          <GlassCard padded>
            <Text style={styles.note}>
              {isSupabaseConfigured
                ? 'Annonser lagres i Supabase. Bare innloggede utleiere/admins kan opprette.'
                : 'Supabase mangler. Annonsen lagres lokalt i demo-modus.'}
            </Text>
          </GlassCard>

          <PrimaryButton
            label={submitting ? 'Lagrer…' : 'Opprett annonse'}
            onPress={handleSubmit}
            loading={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Field = ({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: any;
}) => (
  <View style={[{ gap: spacing.xs + 2 }, style]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldLabel: {
    ...typography.small,
    color: colors.textMuted,
    fontWeight: '600',
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
  textarea: {
    height: 100,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  note: {
    ...typography.small,
    color: colors.textMuted,
  },
});
