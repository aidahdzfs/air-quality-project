package aggregator

import (
	"context"
	"sync"
	"time"

	"aqi-dashboard/backend/internal/waqi"
)

// City merepresentasikan satu kota dalam daftar tetap: label untuk tampilan + koordinat untuk query WAQI
type City struct {
	Label string
	Lat   float64
	Lon   float64
}

// CityResult membungkus hasil fetch satu kota — data ATAU error, salah satu pasti ada
type CityResult struct {
	City  string // pakai Label dari City
	Data  *waqi.FeedData
	Error string
}

// FetchMultipleCities fetch data AQI untuk banyak kota secara concurrent
func FetchMultipleCities(client *waqi.Client, cities []City) []CityResult {
	resultChan := make(chan CityResult, len(cities))
	var wg sync.WaitGroup

	for _, city := range cities {
		wg.Add(1)

		go func(city City) {
			defer wg.Done()

			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			data, err := client.GetCityFeed(ctx, city.Lat, city.Lon)
			if err != nil {
				resultChan <- CityResult{City: city.Label, Error: err.Error()}
				return
			}

			resultChan <- CityResult{City: city.Label, Data: data}
		}(city)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	var results []CityResult
	for result := range resultChan {
		results = append(results, result)
	}

	return results
}