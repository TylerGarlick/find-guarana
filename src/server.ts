/**
 * Find Guarana - Web Server
 * Serves the web interface and provides API endpoints
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PlacesService } from './places-service.js';
import { LocationService } from './location-service.js';
import { DatabaseService } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Services
const placesService = new PlacesService();
const locationService = new LocationService();
const db = new DatabaseService();

/**
 * API: Search for nearby stores
 * GET /api/search?lat=...&lng=...&radius=...
 */
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;
    
    // Helper to extract string from query param (handles string | string[] | ParsedQs)
    const getStringParam = (param: unknown): string => {
      if (typeof param === 'string') return param;
      if (Array.isArray(param)) return param[0];
      return '';
    };
    
    let location;
    if (lat && lng) {
      location = {
        latitude: parseFloat(getStringParam(lat)),
        longitude: parseFloat(getStringParam(lng)),
      };
    } else {
      location = await locationService.getCurrentLocation();
    }

    const searchRadius = radius ? parseInt(getStringParam(radius)) : 5000;
    const results = await placesService.searchNearbyStores(location, searchRadius);

    // Cache results
    db.cacheStores(results.stores);
    db.logSearch(location.latitude, location.longitude, searchRadius, results.stores.length);

    res.json({
      success: true,
      location: location,
      radius: searchRadius,
      count: results.stores.length,
      stores: results.stores,
      timestamp: results.timestamp,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    });
  }
});

/**
 * API: Get favorites
 * GET /api/favorites
 */
app.get('/api/favorites', (req: Request, res: Response) => {
  try {
    const favorites = db.getFavorites();
    res.json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get favorites',
    });
  }
});

/**
 * API: Add to favorites
 * POST /api/favorites
 */
app.post('/api/favorites', async (req: Request, res: Response) => {
  try {
    const { storeId } = req.body;
    
    if (!storeId) {
      return res.status(400).json({
        success: false,
        error: 'storeId is required',
      });
    }

    // Get store details
    const store = await placesService.getStoreDetails(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        error: 'Store not found',
      });
    }

    db.addFavorite(store);
    
    res.json({
      success: true,
      message: 'Added to favorites',
      store,
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add favorite',
    });
  }
});

/**
 * API: Remove from favorites
 * DELETE /api/favorites/:storeId
 */
app.delete('/api/favorites/:storeId', (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    db.removeFavorite(storeId as string);
    
    res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove favorite',
    });
  }
});

/**
 * API: Get recent searches
 * GET /api/history
 */
app.get('/api/history', (req: Request, res: Response) => {
  try {
    const searches = db.getRecentSearches(10);
    res.json({
      success: true,
      searches,
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get history',
    });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🥤 Find Guarana server running on http://localhost:${PORT}`);
  console.log('   Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  db.close();
  process.exit(0);
});
