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

// Patient data with Filipino context
const patientData = {
  'Juan Dela Cruz': {
    basicInfo: {
      surname: 'Dela Cruz',
      givenName: 'Juan',
      middleName: 'Santos',
      nameExtension: 'Jr.',
      age: 45,
      dateOfBirth: '1979-03-15',
      sex: 'M',
      civilStatus: 'married',
      philHealthNumber: '01-234567890-1',
      address: {
        municipality: 'Quezon City',
        province: 'Metro Manila',
        phoneNumber: '09123456789',
        smsAvailable: true
      }
    },
    healthConditions: {
      hivStatus: 'no',
      diabetes: 'yes',
      renalDisease: 'no',
      maintenanceMedication: {
        taking: 'yes',
        medications: 'Metformin 500mg, Glimepiride 2mg'
      },
      healthIssues: {
        alcohol: {
          drinks: 'yes',
          current: 'no'
        },
        tobacco: {
          uses: 'yes',
          current: 'no'
        },
        illicitDrugs: {
          used: 'no',
          current: 'no'
        }
      }
    },
    diagnosis: {
      tbCaseNumber: 'TB-2024-001',
      diagnosisType: 'TB Disease',
      dateOfDiagnosis: '2024-01-15',
      classification: 'Pulmonary',
      confirmationType: 'Bacteriologically-confirmed',
      treatmentType: 'A',
      location: 'Facility-based',
      treatmentHistory: {
        prior: 'no',
        details: ''
      },
      currentRegimen: 'HRZE Fixed-dose combination',
      monitoring: {
        startDate: '2024-01-20',
        supporterName: 'Maria Santos',
        supporterContact: '09187654321',
        dotStatus: 'Treatment Supporter Supervised'
      }
    },
    adverseReactions: {
      lastOccurrence: '2024-02-10',
      reactions: [
        'Jaundice (Hepatitis)',
        'Visual impairment (Optic Neuritis)'
      ]
    },
    followUps: {
      missedDose: {
        enableAlerts: true,
        lastMissed: '2024-02-05',
        reason: 'forgot'
      },
      notifications: {
        notifyPatient: true,
        notifySupporter: true,
        notifyTBPeople: false
      },
      visits: {
        scheduledDate: '2024-03-20',
        lastVisit: '2024-02-20',
        enableAlerts: true,
        requestFollowUp: false
      }
    }
  },
  'Alice Smith': {
    basicInfo: {
      surname: 'Smith',
      givenName: 'Alice',
      middleName: '',
      nameExtension: '',
      age: 35,
      dateOfBirth: '1989-05-20',
      sex: 'F',
      civilStatus: 'single',
      philHealthNumber: '01-987654321-2',
      address: {
        municipality: 'Makati City',
        province: 'Metro Manila',
        phoneNumber: '09198765432',
        smsAvailable: true
      }
    },
    healthConditions: {
      hivStatus: 'no',
      diabetes: 'no',
      renalDisease: 'no',
      maintenanceMedication: {
        taking: 'no',
        medications: ''
      },
      healthIssues: {
        alcohol: {
          drinks: 'no',
          current: 'no'
        },
        tobacco: {
          uses: 'no',
          current: 'no'
        },
        illicitDrugs: {
          used: 'no',
          current: 'no'
        }
      }
    },
    diagnosis: {
      tbCaseNumber: 'TB-2024-002',
      diagnosisType: 'TB Disease',
      dateOfDiagnosis: '2024-02-10',
      classification: 'Pulmonary',
      confirmationType: 'Bacteriologically-confirmed',
      treatmentType: 'B',
      location: 'Facility-based',
      treatmentHistory: {
        prior: 'no',
        details: ''
      },
      currentRegimen: 'HRZE Fixed-dose combination',
      monitoring: {
        startDate: '2024-02-10',
        supporterName: 'Treatment Supporter',
        supporterContact: '09187654321',
        dotStatus: 'Treatment Supporter Supervised'
      }
    },
    adverseReactions: {
      lastOccurrence: '',
      reactions: []
    },
    followUps: {
      missedDose: {
        enableAlerts: true,
        lastMissed: '',
        reason: ''
      },
      notifications: {
        notifyPatient: true,
        notifySupporter: true,
        notifyTBPeople: false
      },
      visits: {
        scheduledDate: '2024-03-25',
        lastVisit: '2024-02-10',
        enableAlerts: true,
        requestFollowUp: false
      }
    }
  }
};

// Add type definition before the Profile component
type PatientDataType = typeof patientData;
type PatientNames = keyof PatientDataType;

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
  const [formData, setFormData] = useState(currentUser?.name ? patientData[currentUser.name as PatientNames] : null);

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
    if (!formData) return null;

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
                value={formData.basicInfo.surname}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Given Name"
                value={formData.basicInfo.givenName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Middle Name"
                value={formData.basicInfo.middleName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name Extension"
                value={formData.basicInfo.nameExtension}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.basicInfo.age}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.basicInfo.dateOfBirth}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Sex</InputLabel>
                <Select label="Sex" value={formData.basicInfo.sex}>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Civil Status</InputLabel>
                <Select label="Civil Status" value={formData.basicInfo.civilStatus}>
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
                value={formData.basicInfo.philHealthNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Permanent Address</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Municipality"
                value={formData.basicInfo.address.municipality}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Province"
                value={formData.basicInfo.address.province}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.basicInfo.address.phoneNumber}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={formData.basicInfo.address.smsAvailable} />}
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
            
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">HIV Status</Typography>
                <RadioGroup row value={formData.healthConditions.hivStatus}>
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
                      control={<Checkbox checked />}
                      label="I consent to data collection & sharing as per Data Privacy Act of 2012"
                    />
                    <FormControlLabel
                      control={<Checkbox checked />}
                      label="I understand my data will be encrypted & securely stored"
                    />
                    <FormControlLabel
                      control={<Checkbox checked />}
                      label="I agree to the use of TB Case Number instead of Name for privacy"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Diabetes</Typography>
                <RadioGroup row value={formData.healthConditions.diabetes}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Renal Disease</Typography>
                <RadioGroup row value={formData.healthConditions.renalDisease}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Maintenance Medication</Typography>
              <FormControl component="fieldset">
                <Typography variant="body2">Are you currently taking medicines?</Typography>
                <RadioGroup row value={formData.healthConditions.maintenanceMedication.taking}>
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
                value={formData.healthConditions.maintenanceMedication.medications}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Health Issues</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you drink alcohol?</Typography>
                    <RadioGroup row value={formData.healthConditions.healthIssues.alcohol.drinks}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you still drink alcohol up to now?</Typography>
                    <RadioGroup row value={formData.healthConditions.healthIssues.alcohol.current}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you use cigarette (tobacco)?</Typography>
                    <RadioGroup row value={formData.healthConditions.healthIssues.tobacco.uses}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you use cigarette (tobacco) until now?</Typography>
                    <RadioGroup row value={formData.healthConditions.healthIssues.tobacco.current}>
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
                value={formData.diagnosis.tbCaseNumber}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Diagnosis Type</InputLabel>
                <Select label="Diagnosis Type" value={formData.diagnosis.diagnosisType}>
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
                value={formData.diagnosis.dateOfDiagnosis}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>TB Disease Classification</InputLabel>
                <Select label="TB Disease Classification" value={formData.diagnosis.classification}>
                  <MenuItem value="Pulmonary">Pulmonary</MenuItem>
                  <MenuItem value="Extra-pulmonary">Extra-pulmonary</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>TB Confirmation Type</InputLabel>
                <Select label="TB Confirmation Type" value={formData.diagnosis.confirmationType}>
                  <MenuItem value="Bacteriologically-confirmed">Bacteriologically-confirmed</MenuItem>
                  <MenuItem value="Clinically-diagnosed">Clinically-diagnosed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Treatment Type</InputLabel>
                <Select label="Treatment Type" value={formData.diagnosis.treatmentType}>
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
                <Select label="Location of Treatment" value={formData.diagnosis.location}>
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
                <RadioGroup row value={formData.diagnosis.treatmentHistory.prior}>
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
                value={formData.diagnosis.treatmentHistory.details}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Current Treatment Regimen"
                value={formData.diagnosis.currentRegimen}
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
                value={formData.diagnosis.monitoring.startDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Supporter Name"
                value={formData.diagnosis.monitoring.supporterName}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Supporter Contact"
                value={formData.diagnosis.monitoring.supporterContact}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>DOT Status</InputLabel>
                <Select label="DOT Status" value={formData.diagnosis.monitoring.dotStatus}>
                  <MenuItem value="Self-administered">Self-administered</MenuItem>
                  <MenuItem value="Treatment Supporter Supervised">Treatment Supporter Supervised</MenuItem>
                </Select>
              </FormControl>
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
                value={formData.adverseReactions.lastOccurrence}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Common Major Adverse Reactions</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                {formData.adverseReactions.reactions.map((reaction, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox checked />}
                    label={reaction}
                  />
                ))}
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
                control={<Switch checked={formData.followUps.missedDose.enableAlerts} />}
                label="Enable Missed Dose Alerts"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Last Missed Medication"
                type="date"
                value={formData.followUps.missedDose.lastMissed}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reason for Missed Dose</InputLabel>
                <Select label="Reason for Missed Dose" value={formData.followUps.missedDose.reason}>
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
                  control={<Checkbox checked={formData.followUps.notifications.notifyPatient} />}
                  label="Notify Patient (via App/SMS)"
                />
                <FormControlLabel
                  control={<Checkbox checked={formData.followUps.notifications.notifySupporter} />}
                  label="Notify Treatment Supporter"
                />
                <FormControlLabel
                  control={<Checkbox checked={formData.followUps.notifications.notifyTBPeople} />}
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
                value={formData.followUps.visits.scheduledDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Last Visit"
                type="date"
                value={formData.followUps.visits.lastVisit}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={formData.followUps.visits.enableAlerts} />}
                label="Enable Missed Visit Alerts"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={formData.followUps.visits.requestFollowUp} />}
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