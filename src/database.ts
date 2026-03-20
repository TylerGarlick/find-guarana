/**
 * Database Service - SQLite storage for caching and favorites
 */

import Database from 'better-sqlite3';
import { Store, DatabaseStore } from './types.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DatabaseService {
  private db: Database.Database;

  constructor(dbPath?: string) {
    const dbFilePath = dbPath || path.join(__dirname, '../data/guarana.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbFilePath);
    this.initializeTables();
  }

  /**
   * Initialize database tables
   */
  private initializeTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        phone TEXT,
        rating REAL,
        types TEXT,
        lastSearched TEXT
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS favorites (
        id TEXT PRIMARY KEY,
        storeId TEXT NOT NULL,
        name TEXT NOT NULL,
        address TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        notes TEXT,
        createdAt TEXT,
        FOREIGN KEY (storeId) REFERENCES stores(id)
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        radius INTEGER,
        resultsCount INTEGER,
        timestamp TEXT
      )
    `);
  }

  /**
   * Cache store results
   */
  cacheStores(stores: Store[]): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO stores (id, name, address, latitude, longitude, phone, rating, types, lastSearched)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = this.db.transaction((stores: Store[]) => {
      for (const store of stores) {
        stmt.run(
          store.id,
          store.name,
          store.address,
          store.latitude,
          store.longitude,
          store.phone || null,
          store.rating || null,
          store.types.join(','),
          new Date().toISOString()
        );
      }
    });

    insertMany(stores);
  }

  /**
   * Get cached stores
   */
  getCachedStores(): Store[] {
    const stmt = this.db.prepare('SELECT * FROM stores ORDER BY lastSearched DESC');
    const rows = stmt.all() as DatabaseStore[];

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      distance: 0,
      phone: row.phone || undefined,
      rating: row.rating || undefined,
      types: row.types.split(','),
      isOpen: undefined,
    }));
  }

  /**
   * Add store to favorites
   */
  addFavorite(store: Store, notes?: string): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO favorites (id, storeId, name, address, latitude, longitude, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      `fav-${store.id}`,
      store.id,
      store.name,
      store.address,
      store.latitude,
      store.longitude,
      notes || null,
      new Date().toISOString()
    );
  }

  /**
   * Get all favorites
   */
  getFavorites(): Store[] {
    const stmt = this.db.prepare('SELECT * FROM favorites ORDER BY createdAt DESC');
    const rows = stmt.all() as DatabaseStore[];

    return rows.map((row) => ({
      id: row.storeId || row.id,
      name: row.name,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      distance: 0,
      phone: row.phone || undefined,
      rating: row.rating || undefined,
      types: row.types ? row.types.split(',') : [],
      isOpen: undefined,
    }));
  }

  /**
   * Remove from favorites
   */
  removeFavorite(storeId: string): void {
    const stmt = this.db.prepare('DELETE FROM favorites WHERE storeId = ?');
    stmt.run(storeId);
  }

  /**
   * Log search history
   */
  logSearch(latitude: number, longitude: number, radius: number, resultsCount: number): void {
    const stmt = this.db.prepare(`
      INSERT INTO search_history (latitude, longitude, radius, resultsCount, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(latitude, longitude, radius, resultsCount, new Date().toISOString());
  }

  /**
   * Get recent searches
   */
  getRecentSearches(limit: number = 10): Array<{
    latitude: number;
    longitude: number;
    radius: number;
    resultsCount: number;
    timestamp: string;
  }> {
    const stmt = this.db.prepare('SELECT * FROM search_history ORDER BY timestamp DESC LIMIT ?');
    return stmt.all(limit) as any[];
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }
}
