package waqi
import "encoding/json"

// FeedResponse adalah bentuk response lengkap dari endpoint /feed/{city}/
type FeedResponse struct {
	Status string          `json:"status"`
	Data   json.RawMessage `json:"data"` // ditunda parsing-nya sampai kita tahu status
}

type FeedData struct {
	AQI          int                  `json:"aqi"`          // angka AQI utama kota ini (contoh: 120)
	Idx          int                  `json:"idx"`           // ID unik stasiun di sistem WAQI (tidak dipakai UI, boleh diabaikan nanti)
	City         City                 `json:"city"`          // nama kota + koordinat
	DominantPol  string               `json:"dominentpol"`   // polutan mana yang paling tinggi (contoh: "pm25")
	IAQI         map[string]IAQIValue `json:"iaqi"`           // breakdown per polutan — INI untuk fitur #4 (detail per kota)
	Time         Time                 `json:"time"`           // kapan data ini diukur
	Attributions []Attribution        `json:"attributions"`   // sumber data — WAJIB ditampilkan (syarat WAQI)
}

type City struct {
	Geo  []float64 `json:"geo"`
	Name string    `json:"name"`
	URL  string    `json:"url"`
}

type IAQIValue struct {
	V float64 `json:"v"`  // nilai tunggal. JSON aslinya {"pm25": {"v": 120}} — makanya perlu struct wrapper ini, bukan langsung float64
}

type Time struct {
	S   string `json:"s"`
	Tz  string `json:"tz"`
	ISO string `json:"iso"`
}

type Attribution struct {
	URL  string `json:"url"`   // link sumber data, misal bmkg.go.id
	Name string `json:"name"`  // nama sumber, misal "BMKG"
}