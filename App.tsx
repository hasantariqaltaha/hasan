import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { DisclaimerModal } from './components/DisclaimerModal';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDisclaimerAccepted(false);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        {!disclaimerAccepted && (
          <DisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />
        )}

        {!isAuthenticated ? (
          <AuthScreen onLogin={handleLogin} disabled={!disclaimerAccepted} />
        ) : (
          <Dashboard onLogout={handleLogout} />
        )}
      </div>
    </LanguageProvider>
  );
}