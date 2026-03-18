/**
 * Places Service - Search for stores using Google Places API
 */

import { Store, Location, SearchResult } from './types.js';
import { LocationService } from './location-service.js';

export class PlacesService {
  private apiKey: string;
  private locationService: LocationService;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_PLACES_API_KEY || '';
    this.locationService = new LocationService();
  }

  /**
   * Search for nearby stores that might sell Guarana
   * Uses Google Places API with relevant store types
   */
  async searchNearbyStores(
    location?: Location,
    radius: number = 5000
  ): Promise<SearchResult> {
    const searchLocation = location || await this.locationService.getCurrentLocation();

    // Search for relevant store types
    const storeTypes = [
      'convenience_store',
      'grocery_or_supermarket',
      'liquor_store',
      'store',
      'food',
    ];

    const allStores: Store[] = [];

    for (const type of storeTypes) {
      try {
        const stores = await this.fetchPlacesByType(
          searchLocation,
          type,
          radius
        );
        allStores.push(...stores);
      } catch (error) {
        console.warn(`Failed to fetch ${type}:`, error);
      }
    }

    // Sort by distance and remove duplicates
    const uniqueStores = this.deduplicateStores(allStores);
    uniqueStores.sort((a, b) => a.distance - b.distance);

    return {
      stores: uniqueStores,
      searchLocation: searchLocation,
      timestamp: new Date(),
    };
  }

  /**
   * Fetch places from Google Places API
   */
  private async fetchPlacesByType(
    location: Location,
    type: string,
    radius: number
  ): Promise<Store[]> {
    if (!this.apiKey) {
      console.warn('No Google Places API key configured');
      return this.getMockStores(location, type, radius);
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json() as { status: string; results?: any[] };

      if (data.status !== 'OK') {
        console.warn('Places API error:', data.status);
        return [];
      }

      return (data.results || []).map((place: any) => this.parsePlace(place, location));
    } catch (error) {
      console.warn('Places API request failed:', error);
      return [];
    }
  }

  /**
   * Parse Google Place result into Store object
   */
  private parsePlace(place: any, userLocation: Location): Store {
    const distance = this.locationService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      place.geometry.location.lat,
      place.geometry.location.lng
    );

    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address || 'Address unavailable',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      distance: distance,
      phone: place.formatted_phone_number,
      rating: place.rating,
      types: place.types || [],
      isOpen: place.opening_hours?.open_now,
    };
  }

  /**
   * Remove duplicate stores by place_id or name
   */
  private deduplicateStores(stores: Store[]): Store[] {
    const seen = new Set<string>();
    return stores.filter((store) => {
      if (seen.has(store.id)) {
        return false;
      }
      seen.add(store.id);
      return true;
    });
  }

  /**
   * Generate mock stores for testing/demo when API key not available
   */
  private getMockStores(
    location: Location,
    type: string,
    radius: number
  ): Store[] {
    // Mock stores around São Paulo
    const mockStores: Store[] = [
      {
        id: 'mock-1',
        name: 'Mercado São Paulo',
        address: 'Rua Venceslau Brás, 163 - Centro, São Paulo',
        latitude: -23.5489,
        longitude: -46.6388,
        distance: 1200,
        phone: '+55 11 3105-7099',
        rating: 4.5,
        types: ['grocery_or_supermarket', 'food'],
        isOpen: true,
      },
      {
        id: 'mock-2',
        name: 'Extra Hypermercado',
        address: 'Av. Brigadeiro Luís Antônio, 3140 - Jardim Paulista',
        latitude: -23.5745,
        longitude: -46.6567,
        distance: 2800,
        phone: '+55 11 3886-0606',
        rating: 4.2,
        types: ['grocery_or_supermarket', 'store'],
        isOpen: true,
      },
      {
        id: 'mock-3',
        name: 'Pão de Açúcar',
        address: 'Rua Augusta, 2064 - Jardim Paulista',
        latitude: -23.5589,
        longitude: -46.6589,
        distance: 1800,
        phone: '+55 11 3062-6030',
        rating: 4.3,
        types: ['grocery_or_supermarket', 'food'],
        isOpen: true,
      },
      {
        id: 'mock-4',
        name: 'Carrefour Express',
        address: 'Rua Oscar Freire, 493 - Jardins',
        latitude: -23.5612,
        longitude: -46.6678,
        distance: 2200,
        phone: '+55 11 3088-1024',
        rating: 4.0,
        types: ['convenience_store', 'grocery_or_supermarket'],
        isOpen: false,
      },
      {
        id: 'mock-5',
        name: 'Drogaria São Paulo',
        address: 'Rua Domingos de Morais, 2564 - Vila Mariana',
        latitude: -23.5889,
        longitude: -46.6388,
        distance: 4300,
        phone: '+55 11 5575-9000',
        rating: 4.4,
        types: ['store', 'food'],
        isOpen: true,
      },
    ];

    return mockStores;
  }

  /**
   * Get store details by place ID
   */
  async getStoreDetails(placeId: string): Promise<Store | null> {
    if (!this.apiKey) {
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json() as { status: string; result?: any };

      if (data.status !== 'OK') {
        return null;
      }

      return this.parsePlace(data.result || {}, await this.locationService.getCurrentLocation());
    } catch (error) {
      console.warn('Failed to fetch store details:', error);
      return null;
    }
  }
}
