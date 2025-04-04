const express = require('express');
const router = express.Router();
const gameModeController = require('../controllers/gameModeController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/game-modes:
 *   get:
 *     summary: Récupérer tous les modes de jeu
 *     tags: [Game Modes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des modes de jeu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameMode'
 */
router.get('/', authMiddleware, gameModeController.getAllGameModes);

/**
 * @swagger
 * /api/game-modes/{id}:
 *   get:
 *     summary: Récupérer un mode de jeu par son ID
 *     tags: [Game Modes]
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
 *         description: Détails du mode de jeu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameMode'
 *       404:
 *         description: Mode de jeu non trouvé
 */
router.get('/:id', authMiddleware, gameModeController.getGameModeById);

/**
 * @swagger
 * /api/game-modes:
 *   post:
 *     summary: Créer un nouveau mode de jeu
 *     tags: [Game Modes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameMode'
 *     responses:
 *       201:
 *         description: Mode de jeu créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', authMiddleware, gameModeController.createGameMode);

/**
 * @swagger
 * /api/game-modes/{id}:
 *   put:
 *     summary: Mettre à jour un mode de jeu
 *     tags: [Game Modes]
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
 *             $ref: '#/components/schemas/GameMode'
 *     responses:
 *       200:
 *         description: Mode de jeu mis à jour
 *       404:
 *         description: Mode de jeu non trouvé
 */
router.put('/:id', authMiddleware, gameModeController.updateGameMode);

/**
 * @swagger
 * /api/game-modes/{id}:
 *   delete:
 *     summary: Supprimer un mode de jeu
 *     tags: [Game Modes]
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
 *         description: Mode de jeu supprimé
 *       404:
 *         description: Mode de jeu non trouvé
 */
router.delete('/:id', authMiddleware, gameModeController.deleteGameMode);

module.exports = router; 