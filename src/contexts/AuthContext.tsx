import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('tbx_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('tbx_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo purposes, we're using the mock data
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('tbx_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tbx_user');
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 