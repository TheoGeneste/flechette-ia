-- Création de la base de données
CREATE DATABASE IF NOT EXISTS darts_game;
USE darts_game;

-- Table des utilisateurs
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des statistiques des utilisateurs
CREATE TABLE user_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_games_played INT DEFAULT 0,
    total_games_won INT DEFAULT 0,
    average_score FLOAT DEFAULT 0,
    highest_checkout INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des modes de jeu
CREATE TABLE game_modes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    starting_score INT NOT NULL,
    checkout_type ENUM('single', 'double') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table des parties
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_mode_id INT NOT NULL,
    created_by INT NOT NULL,
    status ENUM('waiting', 'in_progress', 'completed', 'cancelled') DEFAULT 'waiting',
    max_players INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    ended_at DATETIME,
    FOREIGN KEY (game_mode_id) REFERENCES game_modes(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des joueurs dans une partie
CREATE TABLE game_players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    player_order INT NOT NULL,
    score INT NOT NULL,
    is_winner BOOLEAN DEFAULT FALSE,
    checkout_type ENUM('single', 'double') NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des tours de jeu
CREATE TABLE game_turns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    player_id INT NOT NULL,
    turn_number INT NOT NULL,
    dart1_score INT,
    dart2_score INT,
    dart3_score INT,
    total_score INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES game_players(id)
);

-- Table des messages de jeu
CREATE TABLE game_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des amitiés
CREATE TABLE friendships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id),
    UNIQUE KEY unique_friendship (user1_id, user2_id)
);

-- Table des invitations de jeu
CREATE TABLE game_invitations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Insertion des modes de jeu par défaut
INSERT INTO game_modes (name, description, starting_score, checkout_type) VALUES
('501', 'Jeu classique 501 avec sortie en double', 501, 'double'),
('301', 'Jeu 301 avec sortie en double', 301, 'double'),
('Cricket', 'Mode Cricket standard', 0, 'single');

-- Création des index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email(100));
CREATE INDEX idx_users_username ON users(username(50));
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_game_players_game_id ON game_players(game_id);
CREATE INDEX idx_game_turns_game_id ON game_turns(game_id);
CREATE INDEX idx_game_messages_game_id ON game_messages(game_id);
CREATE INDEX idx_friendships_user1_id ON friendships(user1_id);
CREATE INDEX idx_friendships_user2_id ON friendships(user2_id);
CREATE INDEX idx_game_invitations_game_id ON game_invitations(game_id); 