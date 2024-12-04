import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { syncOfflineData } from '../../services/sync/syncService';
import { getUnsyncedConsultations } from '../../services/offline/offlineService';
import './SyncStatus.scss';

const SyncStatus: React.FC = () => {
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  useEffect(() => {
    checkUnsyncedData();
  }, []);

  const checkUnsyncedData = async () => {
    const unsyncedConsultations = await getUnsyncedConsultations();
    setUnsyncedCount(unsyncedConsultations.length);
  };

  const handleSync = async () => {
    await syncOfflineData();
    checkUnsyncedData();
  };

  return (
    <Box className="sync-status">
      <Typography variant="body1">
        Unsynced Consultations: {unsyncedCount}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSync}>
        Sync Now
      </Button>
    </Box>
  );
};

export default SyncStatus;
