import React from 'react';
import AppRoutes from './routes';
import { NotificationProvider } from './controllers/NotificationController';
import { AuthProvider } from './contexts/AuthContext';
import NotificationModal from './components/NotificationModal';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <NotificationModal />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 