import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Recruiter Showcase ProtectedRoute:
 * Automatically grants access to all 18 modules in Demo Mode.
 */
export default function ProtectedRoute() {
  return <Outlet />;
}
