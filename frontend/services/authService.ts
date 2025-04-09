// services/authService.js

const API_URL = 'http://localhost:5000/api/auth';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// Login a user
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Store auth data in localStorage
export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove auth data from localStorage
export const removeAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Optional: Check if token is expired
    // This is a simple check - you might want to decode the JWT and check its exp claim
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

// Get the stored user from localStorage
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user'); // FIXED: was using setItem instead of getItem
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

// Get the auth token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Add authorization header to requests
export const authHeader = () => {
  const token = getToken();
  
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
};

// Validate token with server
export const validateToken = async () => {
  try {
    const token = getToken();
    if (!token) return false;
    
    const response = await fetch(`${API_URL}/validate`, {
      method: 'GET',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Logout user - both client-side and server-side
export const logout = async () => {
  try {
    // Optional: Notify the server about logout
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage regardless of server response
    removeAuthData();
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Profile update failed');
    }

    const updatedUser = await response.json();
    
    // Update the stored user data
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({...currentUser, ...updatedUser}));
    
    return updatedUser;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password change failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/request-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Reset request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Request reset error:', error);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (resetData) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Password reset failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};