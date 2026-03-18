# CLAUDE.md

This file provides guidance for AI assistants working on the find-guarana repository.

## Project Overview

**find-guarana** is a Guarana locator tool. Its mission: help users find Guarana (a Brazilian soft drink) at nearby stores, restaurants, and vendors.

- **Repository:** TylerGarlick/find-guarana
- **Primary branch:** `main`
- **Author:** Tyler Garlick
- **Mission:** Locate Guarana beverages nearby

## Repository Structure

```
find-guarana/
├── .gitignore       # Comprehensive Node.js gitignore template
├── README.md        # Project title only
├── CLAUDE.md        # This file
└── IMPLEMENTATION.md # Implementation plan
```

## Technology Stack

- **Runtime:** Node.js
- **Package management:** npm or pnpm
- **Language:** JavaScript/TypeScript
- **Bundler:** Vite
- **Storage:** SQLite or simple JSON file
- **APIs:** Places APIs (Google Places, Foursquare) for location search

## Core Features

1. **Location-based search** - Find Guarana at nearby stores/restaurants
2. **Price comparison** - Compare prices across locations
3. **Availability alerts** - Get notified when Guarana is in stock nearby
4. **Favorites** - Save preferred vendors
5. **Directions** - Open maps for navigation

## Development Commands

```
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
```

## Git Conventions

- **Default branch:** `main`
- **Commit style:** Follow conventional commit messages (e.g., `feat:`, `fix:`, `docs:`)
- **Environment:** Use `.env` for API keys (gitignored), `.env.example` for templates

## Key Guidelines

1. Verify all external API calls work (Google Places, Foursquare, etc.)
2. Test location services on real device or emulator
3. Handle offline gracefully
4. Respect API rate limits