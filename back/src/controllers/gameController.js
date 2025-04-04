const gameService = require('../services/gameService');

const gameController = {
    async createGame(req, res) {
        try {
            const game = await gameService.createGame(req.user.id, req.body);
            res.status(201).json(game);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getGameList(req, res) {
        try {
            const games = await gameService.getGameList(req.user.id);
            res.json(games);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getGameDetails(req, res) {
        try {
            const game = await gameService.getGameDetails(req.params.id);
            res.json(game);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async joinGame(req, res) {
        try {
            const game = await gameService.joinGame(req.params.id, req.user.id);
            res.json(game);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async startGame(req, res) {
        try {
            const game = await gameService.startGame(req.params.id, req.user.id);
            res.json(game);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async submitTurn(req, res) {
        try {
            const turn = await gameService.submitTurn(
                req.params.id,
                req.user.id,
                req.body
            );
            res.json(turn);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async sendMessage(req, res) {
        try {
            const message = await gameService.sendMessage(
                req.params.id,
                req.user.id,
                req.body.message
            );
            res.json(message);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getMessages(req, res) {
        try {
            const messages = await gameService.getMessages(req.params.id);
            res.json(messages);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async invitePlayer(req, res) {
        try {
            const invitation = await gameService.invitePlayer(
                req.params.id,
                req.user.id,
                req.body.playerId
            );
            res.json(invitation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getGameStats(req, res) {
        try {
            const stats = await gameService.getGameStats(req.params.id);
            res.json(stats);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = gameController; 