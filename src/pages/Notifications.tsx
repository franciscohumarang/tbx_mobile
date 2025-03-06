import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Paper,
  Button,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
 
import Layout from '../components/Layout';
import { useNotifications } from '../contexts/NotificationContext';
 
import { useAuth } from '../contexts/AuthContext';
 
import NotificationService, { NotificationState } from '../services/NotificationService';

const Notifications: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
 
  const { currentUser } = useAuth();
 
  const [notificationState, setNotificationState] = useState<NotificationState>(() => {
    const notificationService = NotificationService.getInstance();
    return notificationService.getState();
  });

  // Mark all notifications as read when the page is visited
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
    });
  }, [notifications, markAsRead]);

  // Initialize notifications
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    
    // Get initial state
    setNotificationState(notificationService.getState());

    // Subscribe to state changes
    const unsubscribe = notificationService.subscribe((state) => {
      setNotificationState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleConfirm = (medicationId: string) => {
    const notificationService = NotificationService.getInstance();
    notificationService.handleMedicationConfirm(medicationId);
  };

  // Get patient name by ID
 

  return (
    <Layout title="Notifications">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentUser?.role === 'patient' 
            ? 'Your medication reminders and alerts.' 
            : 'Medication reminders and alerts for your patients.'}
        </Typography>
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6">No Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have any notifications at the moment.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ p: 3 }}>
          {/* Pending Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Pending Notifications" 
              avatar={<PendingIcon color="warning" />}
            />
            <CardContent>
              <List>
                {notificationState.pendingMedications.map((medication, index) => (
                  <ListItem key={`notifications-pending-${medication.id}-${index}`}>
                    <ListItemIcon>
                      <PendingIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Time to take ${medication.name}`}
                      secondary={`${medication.dosage} - ${medication.time}`}
                    />
                    {currentUser?.role === 'patient' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleConfirm(medication.id)}
                      >
                        Confirm
                      </Button>
                    )}
                  </ListItem>
                ))}
                {notificationState.pendingMedications.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No pending notifications"
                      secondary="You're all caught up!"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Confirmed Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Confirmed Notifications" 
              avatar={<CheckCircleIcon color="success" />}
            />
            <CardContent>
              <List>
                {notificationState.confirmedMedications.map((medication, index) => (
                  <ListItem key={`notifications-confirmed-${medication.id}-${index}`}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Confirmed: ${medication.name}`}
                      secondary={`${medication.dosage} - ${medication.time}`}
                    />
                  </ListItem>
                ))}
                {notificationState.confirmedMedications.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No confirmed notifications"
                      secondary="Medications will appear here once confirmed"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Missed Notifications */}
          <Card>
            <CardHeader 
              title="Missed Notifications" 
              avatar={<ErrorIcon color="error" />}
            />
            <CardContent>
              <List>
                {notificationState.missedMedications.map((medication, index) => (
                  <ListItem key={`notifications-missed-${medication.id}-${index}`}>
                    <ListItemIcon>
                      <ErrorIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Missed: ${medication.name}`}
                      secondary={`${medication.dosage} - ${medication.time}`}
                    />
                  </ListItem>
                ))}
                {notificationState.missedMedications.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No missed notifications"
                      secondary="Great job staying on track!"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}
    </Layout>
  );
};

export default Notifications; 