
export type Property = {
  _id: string;
  title: string;
  type: 'Residential' | 'Commercial' | 'Industrial';
  description: string;
  address: {
    house: string;
    street: string;
    city: string;
    postalCode: string;
  };
  forSale: boolean;
  price: number;
  discountPrice?: number;
  beds?: number;
  baths?: number;
  options: {
    parkingSpot: boolean;
    furnished: boolean;
  };
  images: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
};

export type Seller = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  profilePicture?: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferredLanguages: string[];
  business?: {
    name?: string;
    registrationNumber?: string;
    designation?: string;
  };
  username: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  registrationDate: string;
};

export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  interests?: string[];
  registrationDate: string;
};

export type User = {
  _id: string;
  role: 'admin' | 'seller' | 'customer';
  name: string;
  email: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
};

export type FilterParams = {
  search?: string;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  city?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  fromBot: boolean;
  timestamp: Date;
};

export type ChatSession = {
  sessionId: string;
  messages: ChatMessage[];
  role: string;
};
