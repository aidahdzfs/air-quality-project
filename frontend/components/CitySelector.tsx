"use client";

interface CitySelectorProps {
  availableCities: string[];
  selectedCities: string[];
  onChange: (cities: string[]) => void;
}

export default function CitySelector({
  availableCities,
  selectedCities,
  onChange,
}: CitySelectorProps) {
  function toggleCity(city: string) {
    if (selectedCities.includes(city)) {
      onChange(selectedCities.filter((c) => c !== city));
    } else {
      onChange([...selectedCities, city]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableCities.map((city) => {
        const isSelected = selectedCities.includes(city);
        return (
          <button
            key={city}
            onClick={() => toggleCity(city)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              isSelected
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
            }`}
          >
            {city}
          </button>
        );
      })}
    </div>
  );
}