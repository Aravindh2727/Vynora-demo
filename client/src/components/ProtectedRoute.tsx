import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContextEngineStore } from '../store/useContextEngineStore';
import { VynoraLoader } from './common/VynoraLoader';
import { isDemoMode } from '../services/appMode';

export default function ProtectedRoute() {
  const { user, authLoading } = useContextEngineStore();

  // In Demo Mode, bypass Firebase auth checks immediately
  if (isDemoMode()) {
    return <Outlet />;
  }

  if (authLoading) {
    return (
      <VynoraLoader
        fullscreen
        message="Loading your world..."
        submessage="Securing your private dashboard..."
        timeoutMs={14000}
      />
    );
  }

  const isAuthenticated = user !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
