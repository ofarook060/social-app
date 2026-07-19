import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken, getToken, removeToken } from './api';
import { User } from './types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    gender: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const res = await api.get('/api/user.php');
    if (res.success && res.user) {
      setUser(res.user);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login.php', { email, password });
    if (res.success && res.token) {
      await setToken(res.token);
      await refreshUser();
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const signup = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    gender: string;
  }) => {
    const res = await api.post('/api/auth/signup.php', data);
    if (res.success && res.token) {
      await setToken(res.token);
      await refreshUser();
      return { success: true };
    }
    return { success: false, error: res.error || 'Signup failed' };
  };

  const logout = async () => {
    await api.post('/api/auth/logout.php');
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
