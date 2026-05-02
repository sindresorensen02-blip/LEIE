# Static Web Build

This folder is a **prebuilt** static export of the Leie app — committed
to make local preview instant, with no Metro bundler / Expo CLI / cache
friction.

## How to view the website (one command)

From the repo root:

```bash
npx serve web-build
```

Then open **http://localhost:3000** in your browser.

That's it. The site works fully offline — mock Bergen data, dark
illuminated map, filters, favorites (in browser localStorage), and the
admin form (also stored locally).

### Alternatives if `npx serve` doesn't work

```bash
# Python 3 (built into macOS / most Linux)
cd web-build && python3 -m http.server 8080
# → http://localhost:8080

# Or any static server you prefer (http-server, live-server, etc.)
```

## How to rebuild this folder

After you change source code and want a fresh static build:

```bash
npx expo export --platform web --output-dir web-build --clear
```

## When NOT to use this

For **active development** use the regular dev workflow (`npm run start`
+ Expo Go on your phone, or the iOS Simulator). Hot reload, error
overlays, and dev tools only work with Metro running.

This static export exists for:
- Demo previews to investors / partners
- Reproducing exactly what the production bundle ships
- Bypassing Metro/cache issues during debugging
