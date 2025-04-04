const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Récupérer la liste des amis
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des amis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', authMiddleware, friendController.getFriendsList);

/**
 * @swagger
 * /api/friends/pending:
 *   get:
 *     summary: Récupérer les demandes d'ami en attente
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demandes d'ami en attente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequest'
 */
router.get('/pending', authMiddleware, friendController.getPendingInvitations);

/**
 * @swagger
 * /api/friends/add/{userId}:
 *   post:
 *     summary: Envoyer une demande d'ami
 *     tags: [Friends]
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
 *         description: Demande d'ami envoyée
 *       400:
 *         description: Demande d'ami déjà envoyée
 */
router.post('/add/:userId', authMiddleware, friendController.sendFriendRequest);

/**
 * @swagger
 * /api/friends/accept/{requestId}:
 *   post:
 *     summary: Accepter une demande d'ami
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Demande d'ami acceptée
 *       404:
 *         description: Demande d'ami non trouvée
 */
router.post('/accept/:requestId', authMiddleware, friendController.acceptFriendRequest);

/**
 * @swagger
 * /api/friends/reject/{requestId}:
 *   post:
 *     summary: Rejeter une demande d'ami
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Demande d'ami rejetée
 *       404:
 *         description: Demande d'ami non trouvée
 */
router.post('/reject/:requestId', authMiddleware, friendController.rejectFriendRequest);

/**
 * @swagger
 * /api/friends/remove/{friendId}:
 *   delete:
 *     summary: Supprimer un ami
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ami supprimé
 *       404:
 *         description: Ami non trouvé
 */
router.delete('/remove/:friendId', authMiddleware, friendController.removeFriend);

/**
 * @swagger
 * /api/friends/search:
 *   get:
 *     summary: Rechercher des utilisateurs
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/search', authMiddleware, friendController.searchUsers);

module.exports = router; 