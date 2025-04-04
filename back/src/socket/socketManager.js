const socketIO = require('socket.io');

class SocketManager {
    constructor() {
        this.io = null;
        this.gameRooms = new Map(); // Map pour stocker les salles de jeu
    }

    initialize(server) {
        this.io = socketIO(server, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log('Nouveau client connecté:', socket.id);

            // Gestion de la création d'une partie
            socket.on('createGame', (gameData) => {
                const roomId = `game_${Date.now()}`;
                socket.join(roomId);
                this.gameRooms.set(roomId, {
                    ...gameData,
                    players: [socket.id],
                    scores: {},
                    currentPlayer: socket.id
                });
                socket.emit('gameCreated', { roomId, gameData });
            });

            // Gestion de la connexion à une partie
            socket.on('joinGame', (roomId) => {
                const game = this.gameRooms.get(roomId);
                if (game && game.players.length < 2) {
                    socket.join(roomId);
                    game.players.push(socket.id);
                    game.scores[socket.id] = game.starting_score;
                    this.io.to(roomId).emit('playerJoined', {
                        playerId: socket.id,
                        players: game.players
                    });
                } else {
                    socket.emit('joinError', 'Partie complète ou inexistante');
                }
            });

            // Gestion des lancers de fléchettes
            socket.on('throwDart', (data) => {
                const { roomId, score, multiplier } = data;
                const game = this.gameRooms.get(roomId);
                
                if (game && game.currentPlayer === socket.id) {
                    const currentScore = game.scores[socket.id];
                    const newScore = currentScore - (score * multiplier);
                    
                    if (newScore >= 0) {
                        game.scores[socket.id] = newScore;
                        
                        // Vérifier si le joueur a gagné
                        if (newScore === 0) {
                            this.io.to(roomId).emit('gameOver', {
                                winner: socket.id,
                                finalScores: game.scores
                            });
                            this.gameRooms.delete(roomId);
                        } else {
                            // Passer au joueur suivant
                            game.currentPlayer = game.players.find(p => p !== socket.id);
                            this.io.to(roomId).emit('scoreUpdate', {
                                playerId: socket.id,
                                newScore,
                                currentPlayer: game.currentPlayer
                            });
                        }
                    } else {
                        socket.emit('invalidThrow', 'Score invalide');
                    }
                }
            });

            // Gestion de la déconnexion
            socket.on('disconnect', () => {
                console.log('Client déconnecté:', socket.id);
                // Nettoyer les salles de jeu
                for (const [roomId, game] of this.gameRooms.entries()) {
                    if (game.players.includes(socket.id)) {
                        this.io.to(roomId).emit('playerLeft', {
                            playerId: socket.id
                        });
                        this.gameRooms.delete(roomId);
                    }
                }
            });
        });
    }

    getIO() {
        return this.io;
    }
}

module.exports = new SocketManager(); 