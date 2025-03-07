import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

interface MedicationFormProps {
  open: boolean;
  onClose: () => void;
}

const mockMedicationData = {
  name: 'Rifampicin',
  dosage: '600mg',
  frequency: 'Daily',
  time: '08:00',
  patients: 15
};

const MedicationForm: React.FC<MedicationFormProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Medication Details</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Medication Name"
                value={mockMedicationData.name}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dosage"
                value={mockMedicationData.dosage}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select value={mockMedicationData.frequency} readOnly>
                  <MenuItem value={mockMedicationData.frequency}>{mockMedicationData.frequency}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Time"
                type="time"
                value={mockMedicationData.time}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Patients Prescribed"
                value={mockMedicationData.patients}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicationForm; 