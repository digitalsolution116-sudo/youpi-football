import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { AuthPage } from './pages/AuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EventsPage } from './pages/EventsPage';
import { BetsPage } from './pages/BetsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportChat } from './components/Support/SupportChat';
import { InstallPrompt } from './components/PWA/InstallPrompt';
import { ConfigChecker } from './components/Debug/ConfigChecker';

const AdminRoutes: React.FC = () => {
  const { adminUser, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement administration...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLoginPage />;
  }

  return <AdminDashboardPage />;
};

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Vérification de la session...</p>
          <p className="text-sm opacity-75 mt-2">Reconnexion automatique en cours</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/admin/*" element={
        <AdminProvider>
          <AdminRoutes />
        </AdminProvider>
      } />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/bets" element={<BetsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/" element={<Navigate to="/events" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          
          <AppRoutes />
          <SupportChat />
          <InstallPrompt />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;