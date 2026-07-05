# backend

Go API untuk air quality project (aqi-dashboard), mengambil dan mengagregasi data dari WAQI (World Air Quality Index) API.

## Stack
- Go 1.23
- Module: `aqi-dashboard/backend`

## Struktur
- `cmd/server/main.go` — entrypoint
- `internal/waqi/` — client dan types untuk komunikasi dengan WAQI API
- `internal/handler/` — HTTP handler (`aqi.go`)
- `internal/aggregator/` — logic agregasi data AQI

## Config
- Copy `.env.example` ke `.env` dan isi `WAQI_TOKEN` dengan token WAQI API.

## Status
Skeleton kosong — semua file hanya berisi deklarasi package/func minimal. Logic bisnis akan ditulis manual oleh user secara bertahap. **Jangan mengisi logic apapun tanpa diminta eksplisit.**

## Frontend
UI ada di `../frontend` (Next.js, lihat `frontend/CLAUDE.md`). Frontend memanggil backend ini sebagai API eksternal.
