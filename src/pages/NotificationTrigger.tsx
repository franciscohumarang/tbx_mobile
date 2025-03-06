import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar,
  SelectChangeEvent,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Send as SendIcon,
  Medication as MedicationIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { medications, users } from '../data/mockData';
import { Medication } from '../types';

// Sample medication scenarios for quick testing
const sampleMedications = [
  {
    label: "Morning Rifampicin",
    patientId: "1", // John Doe
    medicationId: "1", // Rifampicin 600mg
    type: "reminder" as const
  },
  {
    label: "Noon Pyrazinamide",
    patientId: "1", // John Doe
    medicationId: "3", // Pyrazinamide 1600mg
    type: "reminder" as const
  },
  {
    label: "Missed Medication",
    patientId: "1", // John Doe
    medicationId: "5", // Rifampicin 600mg (missed)
    type: "missed" as const
  },
  {
    label: "Patient 2 Medication",
    patientId: "3", // Michael Smith
    medicationId: "10", // Pyrazinamide 1200mg
    type: "reminder" as const
  }
];

const NotificationTrigger: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedMedication, setSelectedMedication] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'reminder' | 'missed'>('reminder');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string>('Notification sent successfully!');

  // Filter medications by selected patient
  const filteredMedications = selectedPatient 
    ? medications.filter(med => med.patientId === selectedPatient)
    : [];

  // Get patients (only those with role 'patient')
  const patients = users.filter(user => user.role === 'patient');

  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatient(event.target.value);
    setSelectedMedication(''); // Reset medication when patient changes
  };

  const handleMedicationChange = (event: SelectChangeEvent) => {
    setSelectedMedication(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setNotificationType(event.target.value as 'reminder' | 'missed');
  };

  const sendNotification = (patientId: string, medicationId: string, type: 'reminder' | 'missed', message?: string) => {
    try {
      const medication = medications.find(med => med.id === medicationId) as Medication;
      
      if (!medication) {
        setError('Selected medication not found');
        return;
      }

      // Create notification content
      const title = type === 'reminder' 
        ? 'TBX Medication Reminder' 
        : 'TBX Missed Medication Alert';
      
      const notificationMessage = message || (type === 'reminder'
        ? `Time to take ${medication.name} (${medication.dosage})`
        : `Missed dose: ${medication.name} (${medication.dosage})`);

      // Send notification to service worker
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // In a real app, this would be a call to a backend API
        // For demo purposes, we're using the Notification API directly
        
        // First, check if we have permission
        if (Notification.permission === 'granted') {
          // Create and show the notification
          const notificationOptions = {
            body: notificationMessage,
            icon: '/logo192.png',
            badge: '/logo192.png',
            data: { 
              medicationId: medication.id,
              patientId,
              type
            },
            actions: type === 'reminder' ? [
              {
                action: 'confirm',
                title: 'CONFIRM',
              },
              {
                action: 'dismiss',
                title: 'Dismiss',
              },
            ] : undefined,
          };
          
          new Notification(title, notificationOptions);
          setSuccess(true);
          setError(null);
          
          // Add to sent notifications
          setSentNotifications(prev => new Set(prev).add(medicationId));
          
          // Reset form after successful notification
          if (type === 'reminder') {
            setCustomMessage('');
          }
        } else {
          setError('Notification permission not granted. Please enable notifications in your browser.');
        }
      } else {
        setError('This browser does not support push notifications');
      }
    } catch (err) {
      setError('Failed to send notification');
      console.error(err);
    }
  };

  const handleSendNotification = () => {
    if (!selectedPatient || !selectedMedication) {
      setError('Please select both a patient and a medication');
      return;
    }

    sendNotification(selectedPatient, selectedMedication, notificationType, customMessage);
    setSuccessMessage('Notification sent successfully!');
  };

  const handleSampleNotification = (sample: typeof sampleMedications[0]) => {
    sendNotification(sample.patientId, sample.medicationId, sample.type);
    setSuccessMessage(`${sample.label} notification sent successfully!`);
  };

  // Get medication details for display
  const getMedicationDetails = (medicationId: string) => {
    const medication = medications.find(med => med.id === medicationId);
    return medication ? `${medication.name} (${medication.dosage})` : 'Unknown';
  };

  // Get patient name for display
  const getPatientName = (patientId: string) => {
    const patient = users.find(user => user.id === patientId);
    return patient ? patient.name : 'Unknown';
  };

  // Reset all sent notifications
  const handleRefresh = () => {
    setSentNotifications(new Set());
    setSuccessMessage('All notifications have been reset and are ready to be sent again!');
    setSuccess(true);
  };

  // Check if a notification has been sent
  const isNotificationSent = (medicationId: string) => {
    return sentNotifications.has(medicationId);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 0 }}>
            TBX Notification Trigger
          </Typography>
          <Tooltip title="Reset all notifications">
            <IconButton 
              color="primary" 
              onClick={handleRefresh}
              aria-label="Refresh notifications"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          This page allows you to trigger test notifications for the TBX app.
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          This is a testing tool. In a production environment, notifications would be triggered by a backend server based on medication schedules.
        </Alert>
      </Paper>

      {/* Sample Medications Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Quick Test Notifications
            </Typography>
            <Tooltip title="Click the refresh button above to reset all notifications">
              <IconButton size="small" color="info">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Send predefined notifications with a single click. {sentNotifications.size > 0 && 'Grayed out items have already been sent.'}
          </Typography>
          
          <Grid container spacing={2}>
            {sampleMedications.map((sample, index) => {
              const isSent = isNotificationSent(sample.medicationId);
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderLeft: sample.type === 'missed' ? '4px solid #f44336' : '4px solid #4caf50',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: isSent ? 0.6 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {sample.label}
                      {isSent && (
                        <Chip 
                          size="small" 
                          label="Sent" 
                          color="default" 
                          sx={{ ml: 1, height: 20 }} 
                        />
                      )}
                    </Typography>
                    
                    <Box sx={{ mb: 2, flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {getPatientName(sample.patientId)}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <MedicationIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {getMedicationDetails(sample.medicationId)}
                        </Typography>
                      </Stack>
                      
                      <Chip 
                        size="small" 
                        label={sample.type === 'reminder' ? 'Reminder' : 'Missed'} 
                        color={sample.type === 'reminder' ? 'primary' : 'error'} 
                        sx={{ mt: 1 }} 
                      />
                    </Box>
                    
                    <Button 
                      variant="contained" 
                      color={sample.type === 'reminder' ? 'primary' : 'error'} 
                      size="small"
                      onClick={() => handleSampleNotification(sample)}
                      fullWidth
                    >
                      {isSent ? 'Send Again' : 'Send Notification'}
                    </Button>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Custom Notification Form */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Custom Notification
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Create and send a custom notification.
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="patient-select-label">Patient</InputLabel>
                <Select
                  labelId="patient-select-label"
                  id="patient-select"
                  value={selectedPatient}
                  label="Patient"
                  onChange={handlePatientChange}
                >
                  <MenuItem value="">
                    <em>Select a patient</em>
                  </MenuItem>
                  {patients.map(patient => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name} (ID: {patient.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" disabled={!selectedPatient}>
                <InputLabel id="medication-select-label">Medication</InputLabel>
                <Select
                  labelId="medication-select-label"
                  id="medication-select"
                  value={selectedMedication}
                  label="Medication"
                  onChange={handleMedicationChange}
                >
                  <MenuItem value="">
                    <em>Select a medication</em>
                  </MenuItem>
                  {filteredMedications.map(medication => (
                    <MenuItem key={medication.id} value={medication.id}>
                      {medication.name} ({medication.dosage}) - {medication.time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="notification-type-label">Notification Type</InputLabel>
                <Select
                  labelId="notification-type-label"
                  id="notification-type"
                  value={notificationType}
                  label="Notification Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="reminder">Medication Reminder</MenuItem>
                  <MenuItem value="missed">Missed Medication Alert</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                id="custom-message"
                label="Custom Message (Optional)"
                multiline
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={notificationType === 'reminder' 
                  ? "Time to take your medication" 
                  : "You missed your medication dose"
                }
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SendIcon />}
            onClick={handleSendNotification}
            disabled={!selectedPatient || !selectedMedication}
          >
            Send Notification
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationTrigger; 