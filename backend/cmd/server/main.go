package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"aqi-dashboard/backend/internal/aggregator"
	"aqi-dashboard/backend/internal/handler"
	"aqi-dashboard/backend/internal/stationcache"
	"aqi-dashboard/backend/internal/waqi"

	"github.com/joho/godotenv"
)

func corsMiddleware(next http.Handler) http.Handler {
    allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
    if allowedOrigin == "" {
        allowedOrigin = "http://localhost:3000"
    }
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}

func main() {
	godotenv.Load()

	token := os.Getenv("WAQI_TOKEN")
	if token == "" {
		fmt.Println("WAQI_TOKEN belum diset")
		return
	}

	client := waqi.NewClient(token)

	cities := map[string]aggregator.City{
		"Jakarta":                {Label: "Jakarta", Lat: -6.155, Lon: 106.846},
		"Medan":                  {Label: "Medan", Lat: 3.59, Lon: 98.85},
		"Semarang":                {Label: "Semarang", Lat: -6.985, Lon: 110.381},
		"Palembang":               {Label: "Palembang", Lat: -3.031, Lon: 104.72},
		"Pekanbaru":               {Label: "Pekanbaru", Lat: 0.46667, Lon: 101.4666},
		"Malang":                  {Label: "Malang", Lat: -7.9551897, Lon: 112.6119383},
		"Yogyakarta (Sleman)":     {Label: "Yogyakarta (Sleman)", Lat: -7.731, Lon: 110.354},
		"Palangka Raya":           {Label: "Palangka Raya", Lat: -2.22611, Lon: 113.945},
		"Maros (dekat Makassar)":  {Label: "Maros (dekat Makassar)", Lat: -4.997, Lon: 119.57},
	}

	cache := stationcache.NewCache(client)
	stationsHandler := handler.NewStationsHandler(cache)

	aqiHandler := handler.NewAQIHandler(client, cities, cache)

	mux := http.NewServeMux()
	mux.Handle("/api/aqi", aqiHandler)
	mux.Handle("/api/stations", stationsHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // fallback untuk lokal
	}
	fmt.Println("Server jalan di port:", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(mux)))
}