"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Station } from "@/types/aqi";
import { getAQILevel } from "@/lib/aqi-helpers";
import "leaflet/dist/leaflet.css";

interface AQIMapProps {
  stations: Station[];
}

export default function AQIMap({ stations }: AQIMapProps) {
  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {stations.map((station) => {
        const aqiNumber = parseInt(station.aqi, 10);
        const isValid = !isNaN(aqiNumber);
        const level = isValid ? getAQILevel(aqiNumber) : null;

        return (
          <CircleMarker
            key={station.uid}
            center={[station.lat, station.lon]}
            radius={8}
            pathOptions={{
              fillColor: level ? level.hexColor : "#9ca3af",
              fillOpacity: 0.8,
              color: "white",
              weight: 1,
            }}
          >
            <Popup>
              <strong>{station.station.name}</strong>
              <br />
              AQI: {isValid ? aqiNumber : "Tidak tersedia"}
              {level && <div>{level.label}</div>}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}