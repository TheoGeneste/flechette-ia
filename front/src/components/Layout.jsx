import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#1a237e',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const StyledLink = styled(Link)({
    color: 'white',
    textDecoration: 'none',
    marginRight: '20px',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

const StyledButton = styled('button')({
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

const MainContent = styled(Box)({
    minHeight: 'calc(100vh - 64px - 64px)', // Hauteur totale - header - footer
    padding: '24px 0',
    backgroundColor: '#f5f5f5',
});

const Footer = styled(Box)({
    backgroundColor: '#1a237e',
    color: 'white',
    padding: '16px 0',
    marginTop: 'auto',
});

const Layout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <StyledAppBar position="static">
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <StyledLink to="/">
                                Jeu de Fléchettes
                            </StyledLink>
                        </Typography>
                        {user ? (
                            <>
                                <StyledLink to="/profile">Mon Profil</StyledLink>
                                <StyledLink to="/games">Parties</StyledLink>
                                <StyledLink to="/friends">Amis</StyledLink>
                                <StyledButton onClick={logout}>
                                    Déconnexion
                                </StyledButton>
                            </>
                        ) : (
                            <>
                                <StyledLink to="/login">Connexion</StyledLink>
                                <StyledLink to="/register">Inscription</StyledLink>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </StyledAppBar>

            <MainContent>
                <Container maxWidth="lg">
                    {children}
                </Container>
            </MainContent>

            <Footer>
                <Container maxWidth="lg">
                    <Typography variant="body2" align="center">
                        © {new Date().getFullYear()} Jeu de Fléchettes - Tous droits réservés
                    </Typography>
                </Container>
            </Footer>
        </Box>
    );
};

export default Layout; 