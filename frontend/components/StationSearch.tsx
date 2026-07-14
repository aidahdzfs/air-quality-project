"use client";

import { useState, useMemo } from "react";
import { Station } from "@/types/aqi";

interface StationSearchProps {
  stations: Station[];
  onSelect: (station: Station) => void;
}

export default function StationSearch({ stations, onSelect }: StationSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const sortedStations = useMemo(() => {
    return [...stations].sort((a, b) => a.station.name.localeCompare(b.station.name));
  }, [stations]);

  const filteredStations = useMemo(() => {
    if (query.trim() === "") return sortedStations.slice(0, 10);
    const lowerQuery = query.toLowerCase();
    return sortedStations
      .filter((s) => s.station.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10);
  }, [query, sortedStations]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Cari stasiun/kota lain..."
        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
      />

      {isFocused && (
        <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-md mt-1 shadow-lg max-h-64 overflow-y-auto">
          {filteredStations.length === 0 ? (
            <p className="p-3 text-sm text-slate-500">
              Tidak ada stasiun yang cocok dengan &quot;{query}&quot;
            </p>
          ) : (
            filteredStations.map((station) => (
              <button
                key={station.uid}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(station);
                  setQuery("");
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 border-b border-slate-100 last:border-0"
              >
                {station.station.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}