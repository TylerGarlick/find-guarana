# 🥤 Find Guarana

Find Guarana beverages at nearby stores, restaurants, and vendors in Brazil.

## Mission

Help users locate Guarana (the delicious Brazilian soft drink) near them using location-based search.

## ✨ Features (Phase 1 Complete)

- 📍 **Location Detection** - GPS or IP-based geolocation with São Paulo fallback
- 🔍 **Nearby Store Search** - Find stores within configurable radius
- 📏 **Distance Calculation** - Haversine formula for accurate distance
- 🏪 **Store Types** - Convenience stores, supermarkets, grocery stores, liquor stores
- ⭐ **Ratings & Hours** - Store ratings and open/closed status
- 🗺️ **Google Maps Directions** - One-click navigation to nearest store
- 💾 **SQLite Caching** - Cache search results locally
- ❤️ **Favorites** - Save your favorite Guarana spots
- 🌐 **Web Interface** - Beautiful responsive UI
- 🔌 **REST API** - JSON endpoints for integration

## 🏗️ Architecture

```
find-guarana/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── server.ts         # Web server + API
│   ├── types.ts          # TypeScript interfaces
│   ├── location-service.ts   # Geolocation logic
│   ├── places-service.ts     # Google Places API integration
│   └── database.ts           # SQLite storage
├── public/
│   └── index.html        # Web interface
├── data/
│   └── guarana.db        # SQLite database (auto-created)
└── package.json
```

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run CLI Version

```bash
npm run dev
```

### Run Web Server

```bash
npm run serve
```

Then open http://localhost:3000

## 📡 API Endpoints

### GET /api/search
Search for nearby stores.

**Query Parameters:**
- `lat` (optional) - Latitude
- `lng` (optional) - Longitude  
- `radius` (optional) - Search radius in meters (default: 5000)

**Response:**
```json
{
  "success": true,
  "location": { "latitude": -23.5505, "longitude": -46.6333 },
  "radius": 5000,
  "count": 5,
  "stores": [...],
  "timestamp": "2026-03-18T16:00:00.000Z"
}
```

### GET /api/favorites
Get saved favorite stores.

### POST /api/favorites
Add a store to favorites.

**Body:**
```json
{ "storeId": "place_id_123" }
```

### DELETE /api/favorites/:storeId
Remove from favorites.

### GET /api/history
Get recent search history.

## 🔑 Configuration

Create a `.env` file (optional):

```bash
# Google Places API Key
GOOGLE_PLACES_API_KEY=your_api_key_here

# Server port
PORT=3000

# Default search radius (meters)
SEARCH_RADIUS=5000
```

**Note:** The app works without an API key using mock data for demo/testing.

## 🛠️ Tech Stack

- **Runtime:** Node.js + TypeScript
- **Bundler:** tsx (development), tsc (production)
- **Database:** SQLite (better-sqlite3)
- **Web Framework:** Express.js
- **APIs:** Google Places API (optional)
- **Location:** Browser Geolocation API + IP fallback

## 📦 Development

```bash
# Install
npm install

# Run CLI
npm run dev

# Run web server
npm run serve

# Build for production
npm run build

# Run tests
npm test
```

## 🗺️ How It Works

1. **Get Location** - Browser GPS → IP geolocation → São Paulo default
2. **Search Places** - Query Google Places API for store types
3. **Calculate Distance** - Haversine formula for accurate measurements
4. **Sort & Filter** - Results sorted by distance, deduplicated
5. **Cache Results** - Store in SQLite for offline access
6. **Display** - Show in CLI or web interface with maps links

## 📈 Roadmap

### Phase 2: Details & Interaction
- [ ] Price information when available
- [ ] Store hours and availability
- [ ] Directions link (open in Maps app)
- [ ] Call store directly

### Phase 3: User Features
- [ ] Favorites list (backend complete)
- [ ] Add new locations
- [ ] Report out of stock
- [ ] Search history (backend complete)

## 🇧🇷 Why Guarana?

Guaraná is a popular Brazilian soft drink made from the guaraná plant. It's a cultural icon in Brazil and increasingly popular worldwide. This app helps people find their favorite Guarana beverages (Antarctica, Schin, Dolly, etc.) at local stores.

## 📄 License

MIT
