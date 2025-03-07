import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Warning as WarningIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
 

// Sample adverse reactions data
const adverseReactions = [
  {
    id: 1,
    name: 'Severe skin rash due to hypersensitivity',
    drugs: 'Any of the drugs',
    management: 'Stop anti-TB drugs and refer to specialist'
  },
  {
    id: 2,
    name: 'Jaundice due to hepatitis',
    drugs: 'Any of the drugs (especially isoniazid, rifampicin, pyrazinamide)',
    management: 'Stop anti-TB drugs and refer to specialist; if symptoms subside, resume treatment and monitor clinically'
  },
  {
    id: 3,
    name: 'Impairment of visual acuity and color vision due to optic neuritis',
    drugs: 'Ethambutol',
    management: 'Stop ethambutol and refer to ophthalmologist'
  },
  {
    id: 4,
    name: 'Oliguria or albuminuria due to renal disorder',
    drugs: 'Rifampicin',
    management: 'Stop anti-TB drugs and refer to specialist'
  },
  {
    id: 5,
    name: 'Psychosis and convulsion',
    drugs: 'Isoniazid',
    management: 'Stop isoniazid and refer to specialist'
  },
  {
    id: 6,
    name: 'Thrombocytopenia, anemia, shock',
    drugs: 'Rifampicin',
    management: 'Stop anti-TB drugs and refer to specialist'
  }
];

// Sample reported reactions
const initialReportedReactions = [
  {
    id: 1,
    date: '2024-02-10',
    reaction: 'Jaundice due to hepatitis',
    status: 'Resolved',
    isEmergency: true
  },
  {
    id: 2,
    date: '2024-01-25',
    reaction: 'Visual impairment due to optic neuritis',
    status: 'Ongoing monitoring',
    isEmergency: false
  }
];

const ADR: React.FC = () => {
  
  const [reportedReactions, setReportedReactions] = useState(initialReportedReactions);

  const handleEmergencyAlert = () => {
    if (window.confirm('This will send an EMERGENCY ALERT for severe side effects to your caregiver, treatment supporter, and TBPeople Philippines. Continue?')) {
      const today = new Date().toISOString().split('T')[0];
      const newReaction = {
        id: reportedReactions.length + 1,
        date: today,
        reaction: 'Emergency: Severe adverse reaction',
        status: 'Reported',
        isEmergency: true
      };
      
      setReportedReactions([newReaction, ...reportedReactions]);
      alert('EMERGENCY ALERT sent to your caregiver, treatment supporter, and TBPeople Philippines.');
    }
  };

  const handleReportReaction = (reaction: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newReaction = {
      id: reportedReactions.length + 1,
      date: today,
      reaction,
      status: 'Reported',
      isEmergency: false
    };
    
    setReportedReactions([newReaction, ...reportedReactions]);
    alert(`Reaction reported: ${reaction}`);
  };

  return (
    <Layout title="Adverse Drug Reactions">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Adverse Drug Reactions (ADR)
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Report and manage adverse drug reactions. Use the emergency button for severe side effects.
        </Typography>
        
        <Button
          variant="contained"
          color="error"
          fullWidth
          size="large"
          startIcon={<WarningIcon />}
          onClick={handleEmergencyAlert}
          sx={{ mb: 3, py: 1.5, fontWeight: 'bold' }}
        >
          EMERGENCY ALERT
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Reported Reactions
          </Typography>
          
          {reportedReactions.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Reaction</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportedReactions.map((reaction) => (
                    <TableRow key={reaction.id}>
                      <TableCell>{reaction.date}</TableCell>
                      <TableCell>{reaction.reaction}</TableCell>
                      <TableCell>
                        <Chip 
                          label={reaction.status} 
                          color={reaction.isEmergency ? "error" : 
                                reaction.status === 'Resolved' ? "success" : "warning"} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" paragraph>
              No reactions reported yet.
            </Typography>
          )}
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Common Adverse Reactions
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        If you experience any of these symptoms, report them immediately and follow the recommended management.
      </Typography>

      {adverseReactions.map((reaction) => (
        <Card key={reaction.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocalHospitalIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  {reaction.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Drugs (Probably) Responsible:</strong> {reaction.drugs}
                </Typography>
                <Typography variant="body2" sx={{ color: 'error.main' }}>
                  <strong>Management:</strong> {reaction.management}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    onClick={() => handleReportReaction(reaction.name)}
                  >
                    Report This Reaction
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Layout>
  );
};

export default ADR; 