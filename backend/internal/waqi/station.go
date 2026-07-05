package waqi

type StationInfo struct {
	Name string `json:"name"`
	Time string `json:"time"`
}

type Station struct {
	UID     int         `json:"uid"`
	Lat     float64     `json:"lat"`
	Lon     float64     `json:"lon"`
	Station StationInfo `json:"station"`
	AQI     string      `json:"aqi"`
}

type BoundsResponse struct {
	Status string    `json:"status"`
	Data   []Station `json:"data"`
}