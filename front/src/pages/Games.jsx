import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import gameService from '../services/gameService';
import gameModeService from '../services/gameModeService';

const Games = () => {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [gameModes, setGameModes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newGame, setNewGame] = useState({
        mode_id: '',
        max_players: 2,
        is_private: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activeGames, modes] = await Promise.all([
                    gameService.getActiveGames(),
                    gameModeService.getAllGameModes()
                ]);
                setGames(activeGames);
                setGameModes(modes);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des parties');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateGame = async () => {
        try {
            const createdGame = await gameService.createGame(newGame);
            setGames(prev => [...prev, createdGame]);
            setOpenCreateDialog(false);
            setNewGame({
                mode_id: '',
                max_players: 2,
                is_private: false
            });
        } catch (err) {
            setError(err.message || 'Erreur lors de la création de la partie');
        }
    };

    const handleJoinGame = async (gameId) => {
        try {
            const updatedGame = await gameService.joinGame(gameId);
            setGames(prev => prev.map(game => 
                game.id === gameId ? updatedGame : game
            ));
        } catch (err) {
            setError(err.message || 'Erreur lors de la jonction à la partie');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Parties en cours
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        Créer une partie
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {games.map((game) => (
                        <Grid item xs={12} md={6} key={game.id}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Partie #{game.id}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Mode: {gameModes.find(mode => mode.id === game.mode_id)?.name || 'Inconnu'}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Joueurs: {game.players.length}/{game.max_players}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Statut: {game.status}
                                </Typography>
                                {!game.players.some(p => p.id === user.id) && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleJoinGame(game.id)}
                                        disabled={game.players.length >= game.max_players}
                                    >
                                        Rejoindre
                                    </Button>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
                    <DialogTitle>Créer une nouvelle partie</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Mode de jeu</InputLabel>
                            <Select
                                value={newGame.mode_id}
                                onChange={(e) => setNewGame(prev => ({ ...prev, mode_id: e.target.value }))}
                                label="Mode de jeu"
                            >
                                {gameModes.map((mode) => (
                                    <MenuItem key={mode.id} value={mode.id}>
                                        {mode.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            type="number"
                            label="Nombre maximum de joueurs"
                            value={newGame.max_players}
                            onChange={(e) => setNewGame(prev => ({ ...prev, max_players: parseInt(e.target.value) }))}
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreateDialog(false)}>Annuler</Button>
                        <Button onClick={handleCreateGame} variant="contained">
                            Créer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default Games; 