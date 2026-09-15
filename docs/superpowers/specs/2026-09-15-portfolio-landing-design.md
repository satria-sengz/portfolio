# Portfolio landing page — design spec (approved 2026-09-15, direction A "The delivery loop")

## Purpose
Single landing page for Satria Putra, linked from CV/LinkedIn, aimed at recruiters and engineers hiring for AI Engineer (Full Stack) roles. Its job: in three minutes, show that he understands and built the systems on his CV, by explaining how each one works.

## Scope
- One route (`/`), static export, deployed on Vercel from public GitHub repo.
- English only. No CMS, no blog, no backend, no live LLM calls.
- Content sourced from `../cv.html` (v2, human-voiced prose). Numbers must match the CV.
- Confidentiality: concept diagrams and CV-level numbers only. No internal hostnames, DB names, endpoints, real data or real code. Code snippets are illustrative rewrites.

## Stack
Next.js 16 (App Router, `output: 'export'`), TypeScript, Tailwind v4, `motion` (Framer Motion) for interactive animation, inline SVG for diagrams. Fonts self-hosted via @fontsource: Bricolage Grotesque (display), IBM Plex Sans (body), IBM Plex Mono (code snippets only).

## Visual system
- Paper `#F7F8F6`, Ink `#14161A`, RED test `#E0452B`, GREEN pass `#1B9E5A`, Ticket yellow `#F5C84B`, Rail slate `#5B6472`. Dark mode follows system; same palette inverted (ink base, paper text). `[data-theme]` override on `<html>` for testing.
- Left-aligned. A vertical rail on the left is the page's spine; sections attach to it. Measure under 80 characters.
- No eyebrow labels in all caps, no middle-dot meta strings, no arrow suffixes on links, no uniform card grid with shadows.

## Sections (top to bottom)
1. Hero: name, role line, hook, CTAs (CV PDF, LinkedIn, GitHub, email), and the DeliveryLoop animation.
2. Stats: 249 endpoints ported, 21 subagents, 5,000+ notes, 739 commits on one project.
3. How I got here with AI: 5-entry timeline on the rail; nodes fill as scrolled into view.
4. How it works: 4 concept blocks, each with an interactive diagram and a `<details>` "How it works" (steps, decisions, what broke, stack, my role + commits):
   - Receipt OCR pipeline
   - Agent delivery pipeline
   - NestJS → Go strangler-fig migration
   - Fraud detection, 5 layers, none an LLM
5. Skills: six groups from the CV.
6. Experience: three entries.
7. Contact / footer.

## Motion
- One orchestrated, looping moment: the hero DeliveryLoop. Yellow tickets travel spec → ticket → RED → code → review → deploy. The RED node flashes red then green per ticket. Roughly every fourth ticket bounces at review and returns. Counters for deployed and bounced.
- Rail draws with scroll (single device, no per-section fade-ups).
- Concept diagrams animate only on user action: Read receipt (scanline + fields type in), Dispatch feature (agent tiles light in order), Route traffic to Go (paths flip one by one with byte-identical ticks), Submit duplicate / new receipt (falls through five sieves; caught or passes).
- `prefers-reduced-motion`: loop shows a static frame; interactions jump to end state.

## Verification
- `npm run build` succeeds (static export to `out/`), `tsc --noEmit` and `eslint` clean.
- Screenshots via headless Chrome at 390px and 1280px, light and dark, reviewed visually.
- All external links return 200. CV PDF served from `/Satria_Putra_CV.pdf`.
- Keyboard: nav links, buttons and details are focusable with visible focus.
