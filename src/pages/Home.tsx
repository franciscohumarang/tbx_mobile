import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
 
  Chip, 
  Button,
  Alert,
  Grid,

  Avatar,
 
  Stack
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 

  Pending as PendingIcon,
  Person as PersonIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
 
import { useNotifications } from '../contexts/NotificationContext';
import { users } from '../data/mockData';
import NotificationService, { NotificationState } from '../services/NotificationService';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  // We'll keep this for other functionality but not use it for rendering
 
  const { 
    requestNotificationPermission, 
    hasPermission
  } = useNotifications();

  const [notificationState, setNotificationState] = useState<NotificationState>(() => {
    const notificationService = NotificationService.getInstance();
    return notificationService.getState();
  });

  // This effect runs once on component mount to set up notifications
  useEffect(() => {
    // Request notification permission when the component mounts
    if (hasPermission === null || hasPermission === false) {
      requestNotificationPermission();
    }
    
    // Get the notification service instance
    const notificationService = NotificationService.getInstance();
    
    // Get initial state
    setNotificationState(notificationService.getState());
    
    // Subscribe to state changes
    const unsubscribe = notificationService.subscribe((state) => {
      setNotificationState(state);
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [hasPermission, requestNotificationPermission]);

  const handleConfirm = (id: string) => {
    const notificationService = NotificationService.getInstance();
    notificationService.handleMedicationConfirm(id);
  };

  const handleReset = () => {
    const notificationService = NotificationService.getInstance();
    notificationService.reset();
    notificationService.startBackgroundNotifications();
  };

  // Get patients for caregivers and family members
  const getMonitoredPatients = () => {
    if (!currentUser || !currentUser.patients || currentUser.role === 'patient') {
      return [];
    }
    
    return users.filter(user => 
      currentUser.patients?.includes(user.id) && user.role === 'patient'
    );
  };

  const monitoredPatients = getMonitoredPatients();

  return (
    <Layout title={`Welcome, ${currentUser?.name}`}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" gutterBottom>
            Medication Dashboard
          </Typography>
          {currentUser?.role === 'patient' && (
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={handleReset}
            >
              Reset Notifications
            </Button>
          )}
        </Stack>
        <Typography variant="body1" color="text.secondary" paragraph>
          {currentUser?.role === 'patient' 
            ? 'Track your medication schedule and confirm your doses.' 
            : 'Monitor medication adherence for your patients.'}
        </Typography>

        {hasPermission === false && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please enable notifications to receive medication reminders.
            <Button 
              size="small" 
              onClick={() => requestNotificationPermission()}
              sx={{ ml: 2 }}
            >
              Enable Now
            </Button>
          </Alert>
        )}
      </Box>

      {/* Show monitored patients for caregivers and family members */}
      {(currentUser?.role === 'caregiver' || currentUser?.role === 'family') && monitoredPatients.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patients You're Monitoring
          </Typography>
          <Grid container spacing={2}>
            {monitoredPatients.map(patient => (
              <Grid item xs={12} sm={6} md={4} key={patient.id}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    borderLeft: '4px solid #4caf50'
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{patient.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient ID: {patient.id}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Pending Medications */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PendingIcon color="warning" />
          Pending Medications
        </Typography>
        {notificationState.pendingMedications.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            {notificationState.pendingMedications.map((medication, index) => (
              <Paper 
                key={`pending-${medication.id}`} 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="h6" component="div">
                    {medication.name} ({medication.dosage})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily at {medication.time}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label="Pending" 
                      color="warning" 
                      size="small"
                      sx={{ borderRadius: 1 }}
                    />
                    {currentUser?.role === 'patient' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleConfirm(medication.id)}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'uppercase',
                          fontWeight: 'bold'
                        }}
                      >
                        Confirm
                      </Button>
                    )}
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No pending medications
            </Typography>
          </Box>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Confirmed Medications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" />
              Confirmed Medications
            </Typography>
            {notificationState.confirmedMedications.length > 0 ? (
              <List>
                {notificationState.confirmedMedications.map((medication) => (
                  <ListItem 
                    key={`confirmed-${medication.id}`}
                    sx={{ 
                      px: 0,
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Stack spacing={0.5} width="100%">
                      <Typography variant="subtitle1">
                        {medication.name} ({medication.dosage})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Daily at {medication.time}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Confirmed at {medication.confirmationTime}
                      </Typography>
                    </Stack>
                    <Chip 
                      label="Confirmed" 
                      color="success" 
                      size="small" 
                      sx={{ ml: 2, borderRadius: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No confirmed medications
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Missed Medications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon color="error" />
              Missed Medications
            </Typography>
            {notificationState.missedMedications.length > 0 ? (
              <List>
                {notificationState.missedMedications.map((medication) => (
                  <ListItem 
                    key={`missed-${medication.id}`}
                    sx={{ 
                      px: 0,
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Stack spacing={0.5} width="100%">
                      <Typography variant="subtitle1">
                        {medication.name} ({medication.dosage})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Daily at {medication.time} on {medication.date}
                      </Typography>
                    </Stack>
                    <Chip 
                      label="Missed" 
                      color="error" 
                      size="small" 
                      sx={{ ml: 2, borderRadius: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No missed medications
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home; 