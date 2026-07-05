package waqi

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const baseURL = "https://api.waqi.info/feed"

// Client menyimpan hal-hal yang dibutuhkan berulang kali: token API dan http.Client
type Client struct {
	Token      string
	HTTPClient *http.Client
}

// NewClient membuat Client baru dengan token yang diberikan
func NewClient(token string) *Client {
	return &Client{
		Token: token,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second, //bukan default hanya defense in depth
		},
	}
}

// GetCityFeed mengambil data AQI untuk satu kota berdasarkan koordinat (lat, lon)
func (c *Client) GetCityFeed(ctx context.Context, lat, lon float64) (*FeedData, error) {
	url := fmt.Sprintf("%s/geo:%f;%f/?token=%s", baseURL, lat, lon, c.Token)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat request untuk koordinat %.4f,%.4f: %w", lat, lon, err)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gagal fetch data untuk koordinat %.4f,%.4f: %w", lat, lon, err)
	}
	defer resp.Body.Close()

	var feedResp FeedResponse
	if err := json.NewDecoder(resp.Body).Decode(&feedResp); err != nil {
		return nil, fmt.Errorf("gagal parse response: %w", err)
	}

	if feedResp.Status != "ok" {
		var errMsg string
		json.Unmarshal(feedResp.Data, &errMsg)
		return nil, fmt.Errorf("WAQI API error: %s", errMsg)
	}

	var data FeedData
	if err := json.Unmarshal(feedResp.Data, &data); err != nil {
		return nil, fmt.Errorf("gagal parse data: %w", err)
	}

	return &data, nil
}

func (c *Client) GetIndonesiaStations(ctx context.Context) ([]Station, error) {
	url := fmt.Sprintf("https://api.waqi.info/map/bounds/?latlng=-11,95,6,141&token=%s", c.Token)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat request stations: %w", err)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("gagal fetch stations: %w", err)
	}
	defer resp.Body.Close()

	var boundsResp BoundsResponse
	if err := json.NewDecoder(resp.Body).Decode(&boundsResp); err != nil {
		return nil, fmt.Errorf("gagal parse stations: %w", err)
	}

	if boundsResp.Status != "ok" {
		return nil, fmt.Errorf("WAQI bounds error: status=%s", boundsResp.Status)
	}

	return boundsResp.Data, nil
}