import { BrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AppRoutes } from './routes';
import { AuthProvider } from './providers/AuthProvider';
import { TrpcProvider } from './providers/TrpcProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from 'sonner';
import { useAuth } from './providers/AuthProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function AppContent() {
  const { auth } = useAuth();

  return (
    <>
      {auth.isAuthenticated ? (
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      ) : (
        <AppRoutes />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TrpcProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </TrpcProvider>
    </BrowserRouter>
  );
}
