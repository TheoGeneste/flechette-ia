import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const gameService = {
    async createGame(gameModeId) {
        try {
            const response = await axios.post(`${API_URL}/games`, {
                game_mode_id: gameModeId
            }, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la création de la partie';
        }
    },

    async joinGame(gameId) {
        try {
            const response = await axios.post(`${API_URL}/games/${gameId}/join`, {}, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async updateScore(gameId, scoreData) {
        try {
            const response = await axios.post(`${API_URL}/games/${gameId}/score`, scoreData, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async getGame(gameId) {
        try {
            const response = await axios.get(`${API_URL}/games/${gameId}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async getActiveGames() {
        try {
            const response = await axios.get(`${API_URL}/games/active`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async getGameModes() {
        try {
            const response = await axios.get(`${API_URL}/game-modes`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la récupération des modes de jeu';
        }
    },

    async getGameModeById(id) {
        try {
            const response = await axios.get(`${API_URL}/game-modes/${id}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la récupération du mode de jeu';
        }
    }
};

export default gameService; 