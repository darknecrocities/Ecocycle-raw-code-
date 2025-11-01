import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import Dashboard from './pages/Dashboard';
import WasteLogging from './pages/WasteLogging';
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Education from './pages/Education';
import Redemption from './pages/Redemption';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import { useState } from 'react';

export type PageView = 'landing' | 'dashboard' | 'log' | 'analytics' | 'leaderboard' | 'achievements' | 'education' | 'redemption' | 'settings';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex flex-col">
          <LandingPage />
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  // Show profile setup modal if needed
  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <ProfileSetupModal />
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  // Show loading state while profile is being fetched
  if (profileLoading || !isFetched) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
          {currentPage === 'log' && <WasteLogging />}
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'leaderboard' && <Leaderboard />}
          {currentPage === 'achievements' && <Achievements />}
          {currentPage === 'education' && <Education />}
          {currentPage === 'redemption' && <Redemption />}
          {currentPage === 'settings' && <Settings />}
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
