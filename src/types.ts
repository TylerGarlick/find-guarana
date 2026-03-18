/**
 * Type definitions for Find Guarana
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number; // in meters
  phone?: string;
  rating?: number;
  types: string[];
  isOpen?: boolean;
}

export interface SearchResult {
  stores: Store[];
  searchLocation: Location;
  timestamp: Date;
}

export interface APIConfig {
  googlePlacesApiKey?: string;
  foursquareApiKey?: string;
  radius: number; // search radius in meters
}

export interface DatabaseStore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  rating: number | null;
  types: string;
  lastSearched: string;
  storeId?: string;
}
