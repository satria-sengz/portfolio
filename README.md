# satriaputra — portfolio

Single-page portfolio for Satria Putra, AI Engineer (Full Stack). Static export, no backend, no tracking.

Each system from the CV is explained with an interactive diagram you can run in the browser: the delivery loop, receipt OCR, the NestJS to Go strangler-fig migration, and the five-layer fraud check.

## Stack

Next.js 16 (App Router, `output: "export"`), TypeScript, Tailwind v4, `motion` for the interactive pieces, inline SVG for diagrams. Fonts are self-hosted (Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build and check

```bash
npm run build      # static export to ./out
npx tsc --noEmit
npx eslint src scripts

# visual + interaction check (needs Google Chrome installed)
python3 -m http.server 4173 --bind 127.0.0.1 --directory out &
node scripts/shots.mjs http://127.0.0.1:4173/ /tmp/shots
```

`?theme=dark` or `?theme=light` on the URL overrides the system colour scheme (used for screenshots).

## Content

All copy and numbers live in `src/content/site.ts`. They mirror the CV; if one changes, change the other.

## Deploy

Vercel: import the repo, framework preset Next.js, no extra settings. The `out/` folder is also plain static files and can be served from anywhere.
