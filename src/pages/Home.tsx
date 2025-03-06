import React, { useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon, 
  Pending as PendingIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useMedications } from '../contexts/MedicationContext';
import { useNotifications } from '../contexts/NotificationContext';
import { users } from '../data/mockData';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    pendingMedications, 
    confirmedMedications, 
    missedMedications,
    confirmMedication 
  } = useMedications();
  const { 
    requestNotificationPermission, 
    hasPermission
  } = useNotifications();

  useEffect(() => {
    // Request notification permission when the component mounts
    if (hasPermission === null || hasPermission === false) {
      requestNotificationPermission();
    }
  }, [hasPermission, requestNotificationPermission]);

  const handleConfirm = (id: string) => {
    confirmMedication(id);
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
        <Typography variant="h5" gutterBottom>
          Medication Dashboard
        </Typography>
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

      <Grid container spacing={3}>
        {/* Pending Medications */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PendingIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Pending Medications
                </Typography>
              </Box>
              
              {pendingMedications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No pending medications.
                </Typography>
              ) : (
                <List>
                  {pendingMedications.map((medication) => (
                    <Paper 
                      key={medication.id} 
                      variant="outlined" 
                      sx={{ mb: 2, p: 2 }}
                    >
                      <ListItem disablePadding>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {medication.name} ({medication.dosage})
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span">
                                {medication.schedule} at {medication.time}
                              </Typography>
                              <Chip 
                                size="small" 
                                label="Pending" 
                                color="warning" 
                                sx={{ ml: 1 }} 
                              />
                              {(currentUser?.role === 'caregiver' || currentUser?.role === 'family') && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  Patient: {users.find(u => u.id === medication.patientId)?.name}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      
                      {currentUser?.role === 'patient' && (
                        <CardActions sx={{ justifyContent: 'flex-start', mt: 1 }}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            onClick={() => handleConfirm(medication.id)}
                          >
                            CONFIRM
                          </Button>
                        </CardActions>
                      )}
                    </Paper>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Confirmed Medications */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Confirmed Medications
                </Typography>
              </Box>
              
              {confirmedMedications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No confirmed medications.
                </Typography>
              ) : (
                <List>
                  {confirmedMedications.slice(0, 3).map((medication) => (
                    <ListItem key={medication.id} divider>
                      <ListItemText
                        primary={`${medication.name} (${medication.dosage})`}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {medication.schedule} at {medication.time}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              Confirmed at {medication.confirmationTime}
                            </Typography>
                            {(currentUser?.role === 'caregiver' || currentUser?.role === 'family') && (
                              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Patient: {users.find(u => u.id === medication.patientId)?.name}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Chip 
                        size="small" 
                        label="Confirmed" 
                        color="success" 
                        icon={<CheckCircleIcon />} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Missed Medications */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Missed Medications
                </Typography>
              </Box>
              
              {missedMedications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No missed medications.
                </Typography>
              ) : (
                <List>
                  {missedMedications.map((medication) => (
                    <ListItem key={medication.id} divider>
                      <ListItemText
                        primary={`${medication.name} (${medication.dosage})`}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {medication.schedule} at {medication.time} on {medication.date}
                            </Typography>
                            {(currentUser?.role === 'caregiver' || currentUser?.role === 'family') && (
                              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Patient: {users.find(u => u.id === medication.patientId)?.name}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Chip 
                        size="small" 
                        label="Missed" 
                        color="error" 
                        icon={<CancelIcon />} 
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home; 