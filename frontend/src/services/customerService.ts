
import apiCall from './api';
import { Customer, FilterParams, PaginationParams } from '../types';

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "c1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "0771234567",
    address: "123 Main St, Colombo",
    interests: ["Residential", "Commercial"],
    registrationDate: "2023-09-15"
  },
  {
    id: "c2",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    phone: "0767654321",
    address: "456 Park Ave, Kandy",
    interests: ["Residential"],
    registrationDate: "2023-10-22"
  },
  {
    id: "c3",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "0751122334",
    registrationDate: "2023-11-05"
  }
];

// Get all customers with pagination and filtering
export const getCustomers = async (
  pagination: PaginationParams = { page: 1, limit: 10 },
  filter?: FilterParams
) => {
  let filteredCustomers = [...mockCustomers];

  if (filter?.search) {
    const searchTerm = filter.search.toLowerCase();
    filteredCustomers = filteredCustomers.filter(customer => 
      customer.id.toLowerCase().includes(searchTerm) ||
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm)
    );
  }

  const startIndex = (pagination.page - 1) * pagination.limit;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pagination.limit);

  return apiCall({
    customers: paginatedCustomers,
    total: filteredCustomers.length,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(filteredCustomers.length / pagination.limit)
  });
};

// Get a customer by ID
export const getCustomerById = async (id: string) => {
  const customer = mockCustomers.find(c => c.id === id);
  
  if (!customer) {
    return apiCall(null, true);
  }
  
  return apiCall(customer);
};

// Create a new customer
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'registrationDate'>) => {
  const newCustomer: Customer = {
    ...customerData,
    id: `c${mockCustomers.length + 1}`,
    registrationDate: new Date().toISOString().split('T')[0]
  };
  
  return apiCall(newCustomer);
};
