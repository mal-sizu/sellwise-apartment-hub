import axios from 'axios';

// Create a reusable API client for all backend communication
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api', // Real backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access, please login again');
        // Redirect to login or clear credentials
      } else if (status === 403) {
        console.error('Forbidden access');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;