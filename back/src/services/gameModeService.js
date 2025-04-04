const pool = require('../config/database');

const gameModeService = {
    async getAllGameModes() {
        const [gameModes] = await pool.execute('SELECT * FROM game_modes ORDER BY name');
        return gameModes;
    },

    async getGameModeById(id) {
        const [gameModes] = await pool.execute('SELECT * FROM game_modes WHERE id = ?', [id]);
        if (gameModes.length === 0) {
            throw new Error('Mode de jeu non trouvé');
        }
        return gameModes[0];
    },

    async createGameMode(gameModeData) {
        const { name, description, rules, starting_score, checkout_rules } = gameModeData;
        const [result] = await pool.execute(
            'INSERT INTO game_modes (name, description, rules, starting_score, checkout_rules) VALUES (?, ?, ?, ?, ?)',
            [name, description, rules, starting_score, checkout_rules]
        );
        return { id: result.insertId, ...gameModeData };
    },

    async updateGameMode(id, gameModeData) {
        const { name, description, rules, starting_score, checkout_rules } = gameModeData;
        await pool.execute(
            'UPDATE game_modes SET name = ?, description = ?, rules = ?, starting_score = ?, checkout_rules = ? WHERE id = ?',
            [name, description, rules, starting_score, checkout_rules, id]
        );
        return { id, ...gameModeData };
    },

    async deleteGameMode(id) {
        const [result] = await pool.execute('DELETE FROM game_modes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('Mode de jeu non trouvé');
        }
    }
};

module.exports = gameModeService; 