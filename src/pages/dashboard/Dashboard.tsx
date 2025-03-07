import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Chip,
  Drawer,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Medication as MedicationIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon,
  ReportProblem as ReportProblemIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PatientForm from './PatientForm';
import PatientADRView from './PatientADRView';
import MedicationForm from './MedicationForm';

// Mock data for the dashboard
const adherenceData = [
  { name: 'Adherent', value: 75, color: '#4caf50' },
  { name: 'Missed', value: 15, color: '#f44336' },
  { name: 'Pending', value: 10, color: '#ff9800' },
];

// Export treatmentTypes for use in PatientForm
export const treatmentTypes = [
  { id: 'A', name: 'Treatment A', medications: ['Pyrazinamide', 'Ethambutol', 'Rifampicin'] },
  { id: 'B', name: 'Treatment B', medications: ['Isoniazid', 'Rifampicin', 'Ethambutol'] },
  { id: 'C', name: 'Treatment C', medications: ['Pyrazinamide', 'Isoniazid', 'Rifabutin'] },
];

const patientData = [
  { 
    id: '1', 
    name: 'Juan Dela Cruz', 
    treatmentType: 'A',
    adherenceRate: 85,
    missedDoses: 3,
    confirmedDoses: 17,
    pendingDoses: 2,
    startDate: '2023-01-15',
    nextAppointment: '2023-06-20'
  },
  { 
    id: '3', 
    name: 'Alice Smith', 
    treatmentType: 'B',
    adherenceRate: 65,
    missedDoses: 7,
    confirmedDoses: 13,
    pendingDoses: 0,
    startDate: '2023-02-10',
    nextAppointment: '2023-06-25'
  }
];

const medicationData = [
  { id: '1', name: 'Pyrazinamide', dosage: '500mg', frequency: 'Daily', patients: 15 },
  { id: '2', name: 'Ethambutol', dosage: '400mg', frequency: 'Daily', patients: 12 },
  { id: '3', name: 'Rifampicin', dosage: '600mg', frequency: 'Daily', patients: 18 },
  { id: '4', name: 'Isoniazid', dosage: '300mg', frequency: 'Daily', patients: 10 },
  { id: '5', name: 'Rifabutin', dosage: '150mg', frequency: 'Daily', patients: 5 },
];

const weeklyAdherenceData = [
  { name: 'Week 1', adherent: 90, missed: 10 },
  { name: 'Week 2', adherent: 85, missed: 15 },
  { name: 'Week 3', adherent: 75, missed: 25 },
  { name: 'Week 4', adherent: 80, missed: 20 },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [medicationFormOpen, setMedicationFormOpen] = useState(false);
  const [patients] = useState(patientData);
  const [medications] = useState(medicationData);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // Add state for ADR view
  const [adrViewOpen, setAdrViewOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<any>(null);
  
  // Add state for tracking submitted adverse reactions
  const [submittedReactions] = useState<any[]>([
    {
      patientId: '1',
      patientName: 'Juan Dela Cruz',
      date: '2024-02-10',
      reaction: 'Jaundice due to hepatitis',
      drugs: 'Isoniazid, Rifampicin',
      management: 'Stopped anti-TB drugs, referred to specialist',
      status: 'Resolved',
      isEmergency: true
    },
    {
      patientId: '3',
      patientName: 'Alice Smith',
      date: '2024-01-25',
      reaction: 'Visual impairment due to optic neuritis',
      drugs: 'Ethambutol',
      management: 'Stopped Ethambutol, referred to ophthalmologist',
      status: 'Ongoing monitoring',
      isEmergency: false
    }
  ]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate('/dashboard/login');
  };

  

  
  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          component="img"
          src="/tbx-title.png"
          alt="TBX Logo"
          sx={{ height: 40, width: 'auto', mr: 1 }}
        />
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      <List>
        <ListItem 
          sx={{ 
            cursor: 'pointer',
            bgcolor: tabValue === 0 ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
          onClick={() => {
            setTabValue(0);
            if (mobileOpen) setMobileOpen(false);
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'transparent' }}>
              <DashboardIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem 
          sx={{ 
            cursor: 'pointer',
            bgcolor: tabValue === 1 ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
          onClick={() => {
            setTabValue(1);
            if (mobileOpen) setMobileOpen(false);
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'transparent' }}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Patients" />
        </ListItem>
        <ListItem 
          sx={{ 
            cursor: 'pointer',
            bgcolor: tabValue === 2 ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
          onClick={() => {
            setTabValue(2);
            if (mobileOpen) setMobileOpen(false);
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'transparent' }}>
              <MedicationIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Medications" />
        </ListItem>
        <ListItem 
          sx={{ 
            cursor: 'pointer',
            bgcolor: tabValue === 3 ? 'rgba(255,255,255,0.1)' : 'transparent'
          }}
          onClick={() => {
            setTabValue(3);
            if (mobileOpen) setMobileOpen(false);
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'transparent' }}>
              <ReportProblemIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Adverse Reactions" />
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          sx={{ color: 'white', borderColor: 'white' }}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar for mobile */}
      <Box
        component="nav"
        sx={{
          width: { sm: 240 },
          flexShrink: 0,
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Button
            sx={{ mr: 2, color: 'white' }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon sx={{ color: 'white' }} />
          </Button>
          <Box
            component="img"
            src="/tbx-title.png"
            alt="TBX Logo"
            sx={{ height: 32, width: 'auto' }}
          />
        </Box>
      </Box>

      {/* Sidebar for desktop */}
      <Box
        component="nav"
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: 'primary.main',
          color: 'white',
          display: { xs: 'none', sm: 'block' },
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000
        }}
      >
        {drawer}
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            bgcolor: 'primary.main',
            color: 'white',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: '#f5f5f5', 
          p: 3,
          mt: { xs: 7, sm: 0 }, 
          marginLeft: { xs: 0, sm: '240px' },
          width: { xs: '100%', sm: 'calc(100% - 240px)' },
          boxSizing: 'border-box'
        }}
      >
        {/* Dashboard Overview */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to the TB Management Dashboard. Here's an overview of patient adherence and treatment statistics.
          </Typography>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4, mx: 0, width: '100%' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Total Patients
                  </Typography>
                  <Typography variant="h3">
                    {patients.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active in treatment
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Overall Adherence
                  </Typography>
                  <Typography variant="h3">
                    75%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across all patients
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Doses Confirmed
                  </Typography>
                  <Typography variant="h3">
                    30
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Doses Missed
                  </Typography>
                  <Typography variant="h3">
                    10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last 7 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mx: 0, width: '100%' }}>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PieChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Overall Adherence Rate
                  </Typography>
                </Box>
                <Box sx={{ height: { xs: 250, md: 300 }, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ width: '100%' }}>
                    {adherenceData.map((item) => (
                      <Box key={item.name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">{item.name}</Typography>
                          <Typography variant="body1" fontWeight="bold">{item.value}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.value} 
                          sx={{ height: 10, borderRadius: 5, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: item.color } }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Weekly Adherence Trend
                  </Typography>
                </Box>
                <Box sx={{ height: { xs: 250, md: 300 }, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ width: '100%' }}>
                    {weeklyAdherenceData.map((item) => (
                      <Box key={item.name} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>{item.name}</Typography>
                        <Box sx={{ display: 'flex', width: '100%', height: 24 }}>
                          <Box 
                            sx={{ 
                              width: `${item.adherent}%`, 
                              bgcolor: '#4caf50', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          >
                            {item.adherent}%
                          </Box>
                          <Box 
                            sx={{ 
                              width: `${item.missed}%`, 
                              bgcolor: '#f44336',
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          >
                            {item.missed}%
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Patients Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
              Patient Management
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            View and manage patient records, treatment plans, and adherence statistics.
          </Typography>

       

          <Grid container spacing={3} sx={{ mx: 0, width: '100%' }}>
            {patients.map((patient) => (
              <Grid item xs={12} lg={6} key={patient.id}>
                <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{patient.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Patient ID: {patient.id}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`Treatment ${patient.treatmentType}`} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Adherence Rate
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={patient.adherenceRate} 
                            color={patient.adherenceRate > 80 ? "success" : patient.adherenceRate > 60 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{`${patient.adherenceRate}%`}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Treatment Start Date
                      </Typography>
                      <Typography variant="body1">
                        {patient.startDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Confirmed Doses
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 0.5, fontSize: 20 }} />
                        {patient.confirmedDoses}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Missed Doses
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                        <ErrorIcon sx={{ mr: 0.5, fontSize: 20 }} />
                        {patient.missedDoses}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Pending Doses
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'warning.main', display: 'flex', alignItems: 'center' }}>
                        <WarningIcon sx={{ mr: 0.5, fontSize: 20 }} />
                        {patient.pendingDoses}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 0 } }}>
                      Next Appointment: <strong>{patient.nextAppointment}</strong>
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => {
                        setSelectedPatient({
                          basicInfo: {
                            surname: patient.name.split(' ')[1],
                            givenName: patient.name.split(' ')[0],
                            middleName: '',
                            nameExtension: '',
                            age: 45,
                            dateOfBirth: patient.startDate,
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
                            diabetes: 'no',
                            renalDisease: 'no',
                            maintenanceMedication: {
                              taking: 'no',
                              medications: ''
                            },
                            healthIssues: {
                              alcohol: { drinks: 'no', current: 'no' },
                              tobacco: { uses: 'no', current: 'no' },
                              illicitDrugs: { used: 'no', current: 'no' }
                            }
                          },
                          diagnosis: {
                            tbCaseNumber: patient.id,
                            diagnosisType: 'TB Disease',
                            dateOfDiagnosis: patient.startDate,
                            classification: 'Pulmonary',
                            confirmationType: 'Bacteriologically-confirmed',
                            treatmentType: patient.treatmentType,
                            location: 'Facility-based',
                            treatmentHistory: { prior: 'no', details: '' },
                            currentRegimen: 'HRZE Fixed-dose combination',
                            monitoring: {
                              startDate: patient.startDate,
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
                              scheduledDate: patient.nextAppointment,
                              lastVisit: patient.startDate,
                              enableAlerts: true,
                              requestFollowUp: false
                            }
                          }
                        });
                        setPatientFormOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Medications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
              Medication Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setMedicationFormOpen(true)}
            >
              Add New Medication
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage medications, dosages, and treatment plans.
          </Typography>

          <Paper sx={{ mb: 4 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Treatment Types
              </Typography>
              <Grid container spacing={3} sx={{ mx: 0, width: '100%' }}>
                {treatmentTypes.map((treatment) => (
                  <Grid item xs={12} sm={6} md={4} key={treatment.id}>
                    <Card variant="outlined">
                      <CardHeader 
                        title={treatment.name} 
                        subheader={`Treatment Type ${treatment.id}`}
                      />
                      <Divider />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Medications:
                        </Typography>
                        <List dense>
                          {treatment.medications.map((med, index) => (
                            <ListItem key={index}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                  <MedicationIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={med} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>

          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Medication List
              </Typography>
              <Grid container spacing={2} sx={{ mx: 0, width: '100%' }}>
                {medications.map((medication) => (
                  <Grid item xs={12} sm={6} md={4} key={medication.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {medication.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dosage: {medication.dosage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Frequency: {medication.frequency}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>{medication.patients}</strong> patients currently prescribed
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </TabPanel>

        {/* Adverse Reactions Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
              Adverse Reactions Summary
            </Typography>
            <Chip 
              label={`${submittedReactions.length} Total Reports`} 
              color="primary" 
              variant="outlined" 
              sx={{ fontSize: '1rem', py: 0.5, px: 1 }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>
            Overview of adverse drug reactions reported by patients. Click on a patient to view full details.
          </Typography>

          <Paper sx={{ mb: 4 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <WarningIcon color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Emergency Alerts
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                High-priority adverse reactions requiring immediate attention.
              </Typography>
              
              {submittedReactions.filter(r => r.isEmergency).length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Patient</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Reaction</strong></TableCell>
                        <TableCell><strong>Drugs</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submittedReactions
                        .filter(r => r.isEmergency)
                        .map((reaction, index) => (
                          <TableRow key={index}>
                            <TableCell>{reaction.patientName}</TableCell>
                            <TableCell>{reaction.date}</TableCell>
                            <TableCell>{reaction.reaction}</TableCell>
                            <TableCell>{reaction.drugs}</TableCell>
                            <TableCell>
                              <Chip 
                                label={reaction.status} 
                                color={reaction.status === 'Resolved' ? "success" : "error"} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="small" 
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  // Find the patient by ID
                                  const patient = patients.find(p => p.id === reaction.patientId);
                                  if (patient) {
                                    // Create patient data object for the form
                                    const patientData = {
                                      basicInfo: {
                                        surname: patient.name.split(' ')[1] || '',
                                        givenName: patient.name.split(' ')[0] || '',
                                        middleName: '',
                                        nameExtension: '',
                                        age: 45,
                                        dateOfBirth: patient.startDate,
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
                                        diabetes: 'no',
                                        renalDisease: 'no',
                                        maintenanceMedication: {
                                          taking: 'no',
                                          medications: ''
                                        },
                                        healthIssues: {
                                          alcohol: { drinks: 'no', current: 'no' },
                                          tobacco: { uses: 'no', current: 'no' },
                                          illicitDrugs: { used: 'no', current: 'no' }
                                        }
                                      },
                                      diagnosis: {
                                        tbCaseNumber: patient.id,
                                        diagnosisType: 'TB Disease',
                                        dateOfDiagnosis: patient.startDate,
                                        classification: 'Pulmonary',
                                        confirmationType: 'Bacteriologically-confirmed',
                                        treatmentType: patient.treatmentType,
                                        location: 'Facility-based',
                                        treatmentHistory: { prior: 'no', details: '' },
                                        currentRegimen: 'HRZE Fixed-dose combination',
                                        monitoring: {
                                          startDate: patient.startDate,
                                          supporterName: 'Treatment Supporter',
                                          supporterContact: '09187654321',
                                          dotStatus: 'Treatment Supporter Supervised'
                                        }
                                      },
                                      adverseReactions: {
                                        lastOccurrence: reaction.date,
                                        reactions: [reaction.reaction],
                                        emergencyAlerts: [{
                                          date: reaction.date,
                                          reaction: reaction.reaction,
                                          drugs: reaction.drugs || 'Unknown',
                                          management: reaction.management || 'Pending review',
                                          status: reaction.status
                                        }]
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
                                          scheduledDate: patient.nextAppointment,
                                          lastVisit: patient.startDate,
                                          enableAlerts: true,
                                          requestFollowUp: false
                                        }
                                      }
                                    };
                                    
                                    // Set the selected patient and reaction, then open the ADR view
                                    setSelectedPatient(patientData);
                                    setSelectedReaction(reaction);
                                    setAdrViewOpen(true);
                                  } else {
                                    alert("Patient information not found. Please try again.");
                                  }
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  No emergency alerts reported.
                </Typography>
              )}
            </Box>
          </Paper>

          <Paper>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                All Reported Reactions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Complete list of adverse reactions reported by patients.
              </Typography>
              
              {submittedReactions.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Patient</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Reaction</strong></TableCell>
                        <TableCell><strong>Drugs</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submittedReactions.map((reaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{reaction.patientName}</TableCell>
                          <TableCell>{reaction.date}</TableCell>
                          <TableCell>{reaction.reaction}</TableCell>
                          <TableCell>{reaction.drugs}</TableCell>
                          <TableCell>
                            <Chip 
                              label={reaction.status} 
                              color={reaction.isEmergency ? "error" : 
                                    reaction.status === 'Resolved' ? "success" : "warning"} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                // Find the patient by ID
                                const patient = patients.find(p => p.id === reaction.patientId);
                                if (patient) {
                                  // Create patient data object for the form
                                  const patientData = {
                                    basicInfo: {
                                      surname: patient.name.split(' ')[1] || '',
                                      givenName: patient.name.split(' ')[0] || '',
                                      middleName: '',
                                      nameExtension: '',
                                      age: 45,
                                      dateOfBirth: patient.startDate,
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
                                      diabetes: 'no',
                                      renalDisease: 'no',
                                      maintenanceMedication: {
                                        taking: 'no',
                                        medications: ''
                                      },
                                      healthIssues: {
                                        alcohol: { drinks: 'no', current: 'no' },
                                        tobacco: { uses: 'no', current: 'no' },
                                        illicitDrugs: { used: 'no', current: 'no' }
                                      }
                                    },
                                    diagnosis: {
                                      tbCaseNumber: patient.id,
                                      diagnosisType: 'TB Disease',
                                      dateOfDiagnosis: patient.startDate,
                                      classification: 'Pulmonary',
                                      confirmationType: 'Bacteriologically-confirmed',
                                      treatmentType: patient.treatmentType,
                                      location: 'Facility-based',
                                      treatmentHistory: { prior: 'no', details: '' },
                                      currentRegimen: 'HRZE Fixed-dose combination',
                                      monitoring: {
                                        startDate: patient.startDate,
                                        supporterName: 'Treatment Supporter',
                                        supporterContact: '09187654321',
                                        dotStatus: 'Treatment Supporter Supervised'
                                      }
                                    },
                                    adverseReactions: {
                                      lastOccurrence: reaction.date,
                                      reactions: [reaction.reaction],
                                      emergencyAlerts: [{
                                        date: reaction.date,
                                        reaction: reaction.reaction,
                                        drugs: reaction.drugs || 'Unknown',
                                        management: reaction.management || 'Pending review',
                                        status: reaction.status
                                      }]
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
                                        scheduledDate: patient.nextAppointment,
                                        lastVisit: patient.startDate,
                                        enableAlerts: true,
                                        requestFollowUp: false
                                      }
                                    }
                                  };
                                  
                                  // Set the selected patient and reaction, then open the ADR view
                                  setSelectedPatient(patientData);
                                  setSelectedReaction(reaction);
                                  setAdrViewOpen(true);
                                } else {
                                  alert("Patient information not found. Please try again.");
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  No adverse reactions reported yet.
                </Typography>
              )}
            </Box>
          </Paper>
        </TabPanel>
      </Box>

      {/* Forms */}
      <PatientForm 
        open={patientFormOpen} 
        onClose={() => {
          console.log("Closing PatientForm");
          setPatientFormOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
      <PatientADRView
        open={adrViewOpen}
        onClose={() => {
          console.log("Closing ADR View");
          setAdrViewOpen(false);
          setSelectedPatient(null);
          setSelectedReaction(null);
        }}
        patient={selectedPatient}
        reaction={selectedReaction}
      />
      <MedicationForm 
        open={medicationFormOpen} 
        onClose={() => setMedicationFormOpen(false)} 
      />
    </Box>
  );
};

export default Dashboard; 