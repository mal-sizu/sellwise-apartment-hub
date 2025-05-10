import apiClient from './apiClient';
import { User } from '../types';

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    
    // Store user in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify({
      user: response.data.data.user,
      token: response.data.data.token
    }));
    
    // Store token separately for API client authorization
    localStorage.setItem('auth_token', response.data.data.token);
    
    return {
      user: response.data.data.user,
      token: response.data.data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get current user from API
export const getCurrentUserFromAPI = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Update user password
export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    const response = await apiClient.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Register seller function
export const registerSeller = async (sellerData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
}) => {
  try {
    // Create the seller record using the API
    const response = await apiClient.post('/sellers', sellerData);
    
    return {
      success: true,
      message: "Seller registration successful. Please log in.",
      data: response.data.data
    };
  } catch (error) {
    console.error('Seller registration error:', error);
    throw error;
  }
};

// Register customer function
export const registerCustomer = async (customerData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) => {
  try {
    // Create the customer record using the API
    const response = await apiClient.post('/customers', customerData);
    
    return {
      success: true,
      message: "Customer registration successful. Please log in.",
      data: response.data.data
    };
  } catch (error) {
    console.error('Customer registration error:', error);
    throw error;
  }
};

// Register function (generic handler)
export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
}, role: 'seller' | 'customer') => {
  if (role === 'seller') {
    return registerSeller(userData);
  } else {
    return registerCustomer(userData);
  }
};

// Logout function
export const logout = async () => {
  // Remove user and token from localStorage
  localStorage.removeItem('currentUser');
  localStorage.removeItem('auth_token');
  
  return {
    success: true
  };
};

// Check auth status
export const checkAuthStatus = async () => {
  // Check if user exists in localStorage
  const storedUser = localStorage.getItem('currentUser');
  
  if (storedUser) {
    const { user } = JSON.parse(storedUser);
    return {
      user,
      isAuthenticated: true
    };
  }
  
  return {
    user: null,
    isAuthenticated: false
  };
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const { user } = JSON.parse(storedUser);
    return user;
  }
  return null;
};
