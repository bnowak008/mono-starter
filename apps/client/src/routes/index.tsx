import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { AuthForm } from '../features/auth';
import { Home } from '../features/home/';
import { PageTransition } from '../components/PageTransition';
import { LoadingSpinner } from '../components/LoadingSpinner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { auth, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isLoading && !auth.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <PageTransition>{children}</PageTransition>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { auth, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isLoading && auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <PageTransition>{children}</PageTransition>;
}

export function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <></>;
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthForm />
          </PublicRoute>
        }
      />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
