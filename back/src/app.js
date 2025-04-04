const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const socketManager = require('./socket/socketManager');

// Configuration des variables d'environnement
dotenv.config();

// Import des routes
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const friendRoutes = require('./routes/friendRoutes');
const statsRoutes = require('./routes/statsRoutes');
const gameModeRoutes = require('./routes/gameModeRoutes');

const app = express();
const server = http.createServer(app);

// Initialisation des WebSockets
socketManager.initialize(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/game-modes', gameModeRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Documentation Swagger disponible à l'adresse: http://localhost:${PORT}/api-docs`);
});

module.exports = app; 