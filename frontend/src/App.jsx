import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { VoiceProvider } from './context/VoiceContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceAssistantModal from './components/VoiceAssistantModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import WhoIsThisPage from './pages/WhoIsThisPage';
import MyFamilyPage from './pages/MyFamilyPage';
import MyMemoriesPage from './pages/MyMemoriesPage';
import DailyRemindersPage from './pages/DailyRemindersPage';
import DailyRoutinePage from './pages/DailyRoutinePage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import CaregiverSettingsPage from './pages/CaregiverSettingsPage';

const MainApp = () => {
  const { role } = useAuth();
  const [currentPage, setCurrentPage] = useState('patient-dashboard');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Sync default page when role changes
  useEffect(() => {
    if (currentPage === 'patient-dashboard' && role === 'caregiver') {
      setCurrentPage('caregiver-dashboard');
    } else if (currentPage === 'caregiver-dashboard' && role === 'patient') {
      setCurrentPage('patient-dashboard');
    }
  }, [role]);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={navigateTo} onOpenAssistant={() => setIsAssistantOpen(true)} />;
      case 'caregiver-dashboard':
        return <CaregiverDashboard onNavigate={navigateTo} />;
      case 'who-is-this':
        return <WhoIsThisPage onNavigate={navigateTo} />;
      case 'family-manager':
      case 'family':
        return <MyFamilyPage onNavigate={navigateTo} />;
      case 'memories':
        return <MyMemoriesPage onNavigate={navigateTo} />;
      case 'reminders':
        return <DailyRemindersPage onNavigate={navigateTo} />;
      case 'routine':
        return <DailyRoutinePage onNavigate={navigateTo} />;
      case 'emergency':
        return <EmergencyContactsPage onNavigate={navigateTo} />;
      case 'patient-profile':
        return <PatientProfilePage onNavigate={navigateTo} />;
      case 'caregiver-settings':
        return <CaregiverSettingsPage onNavigate={navigateTo} />;
      default:
        return <PatientDashboard onNavigate={navigateTo} onOpenAssistant={() => setIsAssistantOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-teal-100">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      <main className="flex-1 pb-12">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Interactive Floating Voice Assistant */}
      <VoiceAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onNavigate={navigateTo}
      />
    </div>
  );
};

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <VoiceProvider>
          <SocketProvider>
            <MainApp />
          </SocketProvider>
        </VoiceProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
