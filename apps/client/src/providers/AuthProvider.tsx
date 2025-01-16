import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trpc } from '../lib/trpc';

interface User {
  id: string;
  email: string;
}

interface Session {
  id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: (auth: Partial<AuthState>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ 
    isAuthenticated: false, 
    user: null,
    session: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const { data: authData, isLoading: queryLoading } = trpc.auth.me.useQuery(
    undefined,
    {
      retry: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  useEffect(() => {
    if (!queryLoading) {
      setAuth({
        isAuthenticated: !!authData?.user,
        user: authData?.user ?? null,
        session: authData?.session ?? null
      });
      setIsLoading(false);
    }
  }, [authData, queryLoading]);

  const updateAuth = useCallback((newAuth: Partial<AuthState>) => {
    setAuth(current => {
      const updated = {
        ...current,
        ...newAuth,
        isAuthenticated: newAuth.user ? true : current.isAuthenticated
      };
      
      if (newAuth.user === null) {
        updated.isAuthenticated = false;
        updated.session = null;
      }
      
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      auth, 
      setAuth: updateAuth, 
      isLoading: isLoading || queryLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 