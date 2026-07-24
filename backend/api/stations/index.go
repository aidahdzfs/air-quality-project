package handler

import (
	"net/http"
	"os"

	apihandler "aqi-dashboard/backend/internal/handler"
	"aqi-dashboard/backend/internal/stationcache"
	"aqi-dashboard/backend/internal/waqi"
)

func Handler(w http.ResponseWriter, r *http.Request) {
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

	token := os.Getenv("WAQI_TOKEN")
	if token == "" {
		http.Error(w, "WAQI_TOKEN belum diset", http.StatusInternalServerError)
		return
	}

	client := waqi.NewClient(token)
	cache := stationcache.NewCache(client)
	stationsHandler := apihandler.NewStationsHandler(cache)

	stationsHandler.ServeHTTP(w, r)
}