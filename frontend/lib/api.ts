import { CityResult, Station } from "@/types/aqi";

const API_BASE_URL = "http://localhost:8080";

export async function fetchAQIData(
  cities: string[],
  stationUIDs: number[] = []
): Promise<CityResult[]> {
  const response = await fetch(`${API_BASE_URL}/api/aqi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cities, stationUIDs }),
  });

  if (!response.ok) {
    throw new Error(`Request gagal: ${response.status}`);
  }

  return response.json();
}

export async function fetchStations(): Promise<Station[]> {
  const response = await fetch(`${API_BASE_URL}/api/stations`);
  if (!response.ok) {
    throw new Error(`Gagal memuat stasiun: ${response.status}`);
  }
  return response.json();
}