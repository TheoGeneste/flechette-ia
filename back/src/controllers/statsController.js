const statsService = require('../services/statsService');

const statsController = {
    async getUserStats(req, res) {
        try {
            const stats = await statsService.getUserStats(req.params.userId);
            res.json(stats);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getUserHistory(req, res) {
        try {
            const history = await statsService.getUserHistory(req.params.userId);
            res.json(history);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getUserAchievements(req, res) {
        try {
            const achievements = await statsService.getUserAchievements(req.params.userId);
            res.json(achievements);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getLeaderboard(req, res) {
        try {
            const leaderboard = await statsService.getLeaderboard();
            res.json(leaderboard);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getGameStats(req, res) {
        try {
            const stats = await statsService.getGameStats(req.params.gameId);
            res.json(stats);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = statsController; 