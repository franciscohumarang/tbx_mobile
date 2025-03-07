import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material';

interface PatientADRViewProps {
  open: boolean;
  onClose: () => void;
  patient: any;
  reaction: any;
}

const PatientADRView: React.FC<PatientADRViewProps> = ({ 
  open, 
  onClose, 
  patient,
  reaction
}) => {
  // Add debugging
  React.useEffect(() => {
    console.log("PatientADRView opened with patient data:", patient);
    console.log("Reaction data:", reaction);
  }, [open, patient, reaction]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">
          Adverse Reaction Details: {patient?.basicInfo?.givenName} {patient?.basicInfo?.surname}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', mt: 2 }}>
          {/* Patient Basic Info Summary */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Patient ID</Typography>
                <Typography variant="body1">{patient?.diagnosis?.tbCaseNumber || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{patient?.basicInfo?.givenName} {patient?.basicInfo?.surname}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                <Typography variant="body1">{patient?.basicInfo?.address?.phoneNumber || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Reaction Details */}
          <Typography variant="h6" gutterBottom>Reaction Details</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Date Reported</Typography>
                <Typography variant="body1">{reaction?.date || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={reaction?.status || 'Unknown'} 
                  color={reaction?.isEmergency ? "error" : 
                        reaction?.status === 'Resolved' ? "success" : "warning"} 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Reaction</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{reaction?.reaction || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Drugs Involved</Typography>
                <Typography variant="body1">{reaction?.drugs || 'Unknown'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Management</Typography>
                <Typography variant="body1">{reaction?.management || 'Pending review'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Patient's Adverse Reaction History */}
          <Typography variant="h6" gutterBottom>Patient's Adverse Reaction History</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Reaction</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient?.adverseReactions?.reactions?.map((r: string, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{patient?.adverseReactions?.lastOccurrence || 'Unknown'}</TableCell>
                    <TableCell>{r}</TableCell>
                    <TableCell>
                      <Chip 
                        label="Recorded" 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(!patient?.adverseReactions?.reactions || patient?.adverseReactions?.reactions.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No previous reactions recorded</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3 }}>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Update status logic would go here
                alert('Status update functionality would be implemented here');
                onClose();
              }}
            >
              Update Status
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PatientADRView; 