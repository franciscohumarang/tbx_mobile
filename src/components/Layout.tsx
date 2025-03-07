import React, { ReactNode } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  IconButton, 
  Badge,
  BottomNavigation, 
  BottomNavigationAction,
  Paper
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Notifications as NotificationsIcon, 
  Person as PersonIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'TBX' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { notifications } = useNotifications();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/notifications') return 1;
    if (path === '/profile') return 2;
    return 0;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box 
            component="img"
            src="/tbx-title.png"
            alt="TBX Logo"
            sx={{ 
              height: 40,
              width: 40,
              mr: 2
              
            }}
            onClick={() => navigate('/')}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {currentUser && (
            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 2,
          pb: { xs: 10, sm: 10 },
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Container>
      
      {currentUser && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)'
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={getValue()}
            onChange={(_, newValue) => {
              switch (newValue) {
                case 0:
                  navigate('/');
                  break;
                case 1:
                  navigate('/notifications');
                  break;
                case 2:
                  navigate('/profile');
                  break;
                default:
                  navigate('/');
              }
            }}
            showLabels
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction 
              label="Notifications" 
              icon={
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              } 
            />
            <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default Layout; 