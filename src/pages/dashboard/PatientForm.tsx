import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Card,
  CardContent,
  Divider,

} from '@mui/material';


// Mock patient data with Filipino context
const mockPatientData = {
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
    treatmentType: 'New',
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
    ],
    emergencyAlerts: [
      {
        date: '2024-02-15',
        reaction: 'Jaundice (Hepatitis)',
        drugs: 'Metformin 500mg, Glimepiride 2mg',
        management: 'Stop anti-TB drugs and refer to specialist',
        status: 'Resolved'
      },
      {
        date: '2024-02-20',
        reaction: 'Visual impairment (Optic Neuritis)',
        drugs: 'Metformin 500mg, Glimepiride 2mg',
        management: 'Stop ethambutol and refer to ophthalmologist',
        status: 'Resolved'
      }
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
};

// Define steps for the patient details view
const steps = [
  'Basic Information',
  'Health Conditions',
  'Diagnosis & Treatment',
  'Adverse Reactions',
  'Follow-ups'
];

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  patient?: typeof mockPatientData;
}

const PatientForm: React.FC<PatientFormProps> = ({ 
  open, 
  onClose, 
  patient = mockPatientData
}) => {
  const [activeStep, setActiveStep] = React.useState(0);

  // Add debugging
  React.useEffect(() => {
    console.log("PatientForm opened with patient data:", patient);
  }, [open, patient]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };


  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Render different sections based on active step
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
                label="Surname"
                value={patient.basicInfo.surname}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Given Name"
                value={patient.basicInfo.givenName}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Middle Name"
                value={patient.basicInfo.middleName}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name Extension"
                value={patient.basicInfo.nameExtension}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age"
                value={patient.basicInfo.age}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth"
                value={patient.basicInfo.dateOfBirth}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Sex</InputLabel>
                <Select value={patient.basicInfo.sex} readOnly>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Civil Status</InputLabel>
                <Select value={patient.basicInfo.civilStatus} readOnly>
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
                value={patient.basicInfo.philHealthNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Permanent Address</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Municipality"
                value={patient.basicInfo.address.municipality}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Province"
                value={patient.basicInfo.address.province}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={patient.basicInfo.address.phoneNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={patient.basicInfo.address.smsAvailable} disabled />}
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
                <RadioGroup value={patient.healthConditions.hivStatus}>
                  <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled />} label="No" />
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
                      control={<Checkbox checked disabled />}
                      label="Data collection & sharing consent as per Data Privacy Act of 2012"
                    />
                    <FormControlLabel
                      control={<Checkbox checked disabled />}
                      label="Data encryption & secure storage consent"
                    />
                    <FormControlLabel
                      control={<Checkbox checked disabled />}
                      label="TB Case Number usage consent"
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Diabetes</Typography>
                <RadioGroup value={patient.healthConditions.diabetes}>
                  <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Renal Disease</Typography>
                <RadioGroup value={patient.healthConditions.renalDisease}>
                  <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Maintenance Medication</Typography>
              <FormControl component="fieldset">
                <Typography variant="body2">Are you currently taking medicines?</Typography>
                <RadioGroup value={patient.healthConditions.maintenanceMedication.taking}>
                  <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Current Medications"
                value={patient.healthConditions.maintenanceMedication.medications}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Health Issues</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you drink alcohol?</Typography>
                    <RadioGroup value={patient.healthConditions.healthIssues.alcohol.drinks}>
                      <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you still drink alcohol up to now?</Typography>
                    <RadioGroup value={patient.healthConditions.healthIssues.alcohol.current}>
                      <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you use cigarette (tobacco)?</Typography>
                    <RadioGroup value={patient.healthConditions.healthIssues.tobacco.uses}>
                      <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body2">Do you use cigarette (tobacco) until now?</Typography>
                    <RadioGroup value={patient.healthConditions.healthIssues.tobacco.current}>
                      <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio disabled />} label="No" />
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
                value={patient.diagnosis.tbCaseNumber}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Diagnosis Type"
                value={patient.diagnosis.diagnosisType}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Diagnosis"
                value={patient.diagnosis.dateOfDiagnosis}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="TB Disease Classification"
                value={patient.diagnosis.classification}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="TB Confirmation Type"
                value={patient.diagnosis.confirmationType}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                  label="Treatment Type"
                value={patient.diagnosis.treatmentType}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location of Treatment"
                value={patient.diagnosis.location}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Treatment History</Typography>
              <FormControl component="fieldset">
                <Typography variant="body2">Prior TB treatments?</Typography>
                <RadioGroup value={patient.diagnosis.treatmentHistory.prior}>
                  <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Previous Regimen Details"
                value={patient.diagnosis.treatmentHistory.details}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Current Treatment Regimen"
                value={patient.diagnosis.currentRegimen}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Treatment Monitoring</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Start Date"
                value={patient.diagnosis.monitoring.startDate}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Supporter Name"
                value={patient.diagnosis.monitoring.supporterName}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Treatment Supporter Contact"
                value={patient.diagnosis.monitoring.supporterContact}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DOT Status"
                value={patient.diagnosis.monitoring.dotStatus}
                InputProps={{ readOnly: true }}
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
                value={patient.adverseReactions.lastOccurrence}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Common Major Adverse Reactions</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormGroup>
                {patient.adverseReactions.reactions.map((reaction, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox checked disabled />}
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
                control={<Checkbox checked={patient.followUps.missedDose.enableAlerts} disabled />}
                label="Enable Missed Dose Alerts"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Last Missed Medication"
                value={patient.followUps.missedDose.lastMissed}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reason for Missing"
                value={patient.followUps.missedDose.reason}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Notification Settings</Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={patient.followUps.notifications.notifyPatient} disabled />}
                  label="Notify Patient (via App/SMS)"
                />
                <FormControlLabel
                  control={<Checkbox checked={patient.followUps.notifications.notifySupporter} disabled />}
                  label="Notify Treatment Supporter"
                />
                <FormControlLabel
                  control={<Checkbox checked={patient.followUps.notifications.notifyTBPeople} disabled />}
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
                value={patient.followUps.visits.scheduledDate}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Visit Date"
                value={patient.followUps.visits.lastVisit}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={patient.followUps.visits.enableAlerts} disabled />}
                label="Enable Missed Visit Alerts"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={patient.followUps.visits.requestFollowUp} disabled />}
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Patient Details: {patient?.basicInfo?.givenName} {patient?.basicInfo?.surname}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 4, mb: 2 }}>
            {patient && renderStepContent(activeStep)}
            {!patient && (
              <Typography variant="body1" align="center" color="error">
                Patient data not available. Please try again.
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? onClose : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Close' : 'Next'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PatientForm; 