// src/types/sync.ts

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingChanges: number;
}

export interface SyncQueue {
  id: string;
  collection: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: number;
}
