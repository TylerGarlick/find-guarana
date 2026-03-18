/**
 * Find Guarana - Test Suite
 * Tests for location search functionality
 */

import { LocationService } from './location-service.js';
import { PlacesService } from './places-service.js';
import { DatabaseService } from './database.js';
import { Store, Location } from './types.js';

async function runTests() {
  console.log('🧪 Find Guarana - Test Suite\n');
  console.log('=' .repeat(50));

  let passed = 0;
  let failed = 0;

  // Test 1: Location Service
  console.log('\n📍 Test 1: Location Service');
  try {
    const locationService = new LocationService();
    const location = await locationService.getCurrentLocation();
    
    if (location.latitude && location.longitude) {
      console.log('   ✅ Location detection works');
      console.log(`      Lat: ${location.latitude}, Lng: ${location.longitude}`);
      passed++;
    } else {
      console.log('   ❌ Location detection failed');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Location service error:', error);
    failed++;
  }

  // Test 2: Distance Calculation
  console.log('\n📏 Test 2: Distance Calculation');
  try {
    const locationService = new LocationService();
    const distance = locationService.calculateDistance(
      -23.5505, -46.6333,  // São Paulo
      -23.5489, -46.6388   // Mercado São Paulo
    );
    
    if (distance > 0 && distance < 10000) {
      console.log('   ✅ Distance calculation works');
      console.log(`      Distance: ${Math.round(distance)}m`);
      passed++;
    } else {
      console.log('   ❌ Distance calculation invalid');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Distance calculation error:', error);
    failed++;
  }

  // Test 3: Places Service (Mock Data)
  console.log('\n🔍 Test 3: Places Service');
  try {
    const placesService = new PlacesService();
    const location: Location = { latitude: -23.5505, longitude: -46.6333 };
    const results = await placesService.searchNearbyStores(location, 5000);
    
    if (results.stores && results.stores.length > 0) {
      console.log('   ✅ Store search works');
      console.log(`      Found ${results.stores.length} stores`);
      passed++;
    } else {
      console.log('   ❌ Store search returned no results');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Places service error:', error);
    failed++;
  }

  // Test 4: Database Service
  console.log('\n💾 Test 4: Database Service');
  try {
    const db = new DatabaseService();
    
    // Test caching
    const testStore: Store = {
      id: 'test-1',
      name: 'Test Store',
      address: 'Test Address',
      latitude: -23.55,
      longitude: -46.63,
      distance: 1000,
      types: ['store'],
    };
    
    db.cacheStores([testStore]);
    const cached = db.getCachedStores();
    
    if (cached.length > 0) {
      console.log('   ✅ Database caching works');
      console.log(`      Cached ${cached.length} stores`);
      passed++;
    } else {
      console.log('   ❌ Database caching failed');
      failed++;
    }
    
    // Test favorites
    db.addFavorite(testStore, 'Test favorite');
    const favorites = db.getFavorites();
    
    if (favorites.length > 0) {
      console.log('   ✅ Favorites management works');
      console.log(`      Saved ${favorites.length} favorites`);
      passed++;
    } else {
      console.log('   ❌ Favorites management failed');
      failed++;
    }
    
    db.close();
  } catch (error) {
    console.log('   ❌ Database service error:', error);
    failed++;
  }

  // Test 5: Store Deduplication
  console.log('\n🔄 Test 5: Store Deduplication');
  try {
    const placesService = new PlacesService();
    const results = await placesService.searchNearbyStores(
      { latitude: -23.5505, longitude: -46.6333 },
      5000
    );
    
    const uniqueIds = new Set(results.stores.map(s => s.id));
    if (uniqueIds.size === results.stores.length) {
      console.log('   ✅ Deduplication works');
      console.log(`      All ${results.stores.length} stores are unique`);
      passed++;
    } else {
      console.log('   ❌ Duplicate stores found');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Deduplication error:', error);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n✅ All tests passed! Phase 1 implementation is solid.\n');
    return 0;
  } else {
    console.log('\n❌ Some tests failed. Review implementation.\n');
    return 1;
  }
}

// Run tests
runTests().then(exitCode => {
  process.exit(exitCode || 0);
}).catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
