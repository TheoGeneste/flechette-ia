const pool = require('../config/database');

const friendService = {
    async getFriendsList(userId) {
        const [friends] = await pool.execute(`
            SELECT u.id, u.username, u.avatar_url, f.created_at
            FROM users u
            JOIN friendships f ON (f.user1_id = u.id AND f.user2_id = ?) OR (f.user2_id = u.id AND f.user1_id = ?)
            WHERE f.status = 'accepted'
            ORDER BY u.username
        `, [userId, userId]);

        return friends;
    },

    async getPendingInvitations(userId) {
        const [invitations] = await pool.execute(`
            SELECT f.id, u.id as sender_id, u.username, u.avatar_url, f.created_at
            FROM friendships f
            JOIN users u ON f.user1_id = u.id
            WHERE f.user2_id = ? AND f.status = 'pending'
            ORDER BY f.created_at DESC
        `, [userId]);

        return invitations;
    },

    async sendFriendRequest(senderId, receiverId) {
        // Vérification que l'utilisateur existe
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [receiverId]
        );

        if (users.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        // Vérification qu'il n'y a pas déjà une demande en attente
        const [existingRequests] = await pool.execute(`
            SELECT * FROM friendships 
            WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?))
            AND status = 'pending'
        `, [senderId, receiverId, receiverId, senderId]);

        if (existingRequests.length > 0) {
            throw new Error('Une demande d\'ami est déjà en attente');
        }

        // Vérification qu'ils ne sont pas déjà amis
        const [existingFriends] = await pool.execute(`
            SELECT * FROM friendships 
            WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?))
            AND status = 'accepted'
        `, [senderId, receiverId, receiverId, senderId]);

        if (existingFriends.length > 0) {
            throw new Error('Vous êtes déjà amis');
        }

        // Création de la demande d'ami
        const [result] = await pool.execute(
            'INSERT INTO friendships (user1_id, user2_id, status) VALUES (?, ?, ?)',
            [senderId, receiverId, 'pending']
        );

        return {
            id: result.insertId,
            senderId,
            receiverId,
            status: 'pending'
        };
    },

    async acceptFriendRequest(requestId, userId) {
        const [requests] = await pool.execute(
            'SELECT * FROM friendships WHERE id = ? AND user2_id = ? AND status = ?',
            [requestId, userId, 'pending']
        );

        if (requests.length === 0) {
            throw new Error('Demande d\'ami non trouvée');
        }

        await pool.execute(
            'UPDATE friendships SET status = ? WHERE id = ?',
            ['accepted', requestId]
        );

        return {
            id: requestId,
            status: 'accepted'
        };
    },

    async rejectFriendRequest(requestId, userId) {
        const [requests] = await pool.execute(
            'SELECT * FROM friendships WHERE id = ? AND user2_id = ? AND status = ?',
            [requestId, userId, 'pending']
        );

        if (requests.length === 0) {
            throw new Error('Demande d\'ami non trouvée');
        }

        await pool.execute(
            'UPDATE friendships SET status = ? WHERE id = ?',
            ['rejected', requestId]
        );
    },

    async removeFriend(userId, friendId) {
        const [friendships] = await pool.execute(`
            SELECT * FROM friendships 
            WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?))
            AND status = 'accepted'
        `, [userId, friendId, friendId, userId]);

        if (friendships.length === 0) {
            throw new Error('Ami non trouvé');
        }

        await pool.execute(
            'DELETE FROM friendships WHERE id = ?',
            [friendships[0].id]
        );
    },

    async searchUsers(query) {
        const [users] = await pool.execute(`
            SELECT id, username, avatar_url
            FROM users
            WHERE username LIKE ? AND is_active = true
            ORDER BY username
            LIMIT 10
        `, [`%${query}%`]);

        return users;
    }
};

module.exports = friendService; 