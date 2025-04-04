const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/stats/user/{userId}:
 *   get:
 *     summary: Récupérer les statistiques d'un utilisateur
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statistiques de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/user/:userId', authMiddleware, statsController.getUserStats);

/**
 * @swagger
 * /api/stats/user/{userId}/history:
 *   get:
 *     summary: Récupérer l'historique des parties d'un utilisateur
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historique des parties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/user/:userId/history', authMiddleware, statsController.getUserHistory);

/**
 * @swagger
 * /api/stats/user/{userId}/achievements:
 *   get:
 *     summary: Récupérer les succès d'un utilisateur
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   unlocked:
 *                     type: boolean
 *                   unlocked_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/user/:userId/achievements', authMiddleware, statsController.getUserAchievements);

/**
 * @swagger
 * /api/stats/leaderboard:
 *   get:
 *     summary: Récupérer le classement général
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classement des joueurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   avatar_url:
 *                     type: string
 *                   games_won:
 *                     type: integer
 *                   games_played:
 *                     type: integer
 *                   win_rate:
 *                     type: number
 *                   highest_checkout:
 *                     type: integer
 */
router.get('/leaderboard', authMiddleware, statsController.getLeaderboard);

/**
 * @swagger
 * /api/stats/game/{gameId}:
 *   get:
 *     summary: Récupérer les statistiques d'une partie
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statistiques de la partie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 game_id:
 *                   type: integer
 *                 game_mode:
 *                   type: string
 *                 total_players:
 *                   type: integer
 *                 total_turns:
 *                   type: integer
 *                 average_score:
 *                   type: number
 *                 highest_score:
 *                   type: integer
 *                 winner:
 *                   type: string
 *       404:
 *         description: Partie non trouvée
 */
router.get('/game/:gameId', authMiddleware, statsController.getGameStats);

module.exports = router; 