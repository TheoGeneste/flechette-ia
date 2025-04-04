import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Avatar, 
    Button,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import statsService from '../services/statsService';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatar_url: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileData, statsData] = await Promise.all([
                    userService.getProfile(),
                    statsService.getUserStats(user.id)
                ]);
                setProfile(profileData);
                setStats(statsData);
                setFormData({
                    username: profileData.username,
                    email: profileData.email,
                    avatar_url: profileData.avatar_url || ''
                });
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedProfile = await userService.updateProfile(formData);
            setProfile(updatedProfile);
            setEditMode(false);
        } catch (err) {
            setError(err.message || 'Erreur lors de la mise à jour du profil');
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

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar
                                src={profile?.avatar_url}
                                sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                            />
                            {editMode ? (
                                <TextField
                                    fullWidth
                                    label="URL de l'avatar"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            ) : (
                                <Typography variant="h5" gutterBottom>
                                    {profile?.username}
                                </Typography>
                            )}
                            <Button
                                variant="contained"
                                onClick={() => setEditMode(!editMode)}
                                sx={{ mt: 2 }}
                            >
                                {editMode ? 'Annuler' : 'Modifier le profil'}
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            {editMode ? (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Nom d'utilisateur"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Enregistrer les modifications
                                    </Button>
                                </form>
                            ) : (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        Informations du profil
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Email: {profile?.email}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                        Statistiques
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                Parties jouées: {stats?.games_played || 0}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                Victoires: {stats?.wins || 0}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                Moyenne: {stats?.average_score || 0}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">
                                                Meilleur score: {stats?.highest_score || 0}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Profile; 