"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { CityResult, Station } from "@/types/aqi";
import { fetchAQIData, fetchStations } from "@/lib/api";
import { getAQILevel } from "@/lib/aqi-helpers";
import CitySelector from "@/components/CitySelector";
import StationSearch from "@/components/StationSearch";
import AQICard from "@/components/AQICard";
import PollutantDetail from "@/components/PollutantDetail";

const AQIMap = dynamic(() => import("@/components/AQIMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm text-slate-500">
      Memuat peta...
    </div>
  ),
});

const AVAILABLE_CITIES = [
  "Jakarta",
  "Medan",
  "Semarang",
  "Palembang",
  "Pekanbaru",
  "Malang",
  "Yogyakarta (Sleman)",
  "Palangka Raya",
  "Maros (dekat Makassar)",
];

export default function Home() {
  const [selectedCities, setSelectedCities] = useState<string[]>(["Jakarta"]);
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);
  const [allStations, setAllStations] = useState<Station[]>([]);
  const [results, setResults] = useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detailCity, setDetailCity] = useState<CityResult | null>(null);

  useEffect(() => {
    fetchStations()
      .then(setAllStations)
      .catch(() => {});
  }, []);

  const spotlight = useMemo(() => {
    const valid = allStations
      .map((s) => ({ ...s, aqiNum: parseInt(s.aqi, 10) }))
      .filter((s) => !isNaN(s.aqiNum));
    if (valid.length === 0) return null;
    return valid.reduce((worst, s) => (s.aqiNum > worst.aqiNum ? s : worst));
  }, [allStations]);

  function handleSelectStation(station: Station) {
    if (selectedStations.some((s) => s.uid === station.uid)) return;
    setSelectedStations([...selectedStations, station]);
  }

  function handleRemoveStation(uid: number) {
    setSelectedStations(selectedStations.filter((s) => s.uid !== uid));
  }

  async function handleFetch() {
    if (selectedCities.length === 0 && selectedStations.length === 0) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAQIData(
        selectedCities,
        selectedStations.map((s) => s.uid)
      );
      setResults(data);
    } catch {
      setErrorMessage("Gagal mengambil data. Pastikan server backend berjalan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-50 to-orange-50 px-6 py-8">
        <header className="relative z-10">
          <h1 className="font-display text-4xl font-semibold text-slate-800">
            AQI Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Data kualitas udara real-time dari{" "}
            <a
              href="https://waqi.info"
              target="_blank"
              className="underline underline-offset-2">
              World Air Quality Index Project
            </a>
            . Data belum divalidasi resmi dan dapat berubah sewaktu-waktu.
          </p>
        </header>
      </div>

      {spotlight && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div
            className="font-mono text-xl font-semibold text-white flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: getAQILevel(spotlight.aqiNum).hexColor,
              width: "56px",
              height: "56px",
              borderRadius: "50%",
            }}
          >
            {spotlight.aqiNum}
          </div>
          <p className="text-sm text-slate-700">
            Saat ini, kualitas udara terburuk yang tercatat:{" "}
            <span className="font-medium">{spotlight.station.name}</span> —{" "}
            {getAQILevel(spotlight.aqiNum).label}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 mt-8 items-start">
        <div className="w-full lg:w-[380px] flex-shrink-0 space-y-4">
          <CitySelector
            availableCities={AVAILABLE_CITIES}
            selectedCities={selectedCities}
            onChange={setSelectedCities}
          />

          <StationSearch stations={allStations} onSelect={handleSelectStation} />

          {selectedStations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedStations.map((station) => (
                <span
                  key={station.uid}
                  className="px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 flex items-center gap-2"
                >
                  {station.station.name}
                  <button
                    onClick={() => handleRemoveStation(station.uid)}
                    className="font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleFetch}
            disabled={
              isLoading || (selectedCities.length === 0 && selectedStations.length === 0)
            }
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Memuat..." : "Cek Kualitas Udara"}
          </button>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          {results.length > 0 && (
            <div className="space-y-2 pt-2">
              {results.map((result) => (
                <AQICard
                  key={result.City}
                  result={result}
                  onClick={() => setDetailCity(result)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 w-full sticky top-6">
          <AQIMap stations={allStations} />
        </div>
      </div>

      {detailCity && (
        <PollutantDetail result={detailCity} onClose={() => setDetailCity(null)} />
      )}
    </main>
  );
}