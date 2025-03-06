import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Medication } from '../types';
import { medications as mockMedications } from '../data/mockData';
import { useAuth } from './AuthContext';

interface MedicationContextType {
  medications: Medication[];
  pendingMedications: Medication[];
  confirmedMedications: Medication[];
  missedMedications: Medication[];
  confirmMedication: (id: string) => void;
  getMedicationById: (id: string) => Medication | undefined;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedications = (): MedicationContextType => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    if (currentUser) {
      // Filter medications based on user role
      let filteredMedications: Medication[] = [];
      
      if (currentUser.role === 'patient') {
        // Patient sees their own medications
        filteredMedications = mockMedications.filter(
          (medication) => medication.patientId === currentUser.id
        );
      } else if (currentUser.role === 'caregiver' || currentUser.role === 'family') {
        // Caregivers and family members see medications for their patients
        if (currentUser.patients && currentUser.patients.length > 0) {
          filteredMedications = mockMedications.filter((medication) =>
            currentUser.patients?.includes(medication.patientId)
          );
        }
      }
      
      setMedications(filteredMedications);
    } else {
      setMedications([]);
    }
  }, [currentUser]);

  // Derived states
  const pendingMedications = medications.filter((med) => med.status === 'pending');
  const confirmedMedications = medications.filter((med) => med.status === 'confirmed');
  const missedMedications = medications.filter((med) => med.status === 'missed');

  const confirmMedication = (id: string) => {
    setMedications((prevMedications) =>
      prevMedications.map((medication) =>
        medication.id === id
          ? {
              ...medication,
              status: 'confirmed',
              confirmationTime: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : medication
      )
    );
  };

  const getMedicationById = (id: string) => {
    return medications.find((medication) => medication.id === id);
  };

  const value = {
    medications,
    pendingMedications,
    confirmedMedications,
    missedMedications,
    confirmMedication,
    getMedicationById,
  };

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
}; 