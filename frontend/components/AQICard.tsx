"use client";

import { CityResult } from "@/types/aqi";
import { getAQILevel } from "@/lib/aqi-helpers";

interface AQICardProps {
  result: CityResult;
  onClick: () => void;
}

export default function AQICard({ result, onClick }: AQICardProps) {
  if (result.Error !== "" || result.Data === null) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-sm font-medium text-slate-800">{result.City}</p>
        <p className="text-xs text-slate-500 mt-1">Gagal memuat: {result.Error}</p>
      </div>
    );
  }

  const level = getAQILevel(result.Data.aqi);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-blue-400 transition-colors"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{result.City}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {level.label} · Dominan {result.Data.dominentpol.toUpperCase()}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Sumber: {result.Data.attributions.map((a) => a.name).join(", ")}
        </p>
      </div>
      <div
        className="font-mono text-lg font-semibold text-white flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: level.hexColor,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
        }}
      >
        {result.Data.aqi}
      </div>
    </button>
  );
}