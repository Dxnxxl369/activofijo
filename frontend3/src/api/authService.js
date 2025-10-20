// src/api/authService.js
import apiClient from './axiosConfig';

export const login = async (credentials) => {
    const response = await apiClient.post('/token/', credentials);
    return response;
};