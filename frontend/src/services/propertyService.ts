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
    // Get all properties for the report
    const response = await apiClient.get('/properties');
    const properties = response.data.data;

    // Create HTML content for the report
    const reportContent = document.createElement('div');
    reportContent.style.padding = '20px';
    reportContent.style.fontFamily = 'Arial, sans-serif';

    // Add report header
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="text-align: center; color: #333; margin-bottom: 20px;">Property Listing Report</h1>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">
        Generated on ${new Date().toLocaleDateString()}
      </p>
    `;
    reportContent.appendChild(header);

    // Add properties table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // Add table header
    table.innerHTML = `
      <thead>
        <tr style="background-color: #f4f4f4;">
          <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Property</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Type</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Location</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Price</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Status</th>
        </tr>
      </thead>
    `;

    // Add table body
    const tbody = document.createElement('tbody');
    properties.forEach(property => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 12px; border: 1px solid #ddd;">
          <div style="font-weight: bold;">${property.title}</div>
          <div style="color: #666; font-size: 0.9em;">${property.beds} beds, ${property.baths} baths</div>
        </td>
        <td style="padding: 12px; border: 1px solid #ddd;">${property.type}</td>
        <td style="padding: 12px; border: 1px solid #ddd;">
          ${property.address.street}, ${property.address.city}
        </td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">
          ${new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0
          }).format(property.price)}
          ${property.discountPrice ? `
            <div style="color: #e53e3e; font-size: 0.8em; text-decoration: line-through;">
              ${new Intl.NumberFormat('en-LK', {
                style: 'currency',
                currency: 'LKR',
                maximumFractionDigits: 0
              }).format(property.discountPrice)}
            </div>
          ` : ''}
        </td>
        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
          <span style="
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            background-color: ${property.forSale ? '#c6f6d5' : '#bee3f8'};
            color: ${property.forSale ? '#22543d' : '#2c5282'};
          ">
            ${property.forSale ? 'For Sale' : 'For Rent'}
          </span>
        </td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    reportContent.appendChild(table);

    // Add summary section
    const summary = document.createElement('div');
    const totalProperties = properties.length;
    const forSaleCount = properties.filter(p => p.forSale).length;
    const forRentCount = properties.filter(p => !p.forSale).length;
    const averagePrice = properties.reduce((acc, p) => acc + p.price, 0) / totalProperties;

    summary.innerHTML = `
      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <h2 style="color: #333; margin-bottom: 15px;">Summary</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Total Properties:</strong> ${totalProperties}</p>
            <p style="margin: 5px 0;"><strong>For Sale:</strong> ${forSaleCount}</p>
            <p style="margin: 5px 0;"><strong>For Rent:</strong> ${forRentCount}</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>Average Price:</strong> ${new Intl.NumberFormat('en-LK', {
              style: 'currency',
              currency: 'LKR',
              maximumFractionDigits: 0
            }).format(averagePrice)}</p>
          </div>
        </div>
      </div>
    `;
    reportContent.appendChild(summary);

    // Generate PDF using html2pdf
    const opt = {
      margin: 1,
      filename: `property-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    await import('html2pdf.js').then(module => {
      const html2pdf = module.default;
      return html2pdf().set(opt).from(reportContent).save();
    });

    return { success: true, message: "Report generated successfully" };
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};
