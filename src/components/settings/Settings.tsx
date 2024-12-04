import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import EstablishmentSettings from './EstablishmentSettings';
import DeductiblesSettings from './DeductiblesSettings';
import ProfileSettings from './ProfileSettings';
import './Settings.scss';

const Settings: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="settings-container">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Establishments" />
          <Tab label="Deductibles" />
          <Tab label="Profile" />
        </Tabs>
      </Box>
      <Box className="settings-content">
        {value === 0 && <EstablishmentSettings />}
        {value === 1 && <DeductiblesSettings />}
        {value === 2 && <ProfileSettings />}
      </Box>
    </div>
  );
};

export default Settings;
