# Supabase oppsett

Denne mappa inneholder SQL-migrasjoner for Leie-databasen.

## Komme i gang

1. Opprett et nytt Supabase-prosjekt på https://supabase.com.
2. Åpne **SQL Editor**.
3. Kjør innholdet i `migrations/0001_initial_schema.sql`.
4. Hent prosjekt-URL og `anon` API-nøkkel fra **Project Settings → API**.
5. Sett dem som env-variabler i appens rot:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://<prosjekt>.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```

6. Start appen på nytt med `npm run start --clear`.

## Tabellstruktur

| Tabell           | Beskrivelse                                                |
| ---------------- | ---------------------------------------------------------- |
| `profiles`       | Bruker-/utleier-/admin-profiler (1:1 mot `auth.users`)     |
| `listings`       | Boliger til leie                                           |
| `listing_images` | Bilder knyttet til en bolig (sortert via `sort_order`)     |
| `favorites`      | Brukerens lagrede favoritter (én rad per bruker per bolig) |

## Roller

- `user` (standard) – kan favorittmerke og bla.
- `landlord` – kan opprette egne annonser.
- `admin` – kan oppdatere/slette alle annonser.

For å oppgradere en testbruker til utleier, kjør i SQL-editoren:

```sql
update public.profiles
set role = 'landlord'
where email = 'din@epost.no';
```

## RLS-regler (høy sammendrag)

- Alle (også uinnloggede) kan lese `active` annonser.
- Bare `landlord`/`admin` kan opprette annonser, og bare som seg selv.
- Bare eier (eller admin) kan oppdatere en annonse.
- Hard-delete er forbeholdt admin – eiere bør sette `status = 'archived'`.
- Brukere kan bare lese/skrive sine egne favoritter og sin egen profil.

Se `migrations/0001_initial_schema.sql` for nøyaktig RLS.

## Future TODOs

- PostGIS for ekte spatiale spørringer (`ST_DWithin` osv.).
- Supabase Storage-bucket for bilder + signed URLs.
- Edge Function for å validere/parse ny annonse (kobles mot `aiService`).
- Audit-logg for status-endringer.
