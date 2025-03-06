
import { medications } from '../data/mockData';
import { Medication } from '../types';

export interface NotificationState {
  pendingMedications: Medication[];
  confirmedMedications: Medication[];
  missedMedications: Medication[];
  unreadCount: number;
  lastUpdated?: number;
  sentNotifications?: string[];
}

class NotificationService {
  private static instance: NotificationService;
  private state: NotificationState = {
    pendingMedications: [],
    confirmedMedications: [],
    missedMedications: [],
    unreadCount: 0,
    sentNotifications: []
  };
  private listeners: ((state: NotificationState) => void)[] = [];
  private notificationTimers: NodeJS.Timeout[] = [];
  private sentNotifications: Set<string> = new Set();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private isNotificationsStarted: boolean = false;

  private constructor() {
    // Try to load persisted state from localStorage
    try {
      const savedState = localStorage.getItem('notification-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only use saved state if it's from the current session
        if (parsed.lastUpdated && Date.now() - parsed.lastUpdated < 24 * 60 * 60 * 1000) {
          this.state = parsed;
          // Restore sent notifications from state
          if (parsed.sentNotifications) {
            this.sentNotifications = new Set(parsed.sentNotifications);
          }
        }
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }

    // Initialize service worker
    this.initServiceWorker().then(() => {
      // Start notifications if they haven't been started yet
      if (!this.isNotificationsStarted) {
        this.startBackgroundNotifications();
      }
    });

    // Listen for state updates from other tabs
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('notification-sync');
      bc.onmessage = (event) => {
        if (event.data.type === 'state-update' && 
            (!this.state.lastUpdated || event.data.timestamp > this.state.lastUpdated)) {
          this.state = event.data.state;
          // Restore sent notifications from state
          if (event.data.sentNotifications) {
            this.sentNotifications = new Set(event.data.sentNotifications);
          }
          this.listeners.forEach(listener => listener(this.state));
        }
      };
    }
  }

  private async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        // Register service worker
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });
        
        console.log('Service Worker registered successfully');
        
        // Add message listener
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
        
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.warn('Service Workers are not supported in this browser');
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async reset() {
    console.log('Resetting notification service...');
    
    // Clear all timers
    this.notificationTimers.forEach(timer => clearTimeout(timer));
    this.notificationTimers = [];

    // Reset state to empty
    this.state = {
      pendingMedications: [],
      confirmedMedications: [],
      missedMedications: [],
      unreadCount: 0,
      sentNotifications: []
    };

    // Clear sent notifications
    this.sentNotifications.clear();
    
    // Reset notifications started flag
    this.isNotificationsStarted = false;

    // Close any existing notifications
    if (this.serviceWorkerRegistration) {
      try {
        const notifications = await this.serviceWorkerRegistration.getNotifications();
        notifications.forEach(notification => notification.close());
      } catch (error) {
        console.error('Error closing notifications:', error);
      }
    }

    // Clear localStorage
    try {
      localStorage.removeItem('notification-state');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }

    // Re-initialize service worker
    try {
      await this.initServiceWorker();
    } catch (error) {
      console.error('Error re-initializing service worker:', error);
    }

    // Notify listeners of reset with empty state
    this.listeners.forEach(listener => listener({...this.state}));
    
    // Broadcast reset to all tabs
    this.broadcastStateUpdate();
    
    console.log('Notification service reset complete - state is now empty');
  }

  public subscribe(listener: (state: NotificationState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): NotificationState {
    return { ...this.state };
  }

  public startBackgroundNotifications() {
    if (this.isNotificationsStarted) {
      console.log('Notifications already started, skipping...');
      return;
    }

    console.log('Starting background notifications...');
    
    // Clear any existing timers
    this.notificationTimers.forEach(timer => clearTimeout(timer));
    this.notificationTimers = [];

    // Get only the specific medications we want to schedule
    const medicationsToSchedule = [
      medications.find(med => med.name === 'Pyrazinamide'),
      medications.find(med => med.name === 'Ethambutol'),
      medications.find(med => med.name === 'Rifampicin')
    ].filter((med): med is Medication => med !== undefined);
    
    console.log(`Found ${medicationsToSchedule.length} medications to schedule`);

    // Schedule notifications
    this.scheduleNotifications(medicationsToSchedule);
    
    this.isNotificationsStarted = true;
  }

  private scheduleNotifications(medsToSchedule: Medication[]) {
    // Clear any existing timers
    this.notificationTimers.forEach(timer => clearTimeout(timer));
    this.notificationTimers = [];
    
    console.log(`Scheduling notifications for medications:`, medsToSchedule);
    
    // First notification - Pyrazinamide
    this.notificationTimers.push(setTimeout(() => {
      const med = medsToSchedule.find(m => m.name === 'Pyrazinamide');
      if (med) {
        console.log('Sending first notification for Pyrazinamide');
        this.sendSingleNotification(med, 'first');
      } else {
        console.log('Pyrazinamide medication not found');
      }
    }, 2 * 60 * 1000));

    // Second notification - Ethambutol
    this.notificationTimers.push(setTimeout(() => {
      const med = medsToSchedule.find(m => m.name === 'Ethambutol');
      if (med) {
        console.log('Sending second notification for Ethambutol');
        this.sendSingleNotification(med, 'second');
      } else {
        console.log('Ethambutol medication not found');
      }
    }, 3 * 60 * 1000));

    // Third notification - Rifampicin
    this.notificationTimers.push(setTimeout(() => {
      const med = medsToSchedule.find(m => m.name === 'Rifampicin');
      if (med) {
        console.log('Sending third notification for Rifampicin');
        this.sendSingleNotification(med, 'third');
      } else {
        console.log('Rifampicin medication not found');
      }
    }, 4 * 60 * 1000));

    // Missed dose notification - for any unconfirmed medication
    this.notificationTimers.push(setTimeout(() => {
      console.log('Sending missed medication notification');
      this.sendMissedNotification();
    }, 5 * 60 * 1000));
  }

  private async sendSingleNotification(medication: Medication, type: 'first' | 'second' | 'third') {
    console.log(`Attempting to send notification for ${medication.name}`, medication);
    
    // Generate unique notification ID
    const notificationId = `reminder_${type}_${medication.id}`;
    
    // Check if notification has already been sent
    if (this.sentNotifications.has(notificationId)) {
      console.log(`Notification ${notificationId} already sent, skipping`);
      return;
    }

    const notificationOptions = {
      body: `Time to take ${medication.name} (${medication.dosage})`,
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: { 
        medicationId: medication.id,
        patientId: medication.patientId,
        type: 'reminder',
        notificationId: notificationId
      },
      tag: notificationId // Ensure only one notification per medication
    };

    try {
      if (this.serviceWorkerRegistration) {
        console.log('Showing notification with service worker:', notificationOptions);
        await this.serviceWorkerRegistration.showNotification('TBX Medication Reminder', notificationOptions);
        console.log(`Notification ${notificationId} sent successfully`);

        // Create a new medication object with pending status
        const pendingMedication: Medication = { 
          ...medication, 
          status: 'pending' as const,
          date: new Date().toISOString().split('T')[0] // Add today's date
        };

        // Add to pending medications and increment unread count
        console.log('Adding medication to pending:', pendingMedication);
        
        // Remove any existing pending medication with the same ID to prevent duplicates
        const filteredPending = this.state.pendingMedications.filter(m => m.id !== medication.id);
        
        this.updateState({
          pendingMedications: [...filteredPending, pendingMedication],
          unreadCount: this.state.unreadCount + 1
        });

        // Mark as sent
        this.sentNotifications.add(notificationId);

        // Broadcast state change to all tabs
        this.broadcastStateUpdate();
      } else {
        console.warn('Service worker not registered, using fallback notification');
        new Notification('TBX Medication Reminder', notificationOptions);
      }
    } catch (error) {
      console.error(`Failed to send notification ${notificationId}:`, error);
      console.error('Error details:', error);
    }
  }

  private broadcastStateUpdate() {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('notification-sync');
      bc.postMessage({ 
        type: 'state-update', 
        state: this.state,
        timestamp: Date.now(),
        sentNotifications: Array.from(this.sentNotifications) // Include sent notifications in broadcast
      });
    }
  }

  private async sendMissedNotification() {
    // Get the first unconfirmed medication that hasn't been marked as missed
    const unconfirmedMed = this.state.pendingMedications.find(med => 
      !this.sentNotifications.has(`missed_${med.id}`) &&
      !this.state.confirmedMedications.some(confirmed => confirmed.id === med.id)
    );

    if (!unconfirmedMed) {
      console.log('No unconfirmed medications to mark as missed');
      return;
    }

    // Generate unique notification ID
    const notificationId = `missed_${unconfirmedMed.id}`;

    const notificationOptions = {
      body: `Missed dose: ${unconfirmedMed.name} (${unconfirmedMed.dosage})`,
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: { 
        medicationId: unconfirmedMed.id,
        patientId: unconfirmedMed.patientId,
        type: 'missed',
        notificationId: notificationId
      }
    };

    try {
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification('TBX Missed Medication Alert', notificationOptions);
        console.log(`Missed notification ${notificationId} sent successfully`);
      } else {
        console.log('Service worker not registered, using fallback notification');
        new Notification('TBX Missed Medication Alert', notificationOptions);
      }

      // Move medication from pending to missed and increment unread count
      const pendingMedications = this.state.pendingMedications.filter(m => m.id !== unconfirmedMed.id);
      
      this.updateState({
        pendingMedications,
        missedMedications: [...this.state.missedMedications, unconfirmedMed],
        unreadCount: this.state.unreadCount + 1
      });

      // Mark as sent
      this.sentNotifications.add(notificationId);

      // Broadcast state change to all tabs
      this.broadcastStateUpdate();
    } catch (error) {
      console.error(`Failed to send missed notification ${notificationId}:`, error);
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    console.log('Received message from service worker:', event.data);
    const { type, medicationId } = event.data;

    if (type === 'notification_confirm') {
      this.handleMedicationConfirm(medicationId);
    }
  }

  public handleMedicationConfirm(medicationId: string) {
    console.log('Confirming medication:', medicationId);
    
    // Find the medication in pending medications
    const medication = this.state.pendingMedications.find(m => m.id === medicationId);
    if (!medication) {
      console.log('Medication not found in pending medications');
      return;
    }

    // Get current time in HH:MM format
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const confirmationTime = `${hours}:${minutes}`;

    // Create confirmed medication with timestamp
    const confirmedMedication = {
      ...medication,
      confirmationTime: confirmationTime
    };

    // Remove from pending
    const pendingMedications = this.state.pendingMedications.filter(m => m.id !== medicationId);
    
    // Add to confirmed
    const confirmedMedications = [...this.state.confirmedMedications, confirmedMedication];

    // Remove from missed if it exists there
    const missedMedications = this.state.missedMedications.filter(m => m.id !== medicationId);

    console.log('Updating state with:', {
      pendingMedications,
      confirmedMedications,
      missedMedications
    });

    this.updateState({
      pendingMedications,
      confirmedMedications,
      missedMedications,
      unreadCount: Math.max(0, this.state.unreadCount - 1)
    });
  }

  private updateState(updates: Partial<NotificationState>) {
    this.state = {
      ...this.state,
      ...updates
    };

    // Notify listeners
    this.listeners.forEach(listener => listener(this.state));

    // Broadcast state change to all tabs
    this.broadcastStateUpdate();

    // Store state in localStorage for persistence
    try {
      localStorage.setItem('notification-state', JSON.stringify({
        ...this.state,
        lastUpdated: Date.now(),
        sentNotifications: Array.from(this.sentNotifications) // Include sent notifications in storage
      }));
    } catch (error) {
      console.error('Error storing notification state:', error);
    }
  }
}

export default NotificationService; 