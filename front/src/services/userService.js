import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const userService = {
    async getProfile() {
        try {
            const response = await axios.get(`${API_URL}/users/profile`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la récupération du profil';
        }
    },

    async updateProfile(userData) {
        try {
            const response = await axios.put(`${API_URL}/users/profile`, userData, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
        }
    },

    async searchUsers(query) {
        try {
            const response = await axios.get(`${API_URL}/friends/search`, {
                params: { query },
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la recherche d\'utilisateurs';
        }
    }
};

export default userService; 