
import apiCall from './api';
import { FilterParams, PaginationParams, Property, SortParams } from '../types';

// Mock data for properties (you would replace with API calls)
export const mockProperties: Property[] = [
  {
    id: "p1",
    title: "Modern Apartment in Colombo City",
    type: "Residential",
    description: "A beautiful modern apartment in the heart of Colombo with amazing city views.",
    address: {
      house: "Apartment 4B",
      street: "Park Street",
      city: "Colombo",
      postalCode: "00100"
    },
    forSale: true,
    price: 45000000,
    discountPrice: 42000000,
    beds: 3,
    baths: 2,
    options: {
      parkingSpot: true,
      furnished: true
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    sellerId: "s1",
    createdAt: "2023-05-15",
    updatedAt: "2023-05-15"
  },
  {
    id: "p2",
    title: "Commercial Space in Kandy",
    type: "Commercial",
    description: "Prime commercial space available in Kandy city center, perfect for retail or office use.",
    address: {
      house: "Ground Floor",
      street: "Temple Road",
      city: "Kandy",
      postalCode: "20000"
    },
    forSale: false,
    price: 120000,
    beds: 0,
    baths: 2,
    options: {
      parkingSpot: true,
      furnished: false
    },
    images: ["/placeholder.svg"],
    sellerId: "s2",
    createdAt: "2023-06-10",
    updatedAt: "2023-06-20"
  },
  {
    id: "p3",
    title: "Beach Villa in Galle",
    type: "Residential",
    description: "Luxurious beach villa in Galle with direct beach access and breathtaking ocean views.",
    address: {
      house: "Villa Serenity",
      street: "Beach Road",
      city: "Galle",
      postalCode: "80000"
    },
    forSale: true,
    price: 95000000,
    beds: 4,
    baths: 5,
    options: {
      parkingSpot: true,
      furnished: true
    },
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    sellerId: "s3",
    createdAt: "2023-07-05",
    updatedAt: "2023-07-05"
  }
];

// Get all properties with pagination, filtering, and sorting
export const getProperties = async (
  pagination: PaginationParams = { page: 1, limit: 10 },
  sort?: SortParams,
  filter?: FilterParams
) => {
  let filteredProperties = [...mockProperties];

  // Apply filtering if provided
  if (filter) {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower) ||
        p.address.city.toLowerCase().includes(searchLower)
      );
    }

    if (filter.priceMin !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price >= filter.priceMin!);
    }

    if (filter.priceMax !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price <= filter.priceMax!);
    }

    if (filter.type) {
      filteredProperties = filteredProperties.filter(p => p.type === filter.type);
    }

    if (filter.city) {
      filteredProperties = filteredProperties.filter(p => p.address.city === filter.city);
    }
  }

  // Apply sorting if provided
  if (sort) {
    filteredProperties.sort((a, b) => {
      // Handle different field types
      let aValue, bValue;
      
      switch(sort.field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'beds':
          aValue = a.beds || 0;
          bValue = b.beds || 0;
          break;
        case 'baths':
          aValue = a.baths || 0;
          bValue = b.baths || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a[sort.field as keyof Property];
          bValue = b[sort.field as keyof Property];
      }
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Apply pagination
  const startIndex = (pagination.page - 1) * pagination.limit;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pagination.limit);

  return apiCall({
    properties: paginatedProperties,
    total: filteredProperties.length,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(filteredProperties.length / pagination.limit)
  });
};

// Get properties by seller ID
export const getSellerProperties = async (sellerId: string) => {
  const filteredProperties = mockProperties.filter(p => p.sellerId === sellerId);
  
  return apiCall({
    properties: filteredProperties,
    total: filteredProperties.length
  });
};

// Get property by ID
export const getPropertyById = async (id: string) => {
  const property = mockProperties.find(p => p.id === id);
  
  if (!property) {
    return apiCall(null, true);
  }
  
  return apiCall(property);
};

// Create a new property
export const createProperty = async (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
  const newProperty: Property = {
    ...property,
    id: `p${mockProperties.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return apiCall(newProperty);
};

// Update an existing property
export const updateProperty = async (id: string, property: Partial<Property>) => {
  const propertyIndex = mockProperties.findIndex(p => p.id === id);
  
  if (propertyIndex === -1) {
    return apiCall(null, true);
  }
  
  const updatedProperty = { 
    ...mockProperties[propertyIndex], 
    ...property,
    updatedAt: new Date().toISOString()
  };
  
  mockProperties[propertyIndex] = updatedProperty;
  
  return apiCall(updatedProperty);
};

// Delete a property
export const deleteProperty = async (id: string) => {
  const propertyIndex = mockProperties.findIndex(p => p.id === id);
  
  if (propertyIndex === -1) {
    return apiCall(null, true);
  }
  
  mockProperties.splice(propertyIndex, 1);
  
  return apiCall({ success: true });
};

// Generate report functionality
export const generateReport = async () => {
  // Generate a mock CSV report
  const headers = "ID,Title,Type,City,Price,Status,Date\n";
  const rows = mockProperties.map(p => 
    `${p.id},"${p.title}",${p.type},${p.address.city},${p.price},${p.forSale ? 'For Sale' : 'For Rent'},${p.createdAt}`
  ).join('\n');
  
  const csvContent = headers + rows;
  
  try {
    // Create PDF content
    const pdfContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333366; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f2f2f2; padding: 8px; text-align: left; border: 1px solid #ddd; }
            td { padding: 8px; border: 1px solid #ddd; }
            .report-date { text-align: right; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Property Management Report</h1>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>City</th>
                <th>Price (LKR)</th>
                <th>Status</th>
                <th>Date Listed</th>
              </tr>
            </thead>
            <tbody>
              ${mockProperties.map(p => `
                <tr>
                  <td>${p.id}</td>
                  <td>${p.title}</td>
                  <td>${p.type}</td>
                  <td>${p.address.city}</td>
                  <td>${p.price.toLocaleString()}</td>
                  <td>${p.forSale ? 'For Sale' : 'For Rent'}</td>
                  <td>${new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Convert HTML to Blob (in a real app, you would use a PDF library)
    const blob = new Blob([pdfContent], { type: 'text/html' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `property-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return apiCall({ success: true, message: "Report downloaded successfully" });
  } catch (error) {
    console.error("Error generating report:", error);
    return apiCall({ success: false, message: "Failed to generate report" }, true);
  }
};
