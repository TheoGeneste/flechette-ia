import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authService = {
    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/users/register`, {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de l\'inscription';
        }
    },

    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/users/login`, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la connexion';
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};

export default authService; 