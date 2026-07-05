package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"aqi-dashboard/backend/internal/stationcache"
)

type StationsHandler struct {
	Cache *stationcache.Cache
}

func NewStationsHandler(cache *stationcache.Cache) *StationsHandler {
	return &StationsHandler{Cache: cache}
}

func (h *StationsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	stations, err := h.Cache.GetStations(ctx)
	if err != nil {
		http.Error(w, "gagal memuat data stasiun", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stations)
}