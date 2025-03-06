import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Notification } from '../types';
import { Medication } from '../types';
import { notifications as mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  requestNotificationPermission: () => Promise<boolean>;
  hasPermission: boolean | null;
  sendMockNotification: (medication: Medication) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentUser) {
      // Filter notifications based on user role
      let filteredNotifications: Notification[] = [];
      
      if (currentUser.role === 'patient') {
        // Patient sees their own notifications
        filteredNotifications = mockNotifications.filter(
          (notification) => notification.patientId === currentUser.id
        );
      } else if (currentUser.role === 'caregiver' || currentUser.role === 'family') {
        // Caregivers and family members see notifications for their patients
        if (currentUser.patients && currentUser.patients.length > 0) {
          filteredNotifications = mockNotifications.filter((notification) =>
            currentUser.patients?.includes(notification.patientId)
          );
        }
      }
      
      setNotifications(filteredNotifications);
    } else {
      setNotifications([]);
    }

    // Check notification permission
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, [currentUser]);

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setHasPermission(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPermission(granted);
      return granted;
    }

    return false;
  };

  // Function to send a mock notification for demo purposes
  const sendMockNotification = (medication: Medication) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      alert(`Medication reminder: ${medication.name} (${medication.dosage})`);
      return;
    }

    // Create notification content
    const title = 'TBX Medication Reminder';
    const options = {
      body: `Time to take ${medication.name} (${medication.dosage})`,
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: { medicationId: medication.id },
      actions: [
        {
          action: 'confirm',
          title: 'CONFIRM',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    };

    // Send notification
    const notification = new Notification(title, options);

    // Handle notification click
    notification.onclick = function(event) {
      event.preventDefault();
      window.focus();
      window.location.href = `/confirm-medication?id=${medication.id}`;
    };
  };

  const value = {
    notifications,
    markAsRead,
    requestNotificationPermission,
    hasPermission,
    sendMockNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}; 