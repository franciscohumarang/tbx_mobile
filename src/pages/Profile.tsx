import React, { useState } from 'react';
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
  Alert,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Checkbox
} from '@mui/material';
import { 
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Settings as SettingsIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { users } from '../data/mockData';

// Define steps for the patient profile form
const steps = [
  'Basic Information',
  'Health Conditions',
  'Diagnosis & Treatment',
  'Adverse Reactions',
  'Follow-ups'
];

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { hasPermission, requestNotificationPermission } = useNotifications();
  const [activeStep, setActiveStep] = useState(0);

  // Find patients for caregivers and family members
  const getPatients = () => {
    if (!currentUser || !currentUser.patients) return [];
    
    return users.filter(user => 
      currentUser.patients?.includes(user.id) && user.role === 'patient'
    );
  };

  const patients = getPatients();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Render different form sections based on active step
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Surname"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Given Name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Middle Name"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name Extension"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Sex</InputLabel>
                <Select label="Sex">
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Civil Status</InputLabel>
                <Select label="Civil Status">
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                  <MenuItem value="divorced">Divorced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="PhilHealth Number"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Permanent Address</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Municipality"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Province"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox />}
                label="SMS Available"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Health Conditions</Typography>
            </Grid>
            
            {/* HIV Section */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">HIV Status</Typography>
                <RadioGroup row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Consent & Confidentiality
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="I consent to data collection & sharing as per Data Privacy Act of 2012"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="I understand my data will be encrypted & securely stored"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="I agree to the use of TB Case Number instead of Name for privacy"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            {/* Other Health Conditions */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Diabetes</Typography>
                <RadioGroup row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Renal Disease</Typography>
                <RadioGroup row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Maintenance Medication */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Maintenance Medication</Typography>
              <FormControl component="fieldset">
                <Typography variant="body2">Are you currently taking medicines?</Typography>
                <RadioGroup row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Current Medications"
              />
              <Button variant="outlined" sx={{ mt: 1 }}>
                Upload Prescription
              </Button>
            </Grid>

            {/* Health Issues */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Health Issues</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you drink alcohol?</Typography>
                    <RadioGroup row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you still drink alcohol up to now?</Typography>
                    <RadioGroup row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you use cigarette (tobacco)?</Typography>
                    <RadioGroup row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you use cigarette (tobacco) until now?</Typography>
                    <RadioGroup row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Have you taken illicit drug use (e.g. methamphetamine/shabu)?</Typography>
                    <RadioGroup row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Have you taken illicit drug use until now?</Typography>
                    <RadioGroup row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Diagnosis & Treatment Details</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="TB/TPT Case Number"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Diagnosis Type</InputLabel>
                <Select label="Diagnosis Type">
                  <MenuItem value="TB Disease">TB Disease</MenuItem>
                  <MenuItem value="TB Infection">TB Infection</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Diagnosis"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>TB Disease Classification</InputLabel>
                <Select label="TB Disease Classification">
                  <MenuItem value="Pulmonary">Pulmonary</MenuItem>
                  <MenuItem value="Extra-pulmonary">Extra-pulmonary</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>TB Confirmation Type</InputLabel>
                <Select label="TB Confirmation Type">
                  <MenuItem value="Bacteriologically-confirmed">Bacteriologically-confirmed</MenuItem>
                  <MenuItem value="Clinically-diagnosed">Clinically-diagnosed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Treatment Type</InputLabel>
                <Select label="Treatment Type">
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Retreatment">Retreatment</MenuItem>
                  <MenuItem value="Drug-susceptible TB">Drug-susceptible TB</MenuItem>
                  <MenuItem value="Drug-resistant TB">Drug-resistant TB</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Location of Treatment</InputLabel>
                <Select label="Location of Treatment">
                  <MenuItem value="Facility-based">Facility-based</MenuItem>
                  <MenuItem value="Community-based">Community-based</MenuItem>
                  <MenuItem value="Home-based">Home-based</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Treatment History</Typography>
              <FormControl component="fieldset">
                <Typography variant="body2">Prior TB treatments?</Typography>
                <RadioGroup row>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Previous Regimen Details"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Current Treatment Regimen"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Treatment Monitoring</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Start Date"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Supporter Name"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Supporter Contact"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>DOT Status</InputLabel>
                <Select label="DOT Status">
                  <MenuItem value="Self-administered">Self-administered</MenuItem>
                  <MenuItem value="Treatment Supporter Supervised">Treatment Supporter Supervised</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Medication History"
                helperText="e.g., Drug Holiday, Rechallenge, Hold status"
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Adverse Drug Reactions (ADR) Reporting</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of ADR Occurrence"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Common Major Adverse Reactions</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Severe skin rash (Hypersensitivity) – Stop drugs, refer to specialist"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Jaundice (Hepatitis) – Monitor liver function, refer specialist"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Visual impairment (Optic Neuritis) – Stop Ethambutol, refer ophthalmologist"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Renal disorder (Oliguria/Albuminuria) – Stop Rifampicin, refer specialist"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Psychosis & Convulsions – Stop Isoniazid, refer specialist"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Thrombocytopenia/Anemia/Shock – Stop Rifampicin, refer specialist"
                />
              </FormGroup>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Missed Medication & Follow-ups</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Enable Missed Dose Alerts"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Last Missed Medication"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reason for Missed Dose</InputLabel>
                <Select label="Reason for Missed Dose">
                  <MenuItem value="forgot">Patient forgot</MenuItem>
                  <MenuItem value="side-effects">Side Effects</MenuItem>
                  <MenuItem value="no-access">No access to medication</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Notification Settings</Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Notify Patient (via App/SMS)"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Notify Treatment Supporter"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Notify TBPeople Philippines (for escalation)"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Healthcare Provider Visit Tracking</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Scheduled Visit Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Last Visit"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Enable Missed Visit Alerts"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Request Follow-up"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

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

        {/* Patient Profile Form */}
        {currentUser?.role === 'patient' && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ pb: { xs: 2, sm: 2 } }}>
                <Box sx={{ width: '100%' }}>
                  <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    sx={{ 
                      position: 'sticky',
                      top: 0,
                      backgroundColor: 'white',
                      zIndex: 2,
                      pb: 2
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  <Box sx={{ mt: 4, mb: 2 }}>
                    {renderStepContent(activeStep)}
                  </Box>

                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      pt: 2,
                      position: 'sticky',
                      bottom: 0,
                      backgroundColor: 'white',
                      zIndex: 2,
                      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                      mt: 2
                    }}
                  >
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<NavigateBeforeIcon />}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={activeStep === steps.length - 1 ? () => {} : handleNext}
                      endIcon={activeStep === steps.length - 1 ? undefined : <NavigateNextIcon />}
                    >
                      {activeStep === steps.length - 1 ? 'Save' : 'Next'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

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