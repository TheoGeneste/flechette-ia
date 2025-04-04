import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000/api';

const gameModeService = {
    async getAllGameModes() {
        try {
            const response = await axios.get(`${API_URL}/game-modes`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async getGameModeById(modeId) {
        try {
            const response = await axios.get(`${API_URL}/game-modes/${modeId}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async createGameMode(modeData) {
        try {
            const response = await axios.post(`${API_URL}/game-modes`, modeData, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async updateGameMode(modeId, modeData) {
        try {
            const response = await axios.put(`${API_URL}/game-modes/${modeId}`, modeData, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    async deleteGameMode(modeId) {
        try {
            const response = await axios.delete(`${API_URL}/game-modes/${modeId}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};

export default gameModeService; 