import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthResponse, PatientProfile } from '../api/types';
import { authService } from '../api/services/auth';
import { patientService } from '../api/services/patient';

interface AuthContextType {
  user: AuthResponse | null;
  profile: PatientProfile | null;
  loading: boolean;
  login: (payload: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('aegis_user');
    const token = localStorage.getItem('aegis_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await patientService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: { username: string; password: string }) => {
    const data = await authService.login(payload);
    localStorage.setItem('aegis_token', data.token);
    localStorage.setItem('aegis_user', JSON.stringify(data));
    setUser(data);
    await fetchProfile();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
