package handler

import (
	"net/http"
	"os"

	"aqi-dashboard/backend/internal/aggregator"
	apihandler "aqi-dashboard/backend/internal/handler"
	"aqi-dashboard/backend/internal/stationcache"
	"aqi-dashboard/backend/internal/waqi"
)

// Daftar kota dipindah ke sini (dulu ada di cmd/server/main.go)
var cities = map[string]aggregator.City{
	"Jakarta":                {Label: "Jakarta", Lat: -6.155, Lon: 106.846},
	"Medan":                  {Label: "Medan", Lat: 3.59, Lon: 98.85},
	"Semarang":               {Label: "Semarang", Lat: -6.985, Lon: 110.381},
	"Palembang":              {Label: "Palembang", Lat: -3.031, Lon: 104.72},
	"Pekanbaru":              {Label: "Pekanbaru", Lat: 0.46667, Lon: 101.4666},
	"Malang":                 {Label: "Malang", Lat: -7.9551897, Lon: 112.6119383},
	"Yogyakarta (Sleman)":    {Label: "Yogyakarta (Sleman)", Lat: -7.731, Lon: 110.354},
	"Palangka Raya":          {Label: "Palangka Raya", Lat: -2.22611, Lon: 113.945},
	"Maros (dekat Makassar)": {Label: "Maros (dekat Makassar)", Lat: -4.997, Lon: 119.57},
}

// Handler adalah entrypoint wajib yang dibaca Vercel Go Runtime untuk file ini.
// Nama fungsi HARUS "Handler", dan signature-nya HARUS persis seperti ini.
func Handler(w http.ResponseWriter, r *http.Request) {
	// --- CORS, sama persis logic-nya dengan versi server persisten ---
	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}
	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// --- Setup client & cache per-invocation ---
	// CATATAN PENTING: cache di sini TIDAK persisten lintas request,
	// karena tiap invocation serverless berpotensi jadi proses baru.
	// Ini trade-off yang disengaja untuk deployment serverless.
	token := os.Getenv("WAQI_TOKEN")
	if token == "" {
		http.Error(w, "WAQI_TOKEN belum diset", http.StatusInternalServerError)
		return
	}

	client := waqi.NewClient(token)
	cache := stationcache.NewCache(client)
	aqiHandler := apihandler.NewAQIHandler(client, cities, cache)

	aqiHandler.ServeHTTP(w, r)
}