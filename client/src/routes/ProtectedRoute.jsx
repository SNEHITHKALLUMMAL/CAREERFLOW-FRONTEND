import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Guards nested routes behind authentication, and optionally a set of allowed roles.
 * Usage: <Route element={<ProtectedRoute allowedRoles={['student']} />}>...</Route>
 */
export function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // AuthBootstrap (in App.jsx) owns the initial loading screen

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
