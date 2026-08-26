import React, { useEffect } from 'react';
import { useAppStore } from './store/useStore';
import { authApi } from './services/api';
import { AppLayout } from './components/layout/AppLayout';
import { ToastNotification } from './components/common/ToastNotification';
import { DashboardPage } from './pages/DashboardPage';
import { JourneyPage } from './pages/JourneyPage';
import { AssessmentHubPage } from './pages/AssessmentHubPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { ResultScorecardPage } from './pages/ResultScorecardPage';
import { HistoryPage } from './pages/HistoryPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ServicesPage } from './pages/ServicesPage';
import { LearningPage } from './pages/LearningPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  const { activeScreen, token, setUser, logout, setScreen } = useAppStore();

  useEffect(() => {
    // Listen for auth expiration events from apiRequest 401 responses
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener('fff_auth_expired', handleAuthExpired);

    // Validate active session token and sync profile on app load
    if (token) {
      authApi
        .getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch((err) => {
          console.warn('Session verification notice:', err);
        });
    }

    return () => {
      window.removeEventListener('fff_auth_expired', handleAuthExpired);
    };
  }, [token]);

  // If unauthenticated, gate access and render the full-screen Login / Register portal
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#011913] via-[#022c24] to-[#03362c] flex flex-col justify-center items-center p-4 sm:p-8 relative">
        <ToastNotification />
        <div className="w-full max-w-lg">
          <AuthPage />
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'screen-dashboard':
        return <DashboardPage />;
      case 'screen-journey':
        return <JourneyPage />;
      case 'screen-assessment-choice':
        return <AssessmentHubPage />;
      case 'screen-question':
        return <QuestionnairePage />;
      case 'screen-result':
        return <ResultScorecardPage />;
      case 'screen-history':
        return <HistoryPage />;
      case 'screen-simulator':
        return <SimulatorPage />;
      case 'screen-services':
        return <ServicesPage />;
      case 'screen-learning':
        return <LearningPage />;
      case 'screen-profile':
        return <ProfilePage />;
      case 'screen-auth':
        return <AuthPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppLayout>{renderScreen()}</AppLayout>;
};

export default App;
