export interface AQILevel {
  label: string;
  colorClass: string;
  textColorClass: string;
  hexColor: string;
}

export function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) {
    return { label: "Baik", colorClass: "bg-green-500", textColorClass: "text-green-700", hexColor: "#22c55e" };
  }
  if (aqi <= 100) {
    return { label: "Sedang", colorClass: "bg-yellow-500", textColorClass: "text-yellow-700", hexColor: "#eab308" };
  }
  if (aqi <= 150) {
    return { label: "Tidak Sehat (Kelompok Sensitif)", colorClass: "bg-orange-500", textColorClass: "text-orange-700", hexColor: "#f97316" };
  }
  if (aqi <= 200) {
    return { label: "Tidak Sehat", colorClass: "bg-red-500", textColorClass: "text-red-700", hexColor: "#ef4444" };
  }
  if (aqi <= 300) {
    return { label: "Sangat Tidak Sehat", colorClass: "bg-purple-500", textColorClass: "text-purple-700", hexColor: "#a855f7" };
  }
  return { label: "Berbahaya", colorClass: "bg-red-900", textColorClass: "text-red-900", hexColor: "#7f1d1d" };
}

export const POLLUTANT_LABELS: Record<string, string> = {
  pm25: "PM2.5",
  pm10: "PM10",
  o3: "Ozon (O3)",
  no2: "Nitrogen Dioksida (NO2)",
  so2: "Sulfur Dioksida (SO2)",
  co: "Karbon Monoksida (CO)",
};