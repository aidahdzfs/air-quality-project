"use client";

import { CityResult } from "@/types/aqi";
import { POLLUTANT_LABELS } from "@/lib/aqi-helpers";

interface PollutantDetailProps {
  result: CityResult;
  onClose: () => void;
}

const WEATHER_LABELS: Record<string, { label: string; unit: string }> = {
  t: { label: "Suhu", unit: "°C" },
  h: { label: "Kelembaban", unit: "%" },
  w: { label: "Kecepatan Angin", unit: "m/s" },
  p: { label: "Tekanan Udara", unit: "hPa" },
  dew: { label: "Titik Embun", unit: "°C" },
};

export default function PollutantDetail({ result, onClose }: PollutantDetailProps) {
  if (result.Data === null) return null;

  const pollutantKeys = Object.keys(POLLUTANT_LABELS);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-1">{result.Data.city.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Update: {result.Data.time.s} ({result.Data.time.tz})
        </p>

        <div className="space-y-2">
          {pollutantKeys.map((key) => {
            const value = result.Data!.iaqi[key];
            return (
              <div key={key} className="flex justify-between text-sm">
                <span>{POLLUTANT_LABELS[key]}</span>
                <span className="font-medium">
                  {value ? value.v : "Tidak tersedia"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Data Cuaca Pendukung</h3>
          <div className="space-y-1">
            {Object.keys(WEATHER_LABELS).map((key) => {
              const value = result.Data!.iaqi[key];
              if (!value) return null; // sembunyikan kalau memang tidak ada, tidak perlu tampilkan "tidak tersedia" untuk cuaca
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span>{WEATHER_LABELS[key].label}</span>
                  <span className="font-medium">
                    {value.v} {WEATHER_LABELS[key].unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
          Sumber data:{" "}
          {result.Data.attributions.map((attr, i) => (
            <span key={i}>
              <a href={attr.url} target="_blank" className="underline">
                {attr.name}
              </a>
              {i < result.Data!.attributions.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-blue-600">
          Tutup
        </button>
      </div>
    </div>
  );
}