import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const friendService = {
    async getFriendsList() {
        try {
            const response = await axios.get(`${API_URL}/friends`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la récupération de la liste d\'amis';
        }
    },

    async getPendingInvitations() {
        try {
            const response = await axios.get(`${API_URL}/friends/pending`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la récupération des invitations en attente';
        }
    },

    async sendFriendRequest(userId) {
        try {
            const response = await axios.post(`${API_URL}/friends/add/${userId}`, {}, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de l\'envoi de la demande d\'ami';
        }
    },

    async acceptFriendRequest(requestId) {
        try {
            const response = await axios.post(`${API_URL}/friends/accept/${requestId}`, {}, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de l\'acceptation de la demande d\'ami';
        }
    },

    async removeFriend(friendId) {
        try {
            const response = await axios.delete(`${API_URL}/friends/remove/${friendId}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Erreur lors de la suppression de l\'ami';
        }
    },

    async searchUsers(query) {
        try {
            const response = await axios.get(`${API_URL}/users/search?q=${query}`, {
                headers: authService.getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};

export default friendService; 