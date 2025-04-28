import axios from "axios";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx
    return response.data;
  },
  (error) => {
    // Any status codes outside the range of 2xx
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  },
);

// Product API endpoints
export const productAPI = {
  // Get all products with optional filters
  getAll: (params = {}) => apiClient.get("/api/products", { params }),

  // Get single product by ID
  getById: (id) => apiClient.get(`/api/products/${id}`),

  // Create new product
  create: (productData) => apiClient.post("/api/products", productData),

  // Update existing product
  update: (id, productData) =>
    apiClient.put(`/api/products/${id}`, productData),

  // Delete a product
  delete: (id) => apiClient.delete(`/api/products/${id}`),

  // Search products
  search: (query) =>
    apiClient.get("/api/products", { params: { search: query } }),
};

export default apiClient;
