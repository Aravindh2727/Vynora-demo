/**
 * Vynora Demo Storage & Local Persistence Manager
 * Provides 100% isolated browser storage for Demo Mode.
 * Persists modifications across browser refreshes and subsequent visits.
 * Provides instant "Reset Demo Data" with zero impact on production data.
 */

import { getInitialDemoData, INITIAL_DEMO_USER_ID } from './initialDemoData';

const DEMO_STORE_KEY = 'vynora_demo_store_v2';

type StoreListener = () => void;
const listeners = new Set<StoreListener>();

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('DemoStorage listener error:', e);
    }
  });
}

class DemoStorageManager {
  private inMemoryCache: Record<string, any> | null = null;

  /**
   * Load current demo store from localStorage or seed initial data
   */
  public getStore(): Record<string, any> {
    if (this.inMemoryCache) {
      return this.inMemoryCache;
    }

    if (typeof localStorage === 'undefined') {
      this.inMemoryCache = getInitialDemoData();
      return this.inMemoryCache;
    }

    try {
      const raw = localStorage.getItem(DEMO_STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.finance_transactions) {
          this.inMemoryCache = parsed;
          return this.inMemoryCache!;
        }
      }
    } catch (e) {
      console.warn('Failed to parse existing demo storage, re-seeding:', e);
    }

    // Seed fresh initial data
    const fresh = getInitialDemoData();
    this.inMemoryCache = fresh;
    this.saveStore(fresh);
    return fresh;
  }

  /**
   * Commit in-memory store changes to localStorage
   */
  public saveStore(store: Record<string, any>): void {
    this.inMemoryCache = store;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store));
      } catch (e) {
        console.error('Failed to persist demo store to localStorage:', e);
      }
    }
    notifyListeners();
  }

  /**
   * Reset all demonstration records back to pristine initial state
   */
  public resetStore(): Record<string, any> {
    const fresh = getInitialDemoData();
    this.inMemoryCache = fresh;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(fresh));
      } catch (e) {
        console.error('Failed to reset demo store:', e);
      }
    }
    notifyListeners();
    return fresh;
  }

  /**
   * Get an array of records from a collection
   */
  public getCollection<T = any>(collectionName: string): T[] {
    const store = this.getStore();
    const coll = store[collectionName];
    if (Array.isArray(coll)) {
      return [...coll] as T[];
    }
    return [];
  }

  /**
   * Get a single record by id or _id
   */
  public getItem<T = any>(collectionName: string, id: string): T | null {
    const coll = this.getCollection(collectionName);
    const item = coll.find((x: any) => x.id === id || x._id === id);
    return item ? ({ ...item } as T) : null;
  }

  /**
   * Add a new item to a collection with a generated ID and timestamps
   */
  public addItem<T = any>(collectionName: string, itemData: any): T {
    const store = this.getStore();
    const coll = Array.isArray(store[collectionName]) ? [...store[collectionName]] : [];
    
    const id = itemData.id || itemData._id || `demo_${collectionName.substring(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newItem: any = {
      ...itemData,
      id,
      _id: id,
      userId: itemData.userId || INITIAL_DEMO_USER_ID,
      createdAt: itemData.createdAt || nowIso,
      updatedAt: nowIso
    };

    // Prepend for newest-first display in transaction/log collections
    if (['finance_transactions', 'dairy_logs', 'vehicle_fuel_logs', 'crop_activities', 'health_vitals'].includes(collectionName)) {
      coll.unshift(newItem);
    } else {
      coll.push(newItem);
    }

    store[collectionName] = coll;
    this.saveStore(store);
    return newItem as T;
  }

  /**
   * Update an existing record in a collection
   */
  public updateItem<T = any>(collectionName: string, id: string, updates: any): T | null {
    const store = this.getStore();
    const coll = Array.isArray(store[collectionName]) ? [...store[collectionName]] : [];
    const index = coll.findIndex((x: any) => x.id === id || x._id === id);

    if (index === -1) {
      // If updating a singleton object (e.g. health_profile or user_profile)
      if (typeof store[collectionName] === 'object' && !Array.isArray(store[collectionName])) {
        store[collectionName] = {
          ...store[collectionName],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.saveStore(store);
        return store[collectionName] as T;
      }
      return null;
    }

    const updated = {
      ...coll[index],
      ...updates,
      id,
      _id: id,
      updatedAt: new Date().toISOString()
    };

    coll[index] = updated;
    store[collectionName] = coll;
    this.saveStore(store);
    return updated as T;
  }

  /**
   * Delete a record from a collection
   */
  public deleteItem(collectionName: string, id: string): boolean {
    const store = this.getStore();
    const coll = Array.isArray(store[collectionName]) ? [...store[collectionName]] : [];
    const filtered = coll.filter((x: any) => x.id !== id && x._id !== id);
    
    if (filtered.length !== coll.length) {
      store[collectionName] = filtered;
      this.saveStore(store);
      return true;
    }
    return false;
  }

  /**
   * Subscribe to store mutations
   */
  public subscribe(listener: StoreListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
}

export const DemoStorage = new DemoStorageManager();

