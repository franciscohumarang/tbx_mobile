import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MedicationProvider } from './contexts/MedicationContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ADR from './pages/ADR';
import NotificationTrigger from './pages/NotificationTrigger';
import DashboardLogin from './pages/dashboard/Login';
import Dashboard from './pages/dashboard/Dashboard';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#0a1c30', // Dark navy blue
      light: '#2c3e50',
      dark: '#050e17',
      contrastText: '#fff'
    },
    secondary: {
      main: '#64c0fa', // Light blue from logo
      light: '#97d4fb',
      dark: '#3193d4',
      contrastText: '#0a1c30'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    text: {
      primary: '#0a1c30',
      secondary: '#475569'
    },
    error: {
      main: '#dc2626'
    },
    warning: {
      main: '#f59e0b'
    },
    success: {
      main: '#10b981'
    },
    info: {
      main: '#64c0fa'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      color: '#0a1c30'
    },
    h6: {
      fontWeight: 600,
      color: '#0a1c30'
    },
    body1: {
      color: '#475569'
    },
    body2: {
      color: '#475569'
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'primary'
      },
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderRadius: 8
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500
        },
        contained: {
          backgroundColor: '#64c0fa',
          color: '#0a1c30',
          '&:hover': {
            backgroundColor: '#97d4fb',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        },
        outlined: {
          borderColor: '#64c0fa',
          color: '#0a1c30',
          '&:hover': {
            borderColor: '#97d4fb',
            backgroundColor: 'rgba(100, 192, 250, 0.04)'
          }
        },
        text: {
          color: '#0a1c30',
          '&:hover': {
            backgroundColor: 'rgba(100, 192, 250, 0.04)'
          }
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#475569',
          '&.Mui-selected': {
            color: '#64c0fa'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#0a1c30',
          '&:hover': {
            backgroundColor: 'rgba(100, 192, 250, 0.04)'
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#64c0fa'
        }
      }
    }
  }
});

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/adr" 
        element={
          <ProtectedRoute>
            <ADR />
          </ProtectedRoute>
        } 
      />
      {/* Public route for notification trigger - no authentication required */}
      <Route path="/trigger-notifications" element={<NotificationTrigger />} />
      <Route path="/dashboard/login" element={<DashboardLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <MedicationProvider>
            <AppContent />
          </MedicationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
