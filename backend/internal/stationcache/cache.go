package stationcache

import (
	"context"
	"sync"
	"time"

	"aqi-dashboard/backend/internal/waqi"
)

type Cache struct {
	mu          sync.RWMutex
	stations    []waqi.Station
	lastFetched time.Time
	client      *waqi.Client
}

func NewCache(client *waqi.Client) *Cache {
	return &Cache{client: client}
}

// GetStations mengembalikan data cache; kalau kosong atau sudah lebih dari 1 jam, fetch ulang
func (c *Cache) GetStations(ctx context.Context) ([]waqi.Station, error) {
	c.mu.RLock()
	isStale := time.Since(c.lastFetched) > 1*time.Hour
	current := c.stations
	c.mu.RUnlock()

	if len(current) > 0 && !isStale {
		return current, nil
	}

	stations, err := c.client.GetIndonesiaStations(ctx)
	if err != nil {
		if len(current) > 0 {
			return current, nil // fetch gagal, tapi masih ada cache lama — pakai itu daripada error total
		}
		return nil, err
	}

	c.mu.Lock()
	c.stations = stations
	c.lastFetched = time.Now()
	c.mu.Unlock()

	return stations, nil
}