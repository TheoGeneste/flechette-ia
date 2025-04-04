const gameModeService = require('../services/gameModeService');

const gameModeController = {
    async getAllGameModes(req, res) {
        try {
            const gameModes = await gameModeService.getAllGameModes();
            res.json(gameModes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getGameModeById(req, res) {
        try {
            const gameMode = await gameModeService.getGameModeById(req.params.id);
            res.json(gameMode);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async createGameMode(req, res) {
        try {
            const gameMode = await gameModeService.createGameMode(req.body);
            res.status(201).json(gameMode);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateGameMode(req, res) {
        try {
            const gameMode = await gameModeService.updateGameMode(req.params.id, req.body);
            res.json(gameMode);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteGameMode(req, res) {
        try {
            await gameModeService.deleteGameMode(req.params.id);
            res.json({ message: 'Mode de jeu supprimé avec succès' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = gameModeController; 