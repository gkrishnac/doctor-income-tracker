// src/services/syncService.ts

import Dexie from 'dexie';
import { db } from '../db/indexedDB';
import { firestore } from '../firebase/config';
import { networkService } from './networkService';

interface SyncQueue {
  id: string;
  collection: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
}

interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingChanges: number;
}

class SyncService {
  private syncInProgress: boolean = false;
  private syncStatus: SyncStatus = {
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
  };
  private statusListeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    networkService.addListener(this.handleNetworkChange);
    this.updatePendingChangesCount();
  }

  private handleNetworkChange = async (isOnline: boolean) => {
    if (isOnline) {
      await this.syncAll();
    }
  };

  async addToSyncQueue(
    collection: string,
    operation: SyncQueue['operation'],
    data: any
  ): Promise<void> {
    await db.syncQueue.add({
      id: crypto.randomUUID(),
      collection,
      operation,
      data,
      timestamp: Date.now(),
    });
    
    await this.updatePendingChangesCount();
    
    if (networkService.isNetworkAvailable()) {
      this.syncAll();
    }
  }

  private async updatePendingChangesCount() {
    const count = await db.syncQueue.count();
    this.updateStatus({ pendingChanges: count });
  }

  async syncAll(): Promise<void> {
    if (this.syncInProgress) return;

    try {
      this.syncInProgress = true;
      this.updateStatus({ isSyncing: true });

      const pendingItems = await db.syncQueue.toArray();
      
      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          await db.syncQueue.delete(item.id);
        }Sync failed for item ${item.}
      }

      this.updateStatus({
        isSyncing: false,
        lastSyncTime: Date.now(),
      });
      
      await this.updatePendingChangesCount();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: SyncQueue): Promise<void> {
    const docRef = firestore.collection(item.collection).doc(item.data.id);

    switch (item.operation) {
      case 'CREATE':
      case 'UPDATE':
        await docRef.set(item.data, { merge: true });
        break;
      case 'DELETE':
        await docRef.delete();
        break;
    }
  }

  private updateStatus(partialStatus: Partial<SyncStatus>) {
    this.syncStatus = { ...this.syncStatus, ...partialStatus };
    this.notifyStatusListeners();
  }

  addStatusListener(listener: (status: SyncStatus) => void) {
    this.statusListeners.push(listener);
  }

  removeStatusListener(listener: (status: SyncStatus) => void) {
    this.statusListeners = this.statusListeners.filter(l => l !== listener);
  }

  private notifyStatusListeners() {
    this.statusListeners.forEach(listener => listener(this.syncStatus));
  }

  getCurrentStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
}

export const syncService = new SyncService();
