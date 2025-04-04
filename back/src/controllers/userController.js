const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const user = await userService.createUser(username, email, password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.authenticateUser(email, password);
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({ token, user });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },

    async getProfile(req, res) {
        try {
            console.log('User ID from token:', req.user.id); // Debug log
            const user = await userService.getUserById(req.user.id);
            res.json(user);
        } catch (error) {
            console.error('Error in getProfile:', error); // Debug log
            res.status(400).json({ message: error.message });
        }
    },

    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { username, email, avatar_url } = req.body;

            // Créer un objet avec uniquement les champs définis
            const updateData = {};
            if (username !== undefined) updateData.username = username;
            if (email !== undefined) updateData.email = email;
            if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

            // Vérifier si au moins un champ est à mettre à jour
            if (Object.keys(updateData).length === 0) {
                throw new Error('Aucune donnée à mettre à jour');
            }

            const updatedUser = await userService.updateUser(userId, updateData);
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getUserStats(req, res) {
        try {
            const userId = req.params.id;
            const stats = await userService.getUserStats(userId);
            res.json(stats);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = userController; 