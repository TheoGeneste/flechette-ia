const pool = require('../config/database');

const gameService = {
    async createGame(userId, gameData) {
        const { game_mode_id, max_players } = gameData;
        
        // Vérification du mode de jeu
        const [gameModes] = await pool.execute(
            'SELECT * FROM game_modes WHERE id = ? AND is_active = true',
            [game_mode_id]
        );

        if (gameModes.length === 0) {
            throw new Error('Mode de jeu invalide');
        }

        // Création de la partie
        const [result] = await pool.execute(
            'INSERT INTO games (game_mode_id, created_by, max_players) VALUES (?, ?, ?)',
            [game_mode_id, userId, max_players]
        );

        // Ajout du créateur comme joueur
        await pool.execute(
            'INSERT INTO game_players (game_id, user_id, player_order, score, checkout_type) VALUES (?, ?, 1, ?, ?)',
            [result.insertId, userId, gameModes[0].starting_score, gameModes[0].checkout_type]
        );

        return this.getGameDetails(result.insertId);
    },

    async getGameList(status) {
        const [games] = await pool.execute(`
            SELECT g.*, gm.name as game_mode_name, 
                   (SELECT COUNT(*) FROM game_players WHERE game_id = g.id) as player_count
            FROM games g
            JOIN game_modes gm ON g.game_mode_id = gm.id
            WHERE g.status = ?
            ORDER BY g.created_at DESC
        `, [status]);
        return games;
    },

    async getGameDetails(gameId) {
        const [games] = await pool.execute(`
            SELECT g.*, gm.name as game_mode_name, gm.starting_score, gm.checkout_type
            FROM games g
            JOIN game_modes gm ON g.game_mode_id = gm.id
            WHERE g.id = ?
        `, [gameId]);

        if (games.length === 0) {
            throw new Error('Partie non trouvée');
        }

        const game = games[0];

        // Récupération des joueurs
        const [players] = await pool.execute(`
            SELECT gp.*, u.username, u.avatar_url
            FROM game_players gp
            JOIN users u ON gp.user_id = u.id
            WHERE gp.game_id = ?
            ORDER BY gp.player_order
        `, [gameId]);

        game.players = players;

        // Récupération des messages récents
        const [messages] = await pool.execute(`
            SELECT gm.*, u.username
            FROM game_messages gm
            JOIN users u ON gm.user_id = u.id
            WHERE gm.game_id = ?
            ORDER BY gm.created_at DESC
            LIMIT 50
        `, [gameId]);

        game.messages = messages;

        return game;
    },

    async joinGame(gameId, userId) {
        // Vérification de la partie
        const [games] = await pool.execute(
            'SELECT * FROM games WHERE id = ? AND status = ?',
            [gameId, 'waiting']
        );

        if (games.length === 0) {
            throw new Error('Partie non trouvée ou déjà commencée');
        }

        const game = games[0];

        // Vérification si le joueur est déjà dans la partie
        const [existingPlayers] = await pool.execute(
            'SELECT * FROM game_players WHERE game_id = ? AND user_id = ?',
            [gameId, userId]
        );

        if (existingPlayers.length > 0) {
            throw new Error('Vous êtes déjà dans cette partie');
        }

        // Vérification du nombre maximum de joueurs
        const [players] = await pool.execute(
            'SELECT COUNT(*) as count FROM game_players WHERE game_id = ?',
            [gameId]
        );

        if (players[0].count >= game.max_players) {
            throw new Error('La partie est complète');
        }

        // Récupération du mode de jeu
        const [gameModes] = await pool.execute(
            'SELECT * FROM game_modes WHERE id = ?',
            [game.game_mode_id]
        );

        // Ajout du joueur
        await pool.execute(
            'INSERT INTO game_players (game_id, user_id, player_order, score, checkout_type) VALUES (?, ?, ?, ?, ?)',
            [gameId, userId, players[0].count + 1, gameModes[0].starting_score, gameModes[0].checkout_type]
        );

        return this.getGameDetails(gameId);
    },

    async startGame(gameId, userId) {
        // Vérification que l'utilisateur est le créateur
        const [games] = await pool.execute(
            'SELECT * FROM games WHERE id = ? AND created_by = ?',
            [gameId, userId]
        );

        if (games.length === 0) {
            throw new Error('Vous n\'êtes pas autorisé à démarrer cette partie');
        }

        // Vérification du nombre minimum de joueurs
        const [players] = await pool.execute(
            'SELECT COUNT(*) as count FROM game_players WHERE game_id = ?',
            [gameId]
        );

        if (players[0].count < 2) {
            throw new Error('Il faut au moins 2 joueurs pour démarrer une partie');
        }

        // Mise à jour du statut de la partie
        await pool.execute(
            'UPDATE games SET status = ?, started_at = NOW() WHERE id = ?',
            ['in_progress', gameId]
        );

        return this.getGameDetails(gameId);
    },

    async submitTurn(gameId, userId, turnData) {
        const { dart1, dart2, dart3 } = turnData;

        // Vérification de la partie
        const [games] = await pool.execute(
            'SELECT * FROM games WHERE id = ? AND status = ?',
            [gameId, 'in_progress']
        );

        if (games.length === 0) {
            throw new Error('Partie non trouvée ou non en cours');
        }

        // Vérification que c'est le tour du joueur
        const [players] = await pool.execute(
            'SELECT * FROM game_players WHERE game_id = ? AND user_id = ?',
            [gameId, userId]
        );

        if (players.length === 0) {
            throw new Error('Vous n\'êtes pas dans cette partie');
        }

        const player = players[0];

        // Calcul du score total
        const totalScore = dart1 + dart2 + dart3;

        // Enregistrement du tour
        const [result] = await pool.execute(
            'INSERT INTO game_turns (game_id, player_id, turn_number, dart1_score, dart2_score, dart3_score, total_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [gameId, player.id, 1, dart1, dart2, dart3, totalScore]
        );

        // Mise à jour du score du joueur
        const newScore = player.score - totalScore;
        await pool.execute(
            'UPDATE game_players SET score = ? WHERE id = ?',
            [newScore, player.id]
        );

        // Vérification si la partie est terminée
        if (newScore === 0) {
            await this.endGame(gameId, player.id);
        }

        return {
            id: result.insertId,
            gameId,
            playerId: player.id,
            scores: { dart1, dart2, dart3 },
            totalScore,
            newScore
        };
    },

    async endGame(gameId, winnerId) {
        await pool.execute(
            'UPDATE games SET status = ?, ended_at = NOW() WHERE id = ?',
            ['completed', gameId]
        );

        await pool.execute(
            'UPDATE game_players SET is_winner = true WHERE id = ?',
            [winnerId]
        );

        // Mise à jour des statistiques des joueurs
        const [players] = await pool.execute(
            'SELECT user_id FROM game_players WHERE game_id = ?',
            [gameId]
        );

        for (const player of players) {
            await pool.execute(
                'UPDATE user_stats SET total_games_played = total_games_played + 1 WHERE user_id = ?',
                [player.user_id]
            );
        }

        await pool.execute(
            'UPDATE user_stats SET total_games_won = total_games_won + 1 WHERE user_id = ?',
            [winnerId]
        );
    },

    async sendMessage(gameId, userId, message) {
        const [result] = await pool.execute(
            'INSERT INTO game_messages (game_id, user_id, message) VALUES (?, ?, ?)',
            [gameId, userId, message]
        );

        const [messages] = await pool.execute(`
            SELECT gm.*, u.username
            FROM game_messages gm
            JOIN users u ON gm.user_id = u.id
            WHERE gm.id = ?
        `, [result.insertId]);

        return messages[0];
    },

    async getMessages(gameId) {
        const [messages] = await pool.execute(`
            SELECT gm.*, u.username
            FROM game_messages gm
            JOIN users u ON gm.user_id = u.id
            WHERE gm.game_id = ?
            ORDER BY gm.created_at DESC
            LIMIT 50
        `, [gameId]);

        return messages;
    },

    async invitePlayer(gameId, senderId, receiverId) {
        // Vérification que le joueur existe
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [receiverId]
        );

        if (users.length === 0) {
            throw new Error('Joueur non trouvé');
        }

        // Vérification que l'invitation n'existe pas déjà
        const [existingInvitations] = await pool.execute(
            'SELECT * FROM game_invitations WHERE game_id = ? AND receiver_id = ? AND status = ?',
            [gameId, receiverId, 'pending']
        );

        if (existingInvitations.length > 0) {
            throw new Error('Une invitation est déjà en attente pour ce joueur');
        }

        // Création de l'invitation
        const [result] = await pool.execute(
            'INSERT INTO game_invitations (game_id, sender_id, receiver_id) VALUES (?, ?, ?)',
            [gameId, senderId, receiverId]
        );

        return {
            id: result.insertId,
            gameId,
            senderId,
            receiverId,
            status: 'pending'
        };
    },

    async getGameStats(gameId) {
        const [stats] = await pool.execute(`
            SELECT 
                COUNT(DISTINCT gp.id) as total_players,
                COUNT(DISTINCT gt.id) as total_turns,
                AVG(gt.total_score) as average_score_per_turn,
                MAX(gt.total_score) as highest_turn_score
            FROM games g
            LEFT JOIN game_players gp ON g.id = gp.game_id
            LEFT JOIN game_turns gt ON gp.id = gt.player_id
            WHERE g.id = ?
        `, [gameId]);

        return stats[0];
    }
};

module.exports = gameService;