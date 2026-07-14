// types/aqi.ts

export interface IAQIValue {
  v: number;
}

export interface CityInfo {
  geo: [number, number];
  name: string;
  url: string;
}

export interface TimeInfo {
  s: string;
  tz: string;
  iso: string;
}

export interface Attribution {
  url: string;
  name: string;
}

export interface FeedData {
  aqi: number;
  idx: number;
  city: CityInfo;
  dominentpol: string;
  iaqi: Record<string, IAQIValue>;
  time: TimeInfo;
  attributions: Attribution[];
}

export interface CityResult {
  City: string;
  Data: FeedData | null;
  Error: string;
}

export interface StationInfo {
  name: string;
  time: string;
}

export interface Station {
  uid: number;
  lat: number;
  lon: number;
  station: StationInfo;
  aqi: string;
}