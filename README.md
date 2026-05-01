# Leie

Et kart-basert utleieprodukt for det norske leiemarkedet, med Bergen sentrum som første marked. Inspirert av Snap Map – men for å oppdage rom, hybler, leiligheter og hus.

> "Snap Map møter premium norsk leie­oppdagelse."

Alt UI er på norsk. Mørkt, illuminert design. Bygget med Expo, TypeScript, Expo Router, Supabase og en custom illuminated SVG-kart-renderer.

## Highlights

- **Illuminert demo-kart** for Bergen sentrum (custom SVG, glow, pulse, koblingslinjer) – fungerer i Expo Go uten Mapbox-token.
- **Mock-først** – appen kjører med 24 realistiske Bergen-annonser uten Supabase.
- **Service-lag** isolerer datakilder: `listingsService`, `favoritesService`, `authService` veksler automatisk mellom Supabase og lokal/mock.
- **Filter** for pris, type, soverom, møblering, og innflytting.
- **Favoritter** – Supabase når innlogget, AsyncStorage som fallback.
- **Admin/utleier-skjema** for å opprette annonser (Supabase eller lokal demo).
- **SQL-migrasjon med RLS** klar til kjøring (`supabase/migrations/0001_initial_schema.sql`).

## Komme i gang

```bash
npm install
npm run start
```

Skann QR-koden i Expo Go på telefonen, eller kjør `npm run ios` / `npm run android`.

Appen starter på kart-fanen sentrert på Bergen sentrum.

## Miljøvariabler

Kopier `.env.example` til `.env` (alle er valgfrie):

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_MAPBOX_TOKEN=
```

| Variabel                       | Hva skjer hvis den mangler                                                |
| ------------------------------ | ------------------------------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_*`       | Appen bruker mock-data + lokal AsyncStorage for favoritter og ny annonse. |
| `EXPO_PUBLIC_MAPBOX_TOKEN`     | Demo-kartet (custom SVG) brukes – ingen krasj.                            |

## Supabase-oppsett

Se [`supabase/README.md`](./supabase/README.md). Kjapp versjon:

1. Lag et Supabase-prosjekt.
2. Kjør `supabase/migrations/0001_initial_schema.sql` i SQL-editoren.
3. Sett `EXPO_PUBLIC_SUPABASE_URL` og `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Restart Expo med `--clear`.

Migrasjonen oppretter `profiles`, `listings`, `listing_images`, `favorites`, RLS-policies, en `set_updated_at`-trigger, og en `handle_new_user`-trigger som oppretter en `profiles`-rad ved registrering.

## Mapbox-oppsett (valgfritt for MVP)

MVP-en har en custom illuminated SVG-kart-komponent (`IlluminatedMap`) som er den **standard demo-opplevelsen**. Den fungerer i Expo Go uten konfigurasjon.

For å bytte til ekte Mapbox:

1. Installer `@rnmapbox/maps` (krever EAS dev client – ikke Expo Go).
2. Bytt ut innholdet av `<IlluminatedMap />` i `app/(tabs)/index.tsx` mot en `<MapboxGL.MapView />`.
3. Fyll inn `EXPO_PUBLIC_MAPBOX_TOKEN`.

Markørstil, fargene per type, og det glødende preget bør gjenskapes med Mapbox layer-styling for å beholde det visuelle uttrykket.

## Mappestruktur

```
app/                    Expo Router-skjermer
  _layout.tsx           Root – providers og stack
  (tabs)/               Bunn-tabs (Kart / Liste / Favoritter / Admin)
  listing/[id].tsx      Detaljside

src/
  components/           Gjenbrukbare UI-komponenter
  data/mockListings.ts  24 demo-annonser i Bergen sentrum
  hooks/                useListings, useFavorites, useFiltersContext, useAuth, format
  lib/                  config, supabase-klient, storage
  providers/            Auth + Favorites context
  services/             listingsService, favoritesService, authService, aiService (placeholders)
  theme/                colors, spacing, typography, shadows
  types/                Listing, Profile, Favorite, ListingFilters

supabase/
  migrations/           SQL-migrasjon
  README.md             Supabase setup
```

## Funksjonalitet i MVP

| Område            | Status                                                                  |
| ----------------- | ----------------------------------------------------------------------- |
| Kart              | Custom illuminated SVG-kart med glødende markører + pulse for valgt    |
| Liste             | Filterte kort med bilde, pris, type, område, soverom                    |
| Detaljside        | Bilde, pris, areal, soverom, møblering, beskrivelse, "Se annonse"-knapp |
| Filtre            | Maks pris, type, soverom (min), møblering, ledig fra. Nullstill.        |
| Favoritter        | Toggle på kort/markør/detalj. Lokalt eller Supabase.                     |
| Admin-skjema      | Skjema for ny annonse. Lagrer i Supabase eller lokalt.                  |
| Auth              | Supabase Auth (e-post). Hvis ikke konfigurert: gjest-modus.             |
| Tomme tilstander  | Egne meldinger på norsk for ingen treff, ingen favoritter, etc.        |
| Lasting/feil      | Spinner, feilmeldinger, fallback.                                       |

## Designsystem

Definert i `src/theme/`:

- **Bakgrunn**: `#04060B` / `#0A1220` / `#0E1A2E`
- **Aksent**: cyan `#5BE3F2`, teal `#2BC4D9`, soft blue `#7CA8FF`
- **Markørfarger** per type (room/studio/apartment/house) – synlige i Legend-komponenten
- **Skygger** og glødende effekter via `shadows.glow` og pulse-animasjon

## Kjente begrensninger / "vet om"

- Ingen ekte Mapbox-integrasjon – custom SVG i stedet (bevisst valg for MVP).
- Bilder i mock-annonser hentes fra Unsplash-URLer (placeholder).
- Auth-skjerm er ikke bygget i MVP – innlogging skjer programmatisk via `authService`. UI for innlogging er neste steg.
- AI-services er placeholders med TODO-kommentarer i `src/services/aiService.ts`.
- Ingen scraping. Annonser er enten landlord-genererte, partnerbaserte, eller mock.
- Ingen push, betaling, chat, eller multi-by – bevisst utenfor MVP-scope.

## Neste steg

1. Innloggings- / registrerings-UI (skjerm + e-post-flow).
2. Bytte ut `IlluminatedMap` med `@rnmapbox/maps` bak en EAS dev client.
3. Bilde-opplasting til Supabase Storage.
4. Audit-logg for status-endringer i admin-flyten.
5. Søk på adresse / område med autocomplete.
6. Utvide til Bergen utenfor sentrum, så Oslo og Trondheim. Strukturen i `mockListings.ts` og databasen støtter `city` allerede.
7. Aktivere placeholders i `aiService.ts` (parsing, ranking, duplikatdeteksjon) bak en server-side LLM-tjeneste.

## Test-sjekkliste

- [ ] Start uten `.env`. Appen åpner kartet med 24 Bergen-annonser. Ingen krasj.
- [ ] Trykk på en markør → bunn-ark vises med tittel, pris, område. Pulse rundt valgt markør.
- [ ] Bytt til **Liste**-fanen → samme annonser som kort.
- [ ] Trykk på et hjerteikon → fanen **Favoritter** viser annonsen. Force-quit appen og start igjen → favoritter beholdes.
- [ ] Åpne filterpanelet, sett maks pris til 10 000 → bare hybler/rom igjen. Nullstill.
- [ ] **Admin** → fyll inn skjema → annonsen vises på kartet (lagres lokalt uten Supabase).
- [ ] Sett `EXPO_PUBLIC_SUPABASE_*`, kjør migrasjonen, og verifiser at annonser persisterer i `listings`-tabellen.
- [ ] `npm run typecheck` → ingen feil.

## Feedback

`/help` i Claude Code, eller åpne en issue.
