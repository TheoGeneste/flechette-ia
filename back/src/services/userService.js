const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userService = {
    async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return { id: result.insertId, username, email };
    },

    async authenticateUser(email, password) {
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Mot de passe incorrect');
        }

        return { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url };
    },

    async getUserById(userId) {
        const [users] = await pool.execute('SELECT id, username, email, avatar_url FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            throw new Error('Utilisateur non trouvé');
        }
        return users[0];
    },

    async updateUser(userId, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(userId);

        const [result] = await pool.execute(
            `UPDATE users SET ${fields} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error('Utilisateur non trouvé');
        }

        return this.getUserById(userId);
    },

    async getUserStats(userId) {
        const [stats] = await pool.execute(`
            SELECT 
                COUNT(*) as total_games,
                SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) as games_won,
                AVG(score) as average_score,
                MAX(score) as highest_score
            FROM game_stats
            WHERE user_id = ?
        `, [userId, userId]);

        return stats[0];
    }
};

module.exports = userService; 