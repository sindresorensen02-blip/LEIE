# Leie

Leie is a Bergen-first rental discovery MVP for finding affordable houses, apartments, studios, rooms, and shared rooms nearby. The prototype uses a real interactive MapLibre GL JS map, realistic seed data, market-value pins, and safe source adapter stubs for future approved integrations.

## Stack

- Next.js App Router
- MapLibre GL JS
- TypeScript and React
- Tailwind CSS
- SQLite via `better-sqlite3`
- Zod validation
- Vitest

## Install

```bash
npm install
```

## Run Locally

```bash
npm run seed
npm run dev
```

Open the local Next.js URL printed by the dev server.

## Bergen Hero Image

The app expects the generated Bergen artwork here:

```text
public/images/bergen-leie-map.png
```

That image is now used as a compact onboarding/brand asset in the app chrome. It is not used as the coordinate system. The live rental map is rendered with MapLibre GL JS using real listing latitude/longitude values.

## Mock Data

The app ships with 42 realistic Bergen rentals in `lib/mockListings.ts`, covering:

- Sentrum, Bergenhus, Sandviken, Åsane, Fana, Årstad, Fyllingsdalen, Laksevåg, Loddefjord, Nesttun, Nygård, Møhlenpris, Nordnes, Danmarksplass, Landås, Kronstad, Paradis, Eidsvåg, Bryggen, and Solheimsviken
- Houses, apartments, studios, rooms, and shared rooms
- Monthly and nightly rentals
- Prices from 5,500 NOK to 28,000 NOK monthly equivalent
- FINN.no, Airbnb, Hybel.no, Utleiemegleren, Heimstaden, and mock-safe source coverage

Seed SQLite with:

```bash
npm run seed
```

## Commands

```bash
npm run dev        # Start Next.js
npm run build      # Production build
npm run seed       # Seed SQLite with mock listings
npm run scrape     # Import from safe mock source adapters
npm run test       # Run Vitest tests
npm run typecheck  # Run TypeScript checks
```

## API

`GET /api/listings` returns normalized listings and supports:

- `maxPrice`
- `propertyType`
- `source`
- `minSize`
- `minBedrooms`
- `includeShortTerm`
- `onlyAvailableNow`
- `sort`
- `lat`
- `lng`

`POST /api/scrape` is development-only and imports from the safe mock adapters, geocodes missing coordinates through the mock centroid fallback, deduplicates listings, and saves to SQLite.

## Source Adapters

Adapters live in `lib/sources/` and all implement the same `SourceAdapter` interface.

Current status:

| Source | Status | Notes |
| --- | --- | --- |
| FINN.no | `requires_permission` | Live data requires approved API access, a feed, partner access, or written permission. |
| Airbnb | `requires_permission` | Live data requires approved API/feed/partner access or written permission. |
| Hybel.no | `requires_permission` | Live data requires approved API/feed/partner access or written permission. |
| Utleiemegleren.no | `requires_permission` | Live data requires approved API/feed/partner access or written permission. |
| Heimstaden.no | `requires_permission` | Live data requires approved API/feed/partner access or written permission. |

All adapters return realistic Bergen mock listings by default. There is no website scraping, browser automation, login-wall access, CAPTCHA handling, proxy usage, or restriction-bypass logic.

## Compliance Notes

Leie is mock-first. Do not add live collection unless the source clearly permits it through an official API, public feed, partner agreement, or written permission. Do not bypass robots.txt, Terms of Service, rate limits, anti-bot systems, paywalls, CAPTCHAs, or login walls.

## Map

`components/MapView.tsx` renders a real MapLibre GL JS map centered on Bergen. The custom dark style uses readable OpenStreetMap/CARTO raster tiles with Leie cyan/teal atmosphere layers.

Pins are placed from listing coordinates:

- `locationAccuracy: "exact"` means the listing supplied exact latitude/longitude.
- `locationAccuracy: "address_geocoded"` means a full address was geocoded and cached.
- `locationAccuracy: "approximate_area"` means only an area/neighborhood was available, so the pin uses a Bergen neighborhood centroid and displays an approximate marker.

Listings are rendered as a MapLibre GeoJSON `Point` source with coordinates in `[longitude, latitude]` order. Pin circles, selected states, cheapest rings, and approximate labels are map layers, so they stay geographically fixed during zoom, pan, resize, and mobile layout changes.

The generated Bergen image is never used for lat/lng positioning.

## Geocoding

`lib/geocoding.ts` provides a provider abstraction and SQLite cache. In development it uses mock Bergen neighborhood centroids from `lib/neighborhoods.ts`. If an exact address is missing, the app falls back to a known neighborhood centroid.

## Environment Variables

Copy `.env.example` to `.env.local` if needed:

```bash
DATABASE_URL="file:./leie.db"
GEOCODING_PROVIDER="mock"
GEOCODING_API_KEY=""
ENABLE_APPROVED_FINN_INTEGRATION="false"
ENABLE_APPROVED_AIRBNB_INTEGRATION="false"
ENABLE_APPROVED_HYBEL_INTEGRATION="false"
ENABLE_APPROVED_UTLEIEMEGLEREN_INTEGRATION="false"
ENABLE_APPROVED_HEIMSTADEN_INTEGRATION="false"
```

The `ENABLE_APPROVED_*` flags are placeholders for future integrations after approved access exists.
