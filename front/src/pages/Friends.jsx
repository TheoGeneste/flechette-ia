import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import friendService from '../services/friendService';

const Friends = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsList = await friendService.getFriends();
                setFriends(friendsList);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des amis');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    const handleSearch = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await friendService.searchUsers(query);
            setSearchResults(results.filter(result => 
                result.id !== user.id && 
                !friends.some(friend => friend.id === result.id)
            ));
        } catch (err) {
            setError(err.message || 'Erreur lors de la recherche');
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            const newFriend = await friendService.addFriend(friendId);
            setFriends(prev => [...prev, newFriend]);
            setSearchResults(prev => prev.filter(user => user.id !== friendId));
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'ajout d\'ami');
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await friendService.removeFriend(friendId);
            setFriends(prev => prev.filter(friend => friend.id !== friendId));
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression d\'ami');
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
                        Mes amis
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Ajouter un ami
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Liste d'amis
                            </Typography>
                            <List>
                                {friends.map((friend) => (
                                    <ListItem
                                        key={friend.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleRemoveFriend(friend.id)}
                                            >
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={friend.avatar_url} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={friend.username}
                                            secondary={friend.email}
                                        />
                                    </ListItem>
                                ))}
                                {friends.length === 0 && (
                                    <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                                        Vous n'avez pas encore d'amis
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                        <DialogTitle>Ajouter un ami</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                label="Rechercher un utilisateur"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    handleSearch(e.target.value);
                                }}
                                sx={{ mt: 2 }}
                            />
                            <List>
                                {searchResults.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleAddFriend(user.id)}
                                            >
                                                <PersonAddIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={user.avatar_url} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.username}
                                            secondary={user.email}
                                        />
                                    </ListItem>
                                ))}
                                {searchQuery.length > 0 && searchResults.length === 0 && (
                                    <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                                        Aucun utilisateur trouvé
                                    </Typography>
                                )}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenAddDialog(false)}>Fermer</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Box>
        </Container>
    );
};

export default Friends; 