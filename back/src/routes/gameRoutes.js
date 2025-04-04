const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Créer une nouvelle partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - game_mode_id
 *             properties:
 *               game_mode_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Partie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Données invalides
 */
router.post('/', authMiddleware, gameController.createGame);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Récupérer les détails d'une partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la partie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Partie non trouvée
 */
router.get('/:id', authMiddleware, gameController.getGameDetails);

/**
 * @swagger
 * /api/games/{id}/join:
 *   post:
 *     summary: Rejoindre une partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Partie rejointe avec succès
 *       400:
 *         description: Impossible de rejoindre la partie
 */
router.post('/:id/join', authMiddleware, gameController.joinGame);

/**
 * @swagger
 * /api/games/{id}/start:
 *   post:
 *     summary: Démarrer une partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Partie démarrée avec succès
 *       400:
 *         description: Impossible de démarrer la partie
 */
router.post('/:id/start', authMiddleware, gameController.startGame);

/**
 * @swagger
 * /api/games/{id}/turn:
 *   post:
 *     summary: Soumettre un tour de jeu
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - multiplier
 *             properties:
 *               score:
 *                 type: integer
 *               multiplier:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tour soumis avec succès
 *       400:
 *         description: Tour invalide
 */
router.post('/:id/turn', authMiddleware, gameController.submitTurn);

/**
 * @swagger
 * /api/games/{id}/chat:
 *   post:
 *     summary: Envoyer un message dans le chat de la partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message envoyé avec succès
 *       400:
 *         description: Message invalide
 */
router.post('/:id/chat', authMiddleware, gameController.sendMessage);

/**
 * @swagger
 * /api/games/{id}/messages:
 *   get:
 *     summary: Récupérer les messages du chat de la partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/:id/messages', authMiddleware, gameController.getMessages);

/**
 * @swagger
 * /api/games/{id}/invite:
 *   post:
 *     summary: Inviter un joueur à la partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Invitation envoyée avec succès
 *       400:
 *         description: Invitation invalide
 */
router.post('/:id/invite', authMiddleware, gameController.invitePlayer);

/**
 * @swagger
 * /api/games/{id}/stats:
 *   get:
 *     summary: Récupérer les statistiques de la partie
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 */
router.get('/:id/stats', authMiddleware, gameController.getGameStats);

module.exports = router; 