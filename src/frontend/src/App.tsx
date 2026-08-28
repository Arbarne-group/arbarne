import React, { useEffect } from 'react';
import { useAppStore } from './store/useStore';
import { authApi, portalApi, assessmentApi, adaptGamification } from './services/api';
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
import { SettingsPage } from './pages/SettingsPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ReportsPage } from './pages/ReportsPage';
import { PillarDetailPage } from './pages/PillarDetailPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  const {
    activeScreen,
    token,
    setUser,
    setDashboardSummary,
    setGamification,
    setPillars,
    setAssessmentResult,
    assessment,
    logout,
  } = useAppStore();

  useEffect(() => {
    // Listen for auth expiration events from apiRequest 401 responses
    const handleAuthExpired = () => {
      logout();
    };
    window.addEventListener('fff_auth_expired', handleAuthExpired);

    // Validate active session token and sync profile & live dashboard stats on app load.
    const isRealJwt =
      !!token &&
      token.split('.').length === 3 &&
      !/^(demo|reg)\./.test(token);

    if (token && isRealJwt) {
      authApi
        .getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch((err) => {
          console.warn('Session verification notice:', err);
        });

      portalApi
        .getDashboardSummary()
        .then((summary) => {
          setDashboardSummary(summary);
          if (summary.ffmi_score !== null && summary.ffmi_score !== undefined) {
            setUser({
              ffmi_score: summary.ffmi_score,
              tier: summary.tier || 3,
              tier_name: summary.tier_name || 'Structured Farm',
            });
          }
        })
        .catch((err) => {
          console.warn('Dashboard summary sync notice:', err);
        });

      portalApi
        .getGamification()
        .then((gState) => {
          setGamification(adaptGamification(gState));
        })

      assessmentApi
        .getPillars()
        .then((livePillars) => {
          setPillars(livePillars);
        })
        .catch((err) => {
          console.warn('Pillars sync notice:', err);
        });

      if (!assessment.latestResult) {
        assessmentApi
          .getHistory()
          .then((history) => {
            if (history && history.length > 0) {
              const latest = history[0];
              if (latest.ffmi_score !== null && latest.ffmi_score !== undefined) {
                // If full scorecard available
                setUser({
                  ffmi_score: latest.ffmi_score,
                  tier: latest.tier || 3,
                  tier_name: latest.tier_classification || 'Structured Farm',
                });
              }
            }
          })
          .catch((err) => {
            console.warn('History sync notice:', err);
          });
      }
    }

    return () => {
      window.removeEventListener('fff_auth_expired', handleAuthExpired);
    };
  }, [token]);

  // If unauthenticated, gate access and render the full-screen Login / Register portal
  if (!token) {
    return (
      <div className="min-h-screen w-full relative">
        <ToastNotification />
        <AuthPage />
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
      case 'screen-pillar-detail':
        return <PillarDetailPage />;
      case 'screen-history':
        return <HistoryPage />;
      case 'screen-reports':
        return <ReportsPage />;
      case 'screen-simulator':
        return <SimulatorPage />;
      case 'screen-services':
        return <ServicesPage />;
      case 'screen-learning':
        return <LearningPage />;
      case 'screen-profile':
        return <ProfilePage />;
      case 'screen-settings':
        return <SettingsPage />;
      case 'screen-pricing':
        return <PricingPage />;
      case 'screen-checkout':
        return <CheckoutPage />;
      case 'screen-onboarding':
        return <OnboardingPage />;
      case 'screen-auth':
        return <AuthPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppLayout>{renderScreen()}</AppLayout>;
};

export default App;
