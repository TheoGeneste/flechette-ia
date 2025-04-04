import React from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    Button, 
    Grid,
    Paper,
    styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroSection = styled(Box)({
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    color: 'white',
    padding: '80px 0',
    textAlign: 'center',
    marginBottom: '40px',
});

const FeatureCard = styled(Paper)({
    height: '100%',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
});

const StyledButton = styled(Button)({
    marginTop: '16px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    textTransform: 'none',
});

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Box>
            <HeroSection>
                <Container maxWidth="lg">
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Bienvenue sur le Jeu de Fléchettes
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
                        Le meilleur jeu de fléchettes en ligne
                    </Typography>
                    {!user && (
                        <StyledButton
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => navigate('/register')}
                        >
                            Commencer à jouer
                        </StyledButton>
                    )}
                </Container>
            </HeroSection>

            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FeatureCard elevation={3}>
                            <Typography variant="h5" gutterBottom>
                                Jouez en ligne
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Affrontez des joueurs du monde entier dans des parties passionnantes.
                                Choisissez parmi différents modes de jeu et défiez vos amis.
                            </Typography>
                            {user ? (
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/games')}
                                >
                                    Jouer maintenant
                                </StyledButton>
                            ) : (
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/register')}
                                >
                                    S'inscrire pour jouer
                                </StyledButton>
                            )}
                        </FeatureCard>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <FeatureCard elevation={3}>
                            <Typography variant="h5" gutterBottom>
                                Suivez vos statistiques
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Consultez vos performances détaillées, suivez votre progression
                                et comparez-vous avec vos amis sur le classement.
                            </Typography>
                            {user ? (
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/profile')}
                                >
                                    Voir mes stats
                                </StyledButton>
                            ) : (
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/login')}
                                >
                                    Se connecter
                                </StyledButton>
                            )}
                        </FeatureCard>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <FeatureCard elevation={3}>
                            <Typography variant="h5" gutterBottom>
                                Rejoignez la communauté
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Ajoutez des amis, créez des parties privées et participez
                                à des tournois pour gagner des récompenses.
                            </Typography>
                            {user ? (
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/friends')}
                                >
                                    Gérer mes amis
                                </StyledButton>
                            ) : (
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/register')}
                                >
                                    Créer un compte
                                </StyledButton>
                            )}
                        </FeatureCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home; 