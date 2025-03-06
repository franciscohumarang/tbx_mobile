import React, { useEffect } from 'react';
import { 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Paper,
  Chip,
  Button
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useNotifications } from '../contexts/NotificationContext';
import { useMedications } from '../contexts/MedicationContext';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../data/mockData';

const Notifications: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
  const { confirmMedication } = useMedications();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Mark all notifications as read when the page is visited
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
    });
  }, [notifications, markAsRead]);

  const handleConfirm = (medicationId: string) => {
    confirmMedication(medicationId);
    navigate('/');
  };

  // Get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = users.find(user => user.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

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
        <List>
          {notifications.map((notification) => (
            <Paper 
              key={notification.id} 
              elevation={1} 
              sx={{ 
                mb: 2, 
                borderLeft: notification.type === 'missed' ? '4px solid #f44336' : '4px solid #4caf50'
              }}
            >
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  {notification.type === 'missed' ? (
                    <WarningIcon color="error" />
                  ) : (
                    <NotificationsActiveIcon color="primary" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {notification.title}
                      {!notification.isRead && (
                        <Chip 
                          size="small" 
                          label="New" 
                          color="primary" 
                          sx={{ ml: 1, height: 20 }} 
                        />
                      )}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" color="text.primary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                        {notification.date} at {notification.time}
                      </Typography>
                      {(currentUser?.role === 'caregiver' || currentUser?.role === 'family') && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Patient: {getPatientName(notification.patientId)}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              
              {notification.type === 'reminder' && currentUser?.role === 'patient' && (
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleConfirm(notification.medicationId)}
                  >
                    CONFIRM MEDICATION
                  </Button>
                </Box>
              )}
            </Paper>
          ))}
        </List>
      )}
    </Layout>
  );
};

export default Notifications; 