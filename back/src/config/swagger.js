const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Jeu de Fléchettes',
            version: '1.0.0',
            description: 'API pour le jeu de fléchettes en ligne',
            contact: {
                name: 'Support API',
                email: 'support@flechettes.com'
            }
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        avatar_url: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Game: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        game_mode_id: { type: 'integer' },
                        status: { type: 'string', enum: ['waiting', 'in_progress', 'completed'] },
                        created_at: { type: 'string', format: 'date-time' },
                        ended_at: { type: 'string', format: 'date-time' }
                    }
                },
                GameMode: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        rules: { type: 'string' },
                        starting_score: { type: 'integer' },
                        checkout_rules: { type: 'string' }
                    }
                },
                FriendRequest: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        sender_id: { type: 'integer' },
                        receiver_id: { type: 'integer' },
                        status: { type: 'string', enum: ['pending', 'accepted', 'rejected'] },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Stats: {
                    type: 'object',
                    properties: {
                        total_games: { type: 'integer' },
                        games_won: { type: 'integer' },
                        average_score: { type: 'number' },
                        highest_score: { type: 'integer' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 