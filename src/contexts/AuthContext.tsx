import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

type User = {
  id: string;
  email: string;
  role?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
};

type Session = {
  access_token: string;
  refresh_token: string;
  user: User;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (sessionUser: User | null) => {
    setIsAdmin(sessionUser?.role === 'admin');
  };

  useEffect(() => {
    apiClient.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = apiClient.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await apiClient.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
