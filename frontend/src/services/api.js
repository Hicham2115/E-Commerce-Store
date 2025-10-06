import axios from "axios";

const API_URL = "http://localhost:8000/api";
const IMAGE_BASE_URL = "http://localhost:8000"; // Base URL for images

// Function to get CSRF token from meta tag
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-TOKEN": getCsrfToken()
  },
  withCredentials: true // Important for sending cookies with CORS
});

// Add a request interceptor to include CSRF token in every request
api.interceptors.request.use(
  (config) => {
    // Don't add X-CSRF-TOKEN for GET/HEAD/OPTIONS requests
    if (['get', 'head', 'options'].includes(config.method)) {
      return config;
    }
    
    // For other methods, ensure we have the latest CSRF token
    const token = getCsrfToken();
    if (token) {
      config.headers['X-CSRF-TOKEN'] = token;
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    // If it's a FormData object, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Ensure we're sending the correct content type for JSON data
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
      config.data = JSON.stringify(config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to ensure absolute URLs
const ensureAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Remove 'api' from the path if it exists
  const cleanPath = url.replace(/^\/?api\//, "");
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      method: response.config.method,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Helper function to handle FormData conversion
const prepareRequestData = (data) => {
  // If data is already FormData, return as is
  if (data instanceof FormData) {
    return data;
  }
  
  // For JSON data, convert to FormData if needed
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Handle array values (like about_product)
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (value instanceof File) {
        // Handle file uploads
        formData.append(key, value);
      } else if (typeof value === 'object') {
        // Handle nested objects (stringify them)
        formData.append(key, JSON.stringify(value));
      } else {
        // Handle primitive values
        formData.append(key, value);
      }
    }
  });
  
  return formData;
};

export const productService = {
  getAll: async () => {
    try {
      const response = await api.get("/products");
      // Transform the response to ensure image URLs are absolute
      const products = response.data.map((product) => ({
        ...product,
        image_url: ensureAbsoluteUrl(product.image_url),
        img: ensureAbsoluteUrl(product.img),
        image: product.image
          ? product.image.map((img) => ensureAbsoluteUrl(img))
          : null,
      }));
      return { ...response, data: products };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  
  getById: async (id) => {
    if (!id) {
      return Promise.reject(new Error("Product ID is required"));
    }
    try {
      const response = await api.get(`/products/${id}`);
      // Transform the response to ensure image URL is absolute
      const product = response.data;
      const transformedProduct = {
        ...product,
        image_url: ensureAbsoluteUrl(product.image_url),
        img: ensureAbsoluteUrl(product.img),
        image: product.image
          ? product.image.map((img) => ensureAbsoluteUrl(img))
          : null,
      };
      return { ...response, data: transformedProduct };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data) => {
    try {
      // First, get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
      
      // Get CSRF token from cookies
      const getCsrfToken = () => {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
      };
      
      const csrfToken = getCsrfToken();
      
      if (!csrfToken) {
        throw new Error('Failed to retrieve CSRF token. Please refresh the page and try again.');
      }
      
      const formData = prepareRequestData(data);
      
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken)
        },
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create product (Status: ${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },
  
  update: async (id, data) => {
    try {
      // First, get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
      
      // Get CSRF token from cookies
      const getCsrfToken = () => {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
      };
      
      const csrfToken = getCsrfToken();
      
      if (!csrfToken) {
        throw new Error('Failed to retrieve CSRF token. Please refresh the page and try again.');
      }
      
      const formData = prepareRequestData(data);
      // For Laravel to handle PUT with FormData
      formData.append('_method', 'PUT');
      
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken)
        },
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update product (Status: ${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      // For Laravel, we need to send a POST request with _method=DELETE
      // and include the CSRF token in the headers
      return await api.post(`/products/${id}`, {
        _method: 'DELETE'
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken()
        }
      });
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

export const orderService = {
  getAll: async () => {
    const response = await fetch('http://localhost:8000/api/orders', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch orders');
    }
    
    return await response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`http://localhost:8000/api/orders/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch order ${id}`);
    }
    
    return await response.json();
  },
  
  create: async (data) => {
    try {
      // First, get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
      
      // Get CSRF token from cookies
      const getCsrfToken = () => {
        return document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];
      };
      
      const csrfToken = getCsrfToken();
      
      if (!csrfToken) {
        throw new Error('Failed to retrieve CSRF token. Please refresh the page and try again.');
      }
      
      // Don't use prepareRequestData for FormData
      const formData = data;
      
      // Log the form data being sent
      console.log('Sending form data:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }
      
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken)
        },
        body: formData,
        credentials: 'include'
      });
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        console.error('Error response:', responseData);
        throw new Error(responseData.message || 'Failed to create order');
      }
      
      return responseData;
    } catch (error) {
      console.error('Error in orderService.create:', error);
      throw error;
    }
  },
  
  update: async (id, data) => {
    // First, get CSRF cookie
    await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include',
    });
    
    // Get CSRF token from cookies
    const getCsrfToken = () => {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    };
    
    const csrfToken = getCsrfToken();
    
    if (!csrfToken) {
      throw new Error('Failed to retrieve CSRF token. Please refresh the page and try again.');
    }
    
    const formData = prepareRequestData(data);
    formData.append('_method', 'PUT');
    
    const response = await fetch(`http://localhost:8000/api/orders/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': decodeURIComponent(csrfToken)
      },
      body: formData,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update order ${id}`);
    }
    
    return await response.json();
  }
};

export default api;
