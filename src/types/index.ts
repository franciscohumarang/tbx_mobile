export type UserRole = 'patient' | 'caregiver' | 'family';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, we would never store passwords in plain text
  name: string;
  role: UserRole;
  patients?: string[]; // IDs of patients (for caregivers and family members)
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  patientId: string;
  status: 'empty' | 'pending' | 'confirmed' | 'missed';
  confirmationTime?: string;
  date?: string;
}

export interface Notification {
  id: string;
  medicationId: string;
  patientId: string;
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  type: 'reminder' | 'missed';
} 