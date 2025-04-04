const pool = require('../config/database');

const statsService = {
    async getUserStats(userId) {
        const [stats] = await pool.execute(`
            SELECT 
                us.*,
                u.username,
                u.avatar_url,
                (SELECT COUNT(*) FROM games g 
                 JOIN game_players gp ON g.id = gp.game_id 
                 WHERE gp.user_id = ? AND g.status = 'completed') as total_games_completed,
                (SELECT COUNT(*) FROM games g 
                 JOIN game_players gp ON g.id = gp.game_id 
                 WHERE gp.user_id = ? AND gp.is_winner = true) as total_games_won,
                (SELECT AVG(gt.total_score) FROM game_turns gt 
                 JOIN game_players gp ON gt.player_id = gp.id 
                 WHERE gp.user_id = ?) as average_score_per_turn,
                (SELECT MAX(gt.total_score) FROM game_turns gt 
                 JOIN game_players gp ON gt.player_id = gp.id 
                 WHERE gp.user_id = ?) as highest_turn_score
            FROM user_stats us
            JOIN users u ON us.user_id = u.id
            WHERE us.user_id = ?
        `, [userId, userId, userId, userId, userId]);

        if (stats.length === 0) {
            throw new Error('Statistiques non trouvées');
        }

        return stats[0];
    },

    async getUserHistory(userId) {
        const [history] = await pool.execute(`
            SELECT 
                g.id as game_id,
                gm.name as game_mode,
                g.created_at,
                g.ended_at,
                gp.score as final_score,
                gp.is_winner,
                (SELECT COUNT(*) FROM game_players WHERE game_id = g.id) as total_players
            FROM games g
            JOIN game_modes gm ON g.game_mode_id = gm.id
            JOIN game_players gp ON g.id = gp.game_id
            WHERE gp.user_id = ? AND g.status = 'completed'
            ORDER BY g.ended_at DESC
            LIMIT 50
        `, [userId]);

        return history;
    },

    async getUserAchievements(userId) {
        const [achievements] = await pool.execute(`
            SELECT 
                'first_win' as achievement,
                CASE WHEN (SELECT COUNT(*) FROM game_players WHERE user_id = ? AND is_winner = true) > 0 
                     THEN true ELSE false END as unlocked,
                (SELECT MIN(ended_at) FROM games g 
                 JOIN game_players gp ON g.id = gp.game_id 
                 WHERE gp.user_id = ? AND gp.is_winner = true) as unlocked_at
            UNION ALL
            SELECT 
                'high_score' as achievement,
                CASE WHEN (SELECT MAX(total_score) FROM game_turns gt 
                          JOIN game_players gp ON gt.player_id = gp.id 
                          WHERE gp.user_id = ?) >= 180 
                     THEN true ELSE false END as unlocked,
                (SELECT MIN(created_at) FROM game_turns gt 
                 JOIN game_players gp ON gt.player_id = gp.id 
                 WHERE gp.user_id = ? AND gt.total_score >= 180) as unlocked_at
            UNION ALL
            SELECT 
                'perfect_game' as achievement,
                CASE WHEN (SELECT COUNT(*) FROM games g 
                          JOIN game_players gp ON g.id = gp.game_id 
                          WHERE gp.user_id = ? AND gp.score = 0) > 0 
                     THEN true ELSE false END as unlocked,
                (SELECT MIN(ended_at) FROM games g 
                 JOIN game_players gp ON g.id = gp.game_id 
                 WHERE gp.user_id = ? AND gp.score = 0) as unlocked_at
        `, [userId, userId, userId, userId, userId, userId]);

        return achievements;
    },

    async getLeaderboard() {
        const [leaderboard] = await pool.execute(`
            SELECT 
                u.id,
                u.username,
                u.avatar_url,
                us.total_games_won,
                us.total_games_played,
                ROUND((us.total_games_won / us.total_games_played) * 100, 2) as win_rate,
                us.highest_checkout
            FROM user_stats us
            JOIN users u ON us.user_id = u.id
            WHERE us.total_games_played > 0
            ORDER BY win_rate DESC, total_games_won DESC
            LIMIT 100
        `);

        return leaderboard;
    },

    async getGameStats(gameId) {
        const [stats] = await pool.execute(`
            SELECT 
                g.id,
                gm.name as game_mode,
                g.created_at,
                g.ended_at,
                COUNT(DISTINCT gp.id) as total_players,
                COUNT(DISTINCT gt.id) as total_turns,
                AVG(gt.total_score) as average_score_per_turn,
                MAX(gt.total_score) as highest_turn_score,
                (SELECT username FROM users u 
                 JOIN game_players gp ON u.id = gp.user_id 
                 WHERE gp.game_id = g.id AND gp.is_winner = true) as winner
            FROM games g
            JOIN game_modes gm ON g.game_mode_id = gm.id
            LEFT JOIN game_players gp ON g.id = gp.game_id
            LEFT JOIN game_turns gt ON gp.id = gt.player_id
            WHERE g.id = ?
            GROUP BY g.id, gm.name, g.created_at, g.ended_at
        `, [gameId]);

        if (stats.length === 0) {
            throw new Error('Statistiques de partie non trouvées');
        }

        return stats[0];
    }
};

module.exports = statsService; 