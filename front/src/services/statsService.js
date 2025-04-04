import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const statsService = {
    async getUserStats(userId) {
        try {
            const response = await axios.get(`${API_URL}/stats/user/${userId}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la récupération des statistiques';
        }
    },

    async getGameStats(gameId) {
        try {
            const response = await axios.get(`${API_URL}/stats/games/${gameId}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async getLeaderboard() {
        try {
            const response = await axios.get(`${API_URL}/stats/leaderboard`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};

export default statsService; 