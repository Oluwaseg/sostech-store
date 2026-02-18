import type { ApiResponse } from '@/types/api-response';
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3025/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      status: 'error',
      statusCode: error.response?.status || 500,
      message: error.message || 'Network error',
      code: null,
      errors: null,
    });
  }
);

export default api;
