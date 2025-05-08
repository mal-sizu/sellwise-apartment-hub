
import apiCall from './api';
import { Seller } from '../types';
import { FilterParams, PaginationParams } from '../types';

// Mock data
const mockSellers: Seller[] = [
  {
    id: "s1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "0771234567",
    identification: "982731456V",
    profilePicture: "/placeholder.svg",
    bio: "Experienced real estate agent with over 10 years in the industry.",
    socialLinks: {
      facebook: "https://facebook.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      instagram: "https://instagram.com/johndoe"
    },
    preferredLanguages: ["en", "si"],
    business: {
      name: "Doe Properties",
      registrationNumber: "RP78945",
      designation: "Senior Agent"
    },
    username: "john.doe",
    status: "Approved",
    registrationDate: "2023-08-15"
  },
  {
    id: "s2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "0767654321",
    identification: "895623147V",
    profilePicture: "/placeholder.svg",
    bio: "Specialized in luxury properties across Sri Lanka.",
    socialLinks: {
      facebook: "https://facebook.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    },
    preferredLanguages: ["en", "ta", "fr"],
    business: {
      name: "Smith Realty",
      registrationNumber: "RP65432",
      designation: "Director"
    },
    username: "jane.smith",
    status: "Pending",
    registrationDate: "2023-09-22"
  },
  {
    id: "s3",
    firstName: "Kumar",
    lastName: "Perera",
    email: "kumar@example.com",
    phone: "0751122334",
    identification: "912345678V",
    bio: "New to the industry but passionate about helping clients.",
    preferredLanguages: ["si", "en"],
    username: "kumar.p",
    status: "Pending",
    registrationDate: "2023-11-05"
  }
];

// Get all sellers with pagination and filtering
export const getSellers = async (
  pagination: PaginationParams = { page: 1, limit: 10 },
  filter?: FilterParams
) => {
  let filteredSellers = [...mockSellers];

  if (filter?.search) {
    const searchTerm = filter.search.toLowerCase();
    filteredSellers = filteredSellers.filter(seller => 
      seller.id.toLowerCase().includes(searchTerm) ||
      `${seller.firstName} ${seller.lastName}`.toLowerCase().includes(searchTerm)
    );
  }

  const startIndex = (pagination.page - 1) * pagination.limit;
  const paginatedSellers = filteredSellers.slice(startIndex, startIndex + pagination.limit);

  return apiCall({
    sellers: paginatedSellers,
    total: filteredSellers.length,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(filteredSellers.length / pagination.limit)
  });
};

// Get a seller by ID
export const getSellerById = async (id: string) => {
  const seller = mockSellers.find(s => s.id === id);
  
  if (!seller) {
    return apiCall(null, true);
  }
  
  return apiCall(seller);
};

// Create a new seller
export const createSeller = async (seller: Omit<Seller, 'id' | 'status' | 'registrationDate'>) => {
  const newSeller: Seller = {
    ...seller,
    id: `s${mockSellers.length + 1}`,
    status: 'Pending',
    registrationDate: new Date().toISOString().split('T')[0]
  };
  
  return apiCall(newSeller);
};

// Update a seller
export const updateSeller = async (id: string, seller: Partial<Seller>) => {
  const index = mockSellers.findIndex(s => s.id === id);
  
  if (index === -1) {
    return apiCall(null, true);
  }
  
  const updatedSeller = { ...mockSellers[index], ...seller };
  
  return apiCall(updatedSeller);
};

// Delete a seller
export const deleteSeller = async (id: string) => {
  return apiCall({ success: true });
};

// Update seller status
export const updateSellerStatus = async (id: string, status: 'Approved' | 'Rejected') => {
  const seller = mockSellers.find(s => s.id === id);
  
  if (!seller) {
    return apiCall(null, true);
  }
  
  const updatedSeller = { ...seller, status };
  
  return apiCall(updatedSeller);
};
