// hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  login as loginService, 
  register as registerService,
  logout as logoutService,
  getToken,
  authHeader,
  setAuthData,
  removeAuthData
} from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

// Creating the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUserData: async () => {}
});

// API base URL - ensure this matches your backend URL
const API_URL = 'http://localhost:5000/api';

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to fetch user data directly from the API
  const fetchUserData = async (): Promise<User | null> => {
    try {
      const token = getToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          ...authHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData;
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  };

  // Function to refresh user data - can be called when needed
  const refreshUserData = async () => {
    setLoading(true);
    try {
      const userData = await fetchUserData();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        
        // Update localStorage with fresh user data
        const token = getToken();
        if (token) {
          setAuthData(token, userData);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        removeAuthData();
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Load user from API on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        await refreshUserData();
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService({ email, password });
      setAuthData(response.token, response.user);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerService({ username, email, password });
      setAuthData(response.token, response.user);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;