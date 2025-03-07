# TBX - Tuberculosis Treatment Adherence Monitoring

A Progressive Web App (PWA) for tracking tuberculosis medication intake and providing reminders to patients, caregivers, and family members.

## Features

- **Progressive Web App**: Works offline and can be installed on mobile devices
- **Push Notifications**: Receive medication reminders and alerts
- **User Roles**: Different views for patients, caregivers, and family members
- **Medication Tracking**: Track confirmed, pending, and missed medications
- **Responsive Design**: Optimized for mobile devices

## Demo Accounts

The app includes the following demo accounts for testing:

| Username | Password | Role |
|----------|----------|------|
| patient1 | password123 | Patient |
| caregiver1 | password123 | Caregiver |
| patient2 | password123 | Patient |
| family1 | password123 | Family Member |

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```
npm run build
```

## Testing Push Notifications

The app includes a dedicated page for triggering test notifications at:

```
http://localhost:3000/trigger-notifications
```

This page offers two ways to send test notifications:

### 1. Quick Test Notifications

Pre-configured sample medications that can be triggered with a single click:
- **Morning Rifampicin**: Reminder for Juan Dela Cruz's morning medication
- **Noon Pyrazinamide**: Reminder for Juan Dela Cruz's noon medication
- **Missed Medication**: Alert for Juan Dela Cruz's missed medication
- **Patient 2 Medication**: Reminder for Michael Smith's medication

After sending notifications, you can:
- See which notifications have been sent (they appear grayed out with a "Sent" label)
- Send them again by clicking the "Send Again" button
- Reset all notifications by clicking the refresh button at the top of the page

### 2. Custom Notifications

Create your own notification by:
- Selecting a patient
- Selecting a medication
- Choosing between reminder or missed medication notifications
- Adding a custom message (optional)

This approach simulates a backend server sending notifications without requiring any server-side code. In a production environment, notifications would be triggered by a backend server based on medication schedules.

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Service Workers (for PWA functionality)
- Web Push API

## Note

This is a demo application with hardcoded data. In a real-world scenario, this would connect to a backend API for data storage and push notification delivery.

## License

This project is licensed under the MIT License.
