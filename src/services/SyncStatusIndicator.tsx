// src/components/SyncStatusIndicator.tsx

import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip, Badge } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';
import { syncService } from '../services/syncService';
import { networkService } from '../services/networkService';

export const SyncStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState(syncService.getCurrentStatus());
  const [isOnline, setIsOnline] = useState(networkService.isNetworkAvailable());

  useEffect(() => {
    const statusListener = (newStatus: any) => setStatus(newStatus);
    const networkListener = (online: boolean) => setIsOnline(online);

    syncService.addStatusListener(statusListener);
    networkService.addListener(networkListener);

    return () => {
      syncService.removeStatusListener(statusListener);
      networkService.removeListener(networkListener);
    };
  }, []);

  const handleManualSync = () => {
    if (isOnline && !status.isSyncing) {
      syncService.syncAll();
    }
  };

  return (
    <Tooltip
      title={
        !isOnline
          ? 'Offline'
          : status.isSyncing
          ? 'Syncing...'
          : status.pendingChanges > 0
          ? `${status.pendingChanges} pending changes`
          : 'All changes synced'
      }
    >
      <IconButton
        onClick={handleManualSync}
        disabled={!isOnline || status.isSyncing}
        color={status.pendingChanges > 0 ? 'warning' : 'default'}
        className="sync-indicator"
      >
        <Badge badgeContent={status.pendingChanges > 0 ? status.pendingChanges : 0}>
          <SyncIcon
            className={`sync-indicator__icon ${status.isSyncing ? 'rotating' : ''}`}
            color={!isOnline ? 'disabled' : 'inherit'}
          />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
