/**
 * Find Guarana - Main CLI Entry Point
 * 
 * Phase 1: Basic Location Search
 * Search for nearby stores that sell Guarana
 */

import { PlacesService } from './places-service.js';
import { LocationService } from './location-service.js';
import { DatabaseService } from './database.js';
import { Store } from './types.js';

async function main() {
  console.log('🥤 Find Guarana - Location Search');
  console.log('================================\n');

  const placesService = new PlacesService();
  const locationService = new LocationService();
  const db = new DatabaseService();

  try {
    // Get user location
    console.log('📍 Detecting your location...');
    const location = await locationService.getCurrentLocation();
    console.log(`   Latitude: ${location.latitude.toFixed(4)}`);
    console.log(`   Longitude: ${location.longitude.toFixed(4)}\n`);

    // Search for nearby stores
    console.log('🔍 Searching for nearby stores...');
    const results = await placesService.searchNearbyStores(location, 5000);

    console.log(`   Found ${results.stores.length} stores within 5km radius\n`);

    // Cache results in database
    db.cacheStores(results.stores);
    db.logSearch(location.latitude, location.longitude, 5000, results.stores.length);

    // Display results
    if (results.stores.length === 0) {
      console.log('❌ No stores found nearby.');
      console.log('   Try expanding your search radius or check your location.');
      db.close();
      return;
    }

    console.log('📊 Results (sorted by distance):\n');
    
    results.stores.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name}`);
      console.log(`   📍 ${store.address}`);
      console.log(`   📏 ${formatDistance(store.distance)} away`);
      if (store.rating) {
        console.log(`   ⭐ ${store.rating}/5`);
      }
      if (store.isOpen !== undefined) {
        console.log(`   🕐 ${store.isOpen ? 'Open now' : 'Closed'}`);
      }
      if (store.phone) {
        console.log(`   📞 ${store.phone}`);
      }
      console.log(`   🏷️  ${store.types.join(', ')}`);
      console.log('');
    });

    // Generate maps link for nearest store
    if (results.stores.length > 0) {
      const nearestStore = results.stores[0];
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${nearestStore.latitude},${nearestStore.longitude}`;
      console.log('🗺️  Get directions to nearest store:');
      console.log(`   ${mapsUrl}\n`);
    }

    // Demo: Add first store to favorites
    console.log('💾 Saving first store to favorites...');
    db.addFavorite(results.stores[0], 'Nearest Guarana spot!');
    const favorites = db.getFavorites();
    console.log(`   Favorites: ${favorites.length} store(s) saved\n`);

    console.log('✅ Phase 1 Complete: Location search functionality implemented');
    console.log('   Features:');
    console.log('   ✓ Geolocation detection');
    console.log('   ✓ Nearby store search');
    console.log('   ✓ Distance calculation');
    console.log('   ✓ Results caching (SQLite)');
    console.log('   ✓ Favorites management');
    console.log('   ✓ Google Maps directions');
    console.log('   Next: Web interface, price tracking, availability alerts');
    
    db.close();
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    db.close();
    process.exit(1);
  }
}

/**
 * Format distance in human-readable format
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Run main function
main();
