import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Settings,
  Assessment,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase';
import './MainLayout.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Patients', icon: <People />, path: '/patients' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <Box className="main-layout">
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Doctor Income Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List className="drawer-list">
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" className="main-content">
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
