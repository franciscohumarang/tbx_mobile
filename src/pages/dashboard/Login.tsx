import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container,
  Alert,
  Stack,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if it's the admin user
    if (username === 'TBAdmin' && password === 'password123') {
      // For demo purposes, we'll just navigate to the dashboard
      // In a real app, you would authenticate with a server
      navigate('/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
          
            <Typography variant="h4" component="h1" gutterBottom>
              TB Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Login to access the TB administration panel
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Admin Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Login as Administrator
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Link href="/" underline="hover">
                  Return to Patient Login
                </Link>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DashboardLogin; 