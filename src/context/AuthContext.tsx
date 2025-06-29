import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { userDatabase, registerUser as dbRegisterUser, loginUser as dbLoginUser } from '../utils/userDatabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateStylePreference: (style: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load current user from the user database
    const currentUser = userDatabase.getCurrentUser();
    if (currentUser) {
      return {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        phone: currentUser.phone,
        stylePreference: currentUser.stylePreference
      };
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check for current user on mount
  useEffect(() => {
    const currentUser = userDatabase.getCurrentUser();
    if (currentUser && !user) {
      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        phone: currentUser.phone,
        stylePreference: currentUser.stylePreference
      });
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = dbLoginUser(email, password);
      
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        stylePreference: userData.stylePreference
      };
      
      setUser(userObj);
    } catch (error) {
      if (error instanceof Error && error.message === 'NEW_USER') {
        throw new Error('NEW_USER');
      }
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = dbRegisterUser(email, name, password, phone);
      
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        stylePreference: userData.stylePreference
      };
      
      setUser(userObj);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    userDatabase.logoutUser();
    setUser(null);
  };

  const updateStylePreference = (style: string) => {
    if (user) {
      const updatedUserData = userDatabase.updateStylePreference(user.email, style);
      if (updatedUserData) {
        const updatedUser = { ...user, stylePreference: style };
        setUser(updatedUser);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateStylePreference,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};