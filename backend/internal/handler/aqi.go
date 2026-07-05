package handler

import (
	"encoding/json"
	"net/http"

	"aqi-dashboard/backend/internal/aggregator"
	"aqi-dashboard/backend/internal/stationcache"
	"aqi-dashboard/backend/internal/waqi"
)

type AQIRequest struct {
	Cities      []string `json:"cities"`
	StationUIDs []int    `json:"stationUIDs"`
}

type AQIHandler struct {
	Client          *waqi.Client
	AvailableCities map[string]aggregator.City
	StationCache    *stationcache.Cache
}

func NewAQIHandler(client *waqi.Client, cities map[string]aggregator.City, cache *stationcache.Cache) *AQIHandler {
	return &AQIHandler{
		Client:          client,
		AvailableCities: cities,
		StationCache:    cache,
	}
}

func (h *AQIHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AQIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "body tidak valid", http.StatusBadRequest)
		return
	}

	var selectedCities []aggregator.City

	// 1. Cocokkan label ke 9 kota andalan
	for _, label := range req.Cities {
		city, ok := h.AvailableCities[label]
		if !ok {
			continue
		}
		selectedCities = append(selectedCities, city)
	}

	// 2. Cocokkan uid ke cache stasiun (hasil search)
	if len(req.StationUIDs) > 0 {
		allStations, err := h.StationCache.GetStations(r.Context())
		if err == nil {
			for _, uid := range req.StationUIDs {
				for _, station := range allStations {
					if station.UID == uid {
						selectedCities = append(selectedCities, aggregator.City{
							Label: station.Station.Name,
							Lat:   station.Lat,
							Lon:   station.Lon,
						})
						break
					}
				}
			}
		}
	}

	if len(selectedCities) == 0 {
		http.Error(w, "tidak ada kota/stasiun valid dalam request", http.StatusBadRequest)
		return
	}

	results := aggregator.FetchMultipleCities(h.Client, selectedCities)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}