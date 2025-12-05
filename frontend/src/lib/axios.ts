import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Network errors (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return Promise.reject(new Error('Request timeout. Please check your connection and try again.'));
      }
      if (error.message.includes('Network Error')) {
        return Promise.reject(new Error('Network error. Please check your internet connection.'));
      }
      return Promise.reject(new Error('Unable to connect to server. Please try again later.'));
    }

    // HTTP status errors
    const status = error.response.status;
    const responseData = error.response.data;

    // Extract error message from response
    let message = 'An error occurred';
    
    if (responseData && typeof responseData === 'object' && 'error' in responseData) {
      message = (responseData as { error: string }).error;
    } else if (typeof responseData === 'string') {
      message = responseData;
    } else if (error.message) {
      message = error.message;
    }

    // Handle specific status codes
    switch (status) {
      case 400:
        message = message || 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please check your credentials.';
        break;
      case 403:
        message = 'Access forbidden. You do not have permission.';
        break;
      case 404:
        message = message || 'Resource not found.';
        break;
      case 413:
        message = 'File too large. Please upload a smaller file.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service unavailable. Please try again later.';
        break;
      default:
        message = message || `Error ${status}: ${error.message || 'An unexpected error occurred'}`;
    }

    return Promise.reject(new Error(message));
  }
);

// Generic HTTP methods
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },

  // HEAD request
  head: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.head<T>(url, config);
  },

  // OPTIONS request
  options: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.options<T>(url, config);
  },
};

// Export the axios instance for advanced usage if needed
export default apiClient;

