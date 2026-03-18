/**
 * Location Service - Handles geolocation and coordinates
 */

import { Location } from './types.js';

export class LocationService {
  /**
   * Get current user location from browser Geolocation API
   * Falls back to IP-based geolocation if unavailable
   */
  async getCurrentLocation(): Promise<Location> {
    // Try browser geolocation first (works in browser context)
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error: GeolocationPositionError) => {
            console.warn('Geolocation error:', error.message);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    }

    // Fallback: IP-based geolocation
    return this.getLocationByIP();
  }

  /**
   * Get location from IP address using free geolocation API
   */
  private async getLocationByIP(): Promise<Location> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('IP geolocation request failed');
      }
      const data = await response.json() as { latitude?: number; longitude?: number };
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
      throw new Error('Invalid response from IP geolocation');
    } catch (error) {
      console.warn('IP geolocation failed, using default (São Paulo, Brazil)');
      // Default to São Paulo, Brazil (Guarana heartland)
      return {
        latitude: -23.5505,
        longitude: -46.6333,
      };
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @returns distance in meters
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Parse location from address string (future enhancement)
   */
  async geocodeAddress(address: string): Promise<Location | null> {
    // Placeholder for future geocoding implementation
    console.log('Geocoding address:', address);
    return null;
  }
}
