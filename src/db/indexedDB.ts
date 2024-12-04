// src/db/indexedDB.ts

import Dexie from 'dexie';

class AppDatabase extends Dexie {
  syncQueue: Dexie.Table<SyncQueue, string>;

  constructor() {
    super('DoctorIncomeManagerDB');
    
    this.version(1).stores({
      syncQueue: 'id, collection, operation, timestamp'
    });

    this.syncQueue = this.table('syncQueue');
  }
}

export const db = new AppDatabase();

export interface SyncQueue {
  id: string;
  collection: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
}
