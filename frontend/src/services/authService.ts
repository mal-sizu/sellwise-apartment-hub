
import apiCall from './api';
import { User } from '../types';
import { createCustomer } from './customerService';
import { createSeller } from './sellerService';

// Mock users for authentication
const mockUsers: User[] = [
  {
    id: "u1",
    role: "admin",
    name: "Admin User",
    email: "admin@example.com"
  },
  {
    id: "u2",
    role: "seller",
    name: "John Doe",
    email: "john.doe@example.com"
  },
  {
    id: "u3",
    role: "customer",
    name: "Jane Smith",
    email: "jane.smith@example.com"
  }
];

// Login function
export const login = async (email: string, password: string) => {
  // For demo purposes, any password works
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    return apiCall(null, true); // Simulate API error for invalid email
  }
  
  // Store user in localStorage for persistence
  localStorage.setItem('currentUser', JSON.stringify({
    user,
    token: "mock-jwt-token"
  }));
  
  return apiCall({
    user,
    token: "mock-jwt-token"
  });
};

// Register seller function
export const registerSeller = async (sellerData: any) => {
  try {
    // Create the seller record
    const seller = await createSeller(sellerData);
    
    // Create a corresponding user record
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      role: "seller",
      name: `${sellerData.firstName} ${sellerData.lastName}`,
      email: sellerData.email
    };
    
    mockUsers.push(newUser);
    
    return apiCall({
      success: true,
      message: "Seller registration successful. Please log in."
    });
  } catch (error) {
    return apiCall({
      success: false,
      message: "Registration failed. Please try again."
    }, true);
  }
};

// Register customer function
export const registerCustomer = async (customerData: any) => {
  try {
    // Create the customer record
    const customer = await createCustomer(customerData);
    
    // Create a corresponding user record
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      role: "customer",
      name: `${customerData.firstName} ${customerData.lastName}`,
      email: customerData.email
    };
    
    mockUsers.push(newUser);
    
    return apiCall({
      success: true,
      message: "Customer registration successful. Please log in."
    });
  } catch (error) {
    return apiCall({
      success: false,
      message: "Registration failed. Please try again."
    }, true);
  }
};

// Register function (generic handler)
export const register = async (userData: any, role: 'seller' | 'customer') => {
  if (role === 'seller') {
    return registerSeller(userData);
  } else {
    return registerCustomer(userData);
  }
};

// Logout function
export const logout = async () => {
  // Remove user from localStorage
  localStorage.removeItem('currentUser');
  
  return apiCall({
    success: true
  });
};

// Check auth status
export const checkAuthStatus = async () => {
  // Check if user exists in localStorage
  const storedUser = localStorage.getItem('currentUser');
  
  if (storedUser) {
    const { user } = JSON.parse(storedUser);
    return apiCall({
      user,
      isAuthenticated: true
    });
  }
  
  return apiCall({
    user: null,
    isAuthenticated: false
  });
};

// Get current user
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const { user } = JSON.parse(storedUser);
    return user;
  }
  return null;
};
