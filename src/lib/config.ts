const trim = (v: string | undefined) => (v ?? '').trim();

export const env = {
  supabaseUrl: trim(process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: trim(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  mapboxToken: trim(process.env.EXPO_PUBLIC_MAPBOX_TOKEN),
};

export const isSupabaseConfigured =
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;

export const isMapboxConfigured = env.mapboxToken.length > 0;
