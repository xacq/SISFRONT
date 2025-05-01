import axios from 'axios';
import { UserData , UserProfileData } from '../types/UserTypes';

const api = axios.create({
  baseURL: 'http://192.168.3.80:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura interceptores para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      return Promise.reject({
        message: error.response.data.message || 'Error en la solicitud',
        status: error.response.status,
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return Promise.reject({
        message: 'No se recibió respuesta del servidor',
      });
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject({
        message: 'Error al configurar la solicitud',
      });
    }
  }
);

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getRecommendations = async (userId: number) => {
  try {
    const response = await api.get(`/users/${userId}/recommendations`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addConsumption = async (userId: number, productId: number, quantity: number) => {
  try {
    const response = await api.post(`/users/${userId}/consumption`, { productId, quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveUserProfile = async (userId: number, profileData: UserProfileData) => {
  try {
    // Convertir dietary_restrictions a string separado por comas
    const dataToSend = {
      ...profileData,
      dietary_restrictions: profileData.dietary_restrictions.join(',')
    };
    
    const response = await api.post(`/users/${userId}/profile`, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getProductCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: string) => {
  try {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductDetails = async (productId: string) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductNutrition = async (productId: string) => {
  try {
    const response = await api.get(`/products/${productId}/nutrition`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductFlavors = async (productId: string) => {
  try {
    const response = await api.get(`/products/${productId}/flavors`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductAttributes = async (productId: string) => {
  try {
    const response = await api.get(`/products/${productId}/attributes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;