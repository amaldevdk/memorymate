import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, patientService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('patient'); // Default to patient view for immediate friendly access
  const [token, setToken] = useState(localStorage.getItem('memorymate_token') || null);
  const [activePatient, setActivePatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize active patient and auth check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fetch patient profile for the active session
        const patientData = await patientService.getActive();
        setActivePatient(patientData);

        const savedRole = localStorage.getItem('memorymate_role');
        if (savedRole) {
          setRole(savedRole);
        }

        if (token) {
          try {
            const meRes = await authService.getMe();
            if (meRes?.user) {
              setUser(meRes.user);
              if (meRes.user.role) setRole(meRes.user.role);
            }
          } catch {
            // Token expired or server restarted
            console.warn('Session verification notice: using active role mode');
          }
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.token) {
      localStorage.setItem('memorymate_token', res.token);
      localStorage.setItem('memorymate_role', res.user.role);
      setToken(res.token);
      setUser(res.user);
      setRole(res.user.role);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.token) {
      localStorage.setItem('memorymate_token', res.token);
      localStorage.setItem('memorymate_role', res.user.role);
      setToken(res.token);
      setUser(res.user);
      setRole(res.user.role);
    }
    return res;
  };

  const demoLogin = async (targetRole) => {
    try {
      const res = await authService.demoLogin(targetRole);
      if (res.token) {
        localStorage.setItem('memorymate_token', res.token);
        localStorage.setItem('memorymate_role', targetRole);
        setToken(res.token);
        setUser(res.user);
        setRole(targetRole);
      }
      return res;
    } catch (err) {
      console.error('Demo login error:', err);
      // Fallback local switch
      setRole(targetRole);
      localStorage.setItem('memorymate_role', targetRole);
    }
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('memorymate_role', newRole);
  };

  const logout = () => {
    localStorage.removeItem('memorymate_token');
    localStorage.removeItem('memorymate_role');
    setToken(null);
    setUser(null);
    setRole('patient');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!token || !!user,
        activePatient,
        setActivePatient,
        loading,
        login,
        register,
        demoLogin,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
