import { User, Medication, Notification } from '../types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    username: 'patient1',
    password: 'password123',
    name: 'Juan Dela Cruz',
    role: 'patient',
  },
  {
    id: '2',
    username: 'caregiver1',
    password: 'password123',
    name: 'Sarah Johnson',
    role: 'caregiver',
    patients: ['1', '3'],
  },
  {
    id: '3',
    username: 'patient2',
    password: 'password123',
    name: 'Michael Smith',
    role: 'patient',
  },
  {
    id: '4',
    username: 'family1',
    password: 'password123',
    name: 'Emily Doe',
    role: 'family',
    patients: ['1'],
  },
];

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to get yesterday's date in YYYY-MM-DD format
const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

// Helper function to get tomorrow's date in YYYY-MM-DD format
const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Mock medications
export const medications: Medication[] = [
  {
    id: '1',
    name: 'Pyrazinamide',
    dosage: '1600mg',
    time: '12:00',
    frequency: 'Daily',
    patientId: '1',
    status: 'empty'
  },
  {
    id: '2',
    name: 'Ethambutol',
    dosage: '1100mg',
    time: '12:00',
    frequency: 'Daily',
    patientId: '1',
    status: 'empty'
  },
  {
    id: '3',
    name: 'Rifampicin',
    dosage: '600mg',
    time: '08:00',
    frequency: 'Daily',
    patientId: '1',
    status: 'empty'
  },
  {
    id: '4',
    patientId: '1',
    name: 'Isoniazid',
    dosage: '300mg',
    frequency: 'Daily',
    time: '08:00',
    date: getTodayDate(),
    status: 'pending'
  },
  {
    id: '5',
    patientId: '1',
    name: 'Pyrazinamide',
    dosage: '1600mg',
    frequency: 'Daily',
    time: '12:00',
    date: getTodayDate(),
    status: 'pending'
  },
  {
    id: '6',
    patientId: '1',
    name: 'Ethambutol',
    dosage: '1100mg',
    frequency: 'Daily',
    time: '12:00',
    date: getTodayDate(),
    status: 'pending'
  },
  {
    id: '7',
    patientId: '1',
    name: 'Rifampicin',
    dosage: '600mg',
    frequency: 'Daily',
    time: '08:00',
    date: getYesterdayDate(),
    status: 'missed'
  },
  {
    id: '8',
    patientId: '1',
    name: 'Isoniazid',
    dosage: '300mg',
    frequency: 'Daily',
    time: '08:00',
    date: getYesterdayDate(),
    status: 'pending'
  },
  {
    id: '9',
    patientId: '1',
    name: 'Rifampicin',
    dosage: '600mg',
    frequency: 'Daily',
    time: '08:00',
    date: getTomorrowDate(),
    status: 'pending'
  },
  {
    id: '10',
    patientId: '3',
    name: 'Rifampicin',
    dosage: '450mg',
    frequency: 'Daily',
    time: '09:00',
    date: getTodayDate(),
    status: 'pending'
  },
  {
    id: '11',
    patientId: '3',
    name: 'Isoniazid',
    dosage: '225mg',
    frequency: 'Daily',
    time: '09:00',
    date: getTodayDate(),
    status: 'pending'
  },
  {
    id: '12',
    patientId: '3',
    name: 'Pyrazinamide',
    dosage: '1200mg',
    frequency: 'Daily',
    time: '13:00',
    date: getTodayDate(),
    status: 'pending'
  }
];

// Mock notifications
export const notifications: Notification[] = [
  {
    id: '1',
    medicationId: '3',
    patientId: '1',
    title: 'Medication Reminder',
    message: 'Time to take your Pyrazinamide (1600mg)',
    time: '12:00',
    date: getTodayDate(),
    isRead: false,
    type: 'reminder',
  },
  {
    id: '2',
    medicationId: '4',
    patientId: '1',
    title: 'Medication Reminder',
    message: 'Time to take your Ethambutol (1100mg)',
    time: '12:00',
    date: getTodayDate(),
    isRead: false,
    type: 'reminder',
  },
  {
    id: '3',
    medicationId: '5',
    patientId: '1',
    title: 'Missed Medication',
    message: 'You missed your Rifampicin (600mg) dose',
    time: '20:00',
    date: getYesterdayDate(),
    isRead: true,
    type: 'missed',
  },
  {
    id: '4',
    medicationId: '10',
    patientId: '3',
    title: 'Medication Reminder',
    message: 'Time to take your Pyrazinamide (1200mg)',
    time: '13:00',
    date: getTodayDate(),
    isRead: false,
    type: 'reminder',
  },
]; 