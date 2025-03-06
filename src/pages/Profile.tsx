import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Button,
  Card,
  CardContent,
  Avatar,
  Grid,
  Switch,
  Alert
} from '@mui/material';
import { 
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { users } from '../data/mockData';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { hasPermission, requestNotificationPermission } = useNotifications();

  // Find patients for caregivers and family members
  const getPatients = () => {
    if (!currentUser || !currentUser.patients) return [];
    
    return users.filter(user => 
      currentUser.patients?.includes(user.id) && user.role === 'patient'
    );
  };

  const patients = getPatients();

  return (
    <Layout title="Profile">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Profile
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    mr: 3
                  }}
                >
                  {currentUser?.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {currentUser?.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : ''}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Username" 
                    secondary={currentUser?.username} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notifications" 
                    secondary={hasPermission ? 'Enabled' : 'Disabled'} 
                  />
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => requestNotificationPermission()}
                    disabled={hasPermission === true}
                  >
                    {hasPermission ? 'Enabled' : 'Enable'}
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Patients List (for caregivers and family members) */}
        {(currentUser?.role === 'caregiver' || currentUser?.role === 'family') && patients.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Patients
                  </Typography>
                </Box>
                
                <List>
                  {patients.map((patient) => (
                    <Paper 
                      key={patient.id} 
                      variant="outlined" 
                      sx={{ mb: 2, p: 2 }}
                    >
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <MedicalServicesIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={patient.name}
                          secondary={`Patient ID: ${patient.id}`}
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* App Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  App Settings
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive alerts for medication reminders" 
                  />
                  <Switch 
                    checked={hasPermission === true} 
                    onChange={() => requestNotificationPermission()}
                    disabled={hasPermission === true}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="SMS Notifications" 
                    secondary="Receive SMS for medication reminders" 
                  />
                  <Switch defaultChecked />
                </ListItem>
                
                {currentUser?.role === 'patient' && (
                  <ListItem>
                    <ListItemText 
                      primary="Notify Caregivers" 
                      secondary="Alert caregivers when you miss a dose" 
                    />
                    <Switch defaultChecked />
                  </ListItem>
                )}
              </List>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                This is a demo app. Settings changes are not saved.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile; 