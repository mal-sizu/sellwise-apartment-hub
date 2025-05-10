import apiClient from './apiClient';
import { FilterParams, PaginationParams, Property, SortParams } from '../types';



// Get all properties with pagination, filtering, and sorting
export const getProperties = async (
  pagination: PaginationParams = { page: 1, limit: 10 },
  sort?: SortParams,
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
    
    if (filter?.priceMin !== undefined) {
      params.append('priceMin', filter.priceMin.toString());
    }
    
    if (filter?.priceMax !== undefined) {
      params.append('priceMax', filter.priceMax.toString());
    }
    
    if (filter?.type) {
      params.append('type', filter.type);
    }
    
    if (filter?.city) {
      params.append('city', filter.city);
    }
    
    if (sort) {
      params.append('sortBy', sort.field);
      params.append('sortDirection', sort.direction);
    }
    
    const response = await apiClient.get(`/properties?${params.toString()}`);
    
    // Extract the properties array from the response
    const properties = response.data.data;
    
    // Calculate total pages based on the current limit and total count
    // If the backend doesn't provide totalPages, we can estimate it
    // Assuming the backend returns the total count or we can use the array length
    const totalCount = response.data.totalCount || properties.length;
    const totalPages = Math.ceil(totalCount / pagination.limit);
    
    // Return the data in the format expected by the Properties component
    return {
      properties: properties,
      totalPages: totalPages || 1
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Get properties by seller ID
export const getSellerProperties = async (sellerId: string) => {
  try {
    const response = await apiClient.get(`/properties/seller/${sellerId}`);
    // Return just the data array from the response
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching properties for seller ${sellerId}:`, error);
    throw error;
  }
};

// Get property by ID
export const getPropertyById = async (id: string) => {
  try {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

// Create a new property
export const createProperty = async (property: any) => {
  try {
    console.log("Sending property data to API:", property);
    const response = await apiClient.post('/properties', property);
    return response.data.data;
  } catch (error) {
    console.error('Error creating property:', error);
    // Log more details about the error
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Update an existing property
export const updateProperty = async (id: string, property: Partial<Property>) => {
  try {
    const response = await apiClient.put(`/properties/${id}`, property);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};

// Delete a property
export const deleteProperty = async (id: string) => {
  try {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting property with ID ${id}:`, error);
    throw error;
  }
};

// Generate report functionality
export const generateReport = async () => {
  try {
    // Request the report from the backend
    const response = await apiClient.get('/properties/report', {
      responseType: 'blob' // Important for handling file downloads
    });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from the response headers if available, or use a default name
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/["']/g, '')
      : `property-report-${new Date().toISOString().split('T')[0]}.pdf`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, message: "Report downloaded successfully" };
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};
