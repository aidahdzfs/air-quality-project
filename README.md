# AQI Dashboard

Real-time air quality dashboard for Indonesian cities, built to demonstrate **concurrent programming in Go** through goroutines, channels, and `sync.WaitGroup` — fetching multiple cities' air quality data in parallel instead of sequentially.

![Go](https://img.shields.io/badge/Go-1.26-00ADD8?style=flat&logo=go)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript)

**Live demo:** _(add link after deploy)_
**Screenshot:** _(add screenshot here)_

---

## Why this project

Most portfolio backend projects are basic CRUD apps. This one exists to show something different: **using Go's concurrency model to solve a real I/O-bound problem** — fetching air quality data for multiple cities from an external API without making the user wait for each request sequentially.

Instead of:
```
City 1 (300ms) → City 2 (300ms) → City 3 (300ms) = ~900ms total
```
The backend fetches all cities concurrently:
```
City 1, City 2, City 3 (all at once) ≈ 300ms total
```

## Features

- **Multi-city selection** — pick from 9 major Indonesian cities or search across 85+ monitoring stations nationwide
- **Concurrent backend fetching** — goroutines + channels + `sync.WaitGroup`, with per-request timeouts via `context.WithTimeout`
- **Partial failure handling** — if one city's data fails to fetch, others still render normally; failures never take down the whole request
- **Interactive map** — all Indonesian monitoring stations plotted with color-coded AQI markers (Leaflet + OpenStreetMap)
- **Pollutant breakdown** — per-city detail view (PM2.5, PM10, O3, NO2, SO2, CO) with honest "not available" states when a station lacks sensor data
- **Live spotlight stat** — automatically surfaces the worst air quality reading across the country
- **Required attribution** — World Air Quality Index Project + original data source (e.g. BMKG) credited on every result, per WAQI's terms of use

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Go (standard library `net/http`, no framework) |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Map | Leaflet + react-leaflet |
| Data source | [World Air Quality Index Project](https://waqi.info) API |
| Hosting | _(add once deployed)_ |

## Architecture

```
Browser
   │  POST /api/aqi  { cities, stationUIDs }
   ▼
handler/aqi.go  ──────► validates input, resolves labels/UIDs to coordinates
   │
   ▼
aggregator/aggregator.go  ──► fans out N goroutines, one per city
   │                          each with its own context.WithTimeout
   ▼
waqi/client.go  ──────► HTTP call to WAQI, per-city
   │
   ▼
channel + sync.WaitGroup  ──► results collected as they complete
   │
   ▼
JSON response  ──► frontend renders cards + map
```

Each package has one job: `waqi/` only knows how to talk to the external API, `aggregator/` only knows how to fan work out concurrently, `handler/` only knows HTTP request/response. Swapping the data source later would only touch `waqi/`.

## A real constraint this project surfaced

WAQI's station coverage in Indonesia is sparse compared to neighboring countries — several major cities (Bandung, Surabaya, Makassar) have **no directly registered monitoring station** in the public API at the time of writing. The app handles this transparently: the nearest available station is used and labeled honestly (e.g. "Maros (near Makassar)") rather than silently substituted. Also, most Indonesian stations (sourced from BMKG) only report PM2.5 — other pollutant fields are genuinely absent, not zero, and the UI reflects that distinction rather than showing misleading zeros.

## Getting started

### Prerequisites
- Go 1.22+
- Node.js 18.18+
- A free WAQI API token from [aqicn.org/data-platform/token](https://aqicn.org/data-platform/token/)

### Backend
```bash
cd backend
cp .env.example .env
# edit .env, set WAQI_TOKEN=your_token
go run ./cmd/server
```
Server runs at `http://localhost:8080`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:3000`.

## API reference

### `POST /api/aqi`
Request:
```json
{ "cities": ["Jakarta", "Medan"], "stationUIDs": [8292] }
```
Response:
```json
[
  { "City": "Jakarta", "Data": { "aqi": 91, "...": "..." }, "Error": "" },
  { "City": "Banjarbaru, Indonesia", "Data": { "...": "..." }, "Error": "" }
]
```
A non-empty `Error` field means that specific city failed — other entries in the array are unaffected.

### `GET /api/stations`
Returns all ~85 monitoring stations in Indonesia (cached server-side, refreshed hourly).

## Project structure

```
backend/
├── cmd/server/main.go        # entry point, wiring
├── internal/
│   ├── waqi/                 # WAQI API client + types
│   ├── aggregator/           # concurrent fetch logic
│   ├── stationcache/         # in-memory cache for station list
│   └── handler/              # HTTP handlers
frontend/
├── src/
│   ├── app/page.tsx          # main page
│   ├── components/           # AQICard, AQIMap, CitySelector, StationSearch, PollutantDetail
│   ├── lib/                  # API client, AQI level/color helpers
│   └── types/                # shared TypeScript types
```

## Known limitations / possible next steps

- No historical trend charts yet (WAQI does return daily forecast data in the same feed response — unused for now)
- No caching layer for `/api/aqi` results (each request hits WAQI live)
- No automated tests

## Attribution

Air quality data provided by the [World Air Quality Index Project](https://waqi.info). Data is unvalidated real-time data and may change without notice.

## License

MIT