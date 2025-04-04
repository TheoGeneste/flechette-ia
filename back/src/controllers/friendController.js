const friendService = require('../services/friendService');

const friendController = {
    async getFriendsList(req, res) {
        try {
            const friends = await friendService.getFriendsList(req.user.id);
            res.json(friends);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getPendingInvitations(req, res) {
        try {
            const invitations = await friendService.getPendingInvitations(req.user.id);
            res.json(invitations);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async sendFriendRequest(req, res) {
        try {
            const request = await friendService.sendFriendRequest(req.user.id, req.params.userId);
            res.status(201).json(request);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async acceptFriendRequest(req, res) {
        try {
            const friendship = await friendService.acceptFriendRequest(req.params.requestId, req.user.id);
            res.json(friendship);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async rejectFriendRequest(req, res) {
        try {
            await friendService.rejectFriendRequest(req.params.requestId, req.user.id);
            res.json({ message: 'Demande d\'ami rejetée' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async removeFriend(req, res) {
        try {
            await friendService.removeFriend(req.user.id, req.params.friendId);
            res.json({ message: 'Ami supprimé' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async searchUsers(req, res) {
        try {
            const users = await friendService.searchUsers(req.query.query);
            res.json(users);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = friendController; 