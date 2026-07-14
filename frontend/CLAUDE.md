# frontend

Next.js dashboard untuk air quality project (aqi-dashboard).

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Scripts
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — jalankan build hasil production
- `npm run lint` — eslint

## Struktur
- `app/` — App Router pages (`layout.tsx`, `page.tsx`, `globals.css`)
- `public/` — asset statis (svg dll)

## Catatan penting
- Lihat `AGENTS.md`: versi Next.js di project ini punya breaking changes dari training data model. Baca dokumentasi relevan di `node_modules/next/dist/docs/` sebelum menulis kode yang menyentuh Next.js API, sebelum mengasumsikan behavior dari memori.
- Backend ada terpisah di `../backend` (Go, lihat `backend/CLAUDE.md`). Frontend memanggilnya sebagai API eksternal — bukan lewat Next.js API routes.