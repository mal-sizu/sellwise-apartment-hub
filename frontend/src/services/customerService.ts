import apiClient from './apiClient';
import { Customer, FilterParams, PaginationParams } from '../types';

// Get all customers with pagination and filtering
export const getCustomers = async (
  pagination: PaginationParams = { page: 1, limit: 10 },
  filter?: FilterParams
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    
    if (filter?.search) {
      params.append('search', filter.search);
    }
    
    const response = await apiClient.get(`/customers?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get a customer by ID
export const getCustomerById = async (id: string) => {
  try {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (customerData: Omit<Customer, '_id' | 'registrationDate'>) => {
  try {
    const response = await apiClient.post('/customers', customerData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Update customer details
export const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
  try {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string) => {
  try {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    throw error;
  }
};
