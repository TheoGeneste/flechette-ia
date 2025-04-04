import React, { useState, useRef } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    styled,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const LoginContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
});

const LoginPaper = styled(Paper)({
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
});

const StyledTextField = styled(TextField)({
    width: '100%',
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#1a237e',
        },
    },
});

const StyledButton = styled(Button)({
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    textTransform: 'none',
    marginTop: '16px',
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const isSubmitting = useRef(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Empêche la double soumission
        if (isSubmitting.current) return;
        isSubmitting.current = true;
        
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            login(response.token);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <LoginContainer>
            <LoginPaper elevation={3}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Connexion
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Connectez-vous pour accéder à votre compte
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <StyledTextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled={loading}
                    />
                    
                    <StyledTextField
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        disabled={loading}
                    />

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <StyledButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </StyledButton>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Pas encore de compte ?{' '}
                        <Link 
                            href="/register" 
                            sx={{ 
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Créer un compte
                        </Link>
                    </Typography>
                </Box>
            </LoginPaper>
        </LoginContainer>
    );
};

export default Login; 