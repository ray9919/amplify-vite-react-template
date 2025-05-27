import { useAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography } from '@mui/material';
import PhotoShow from './components/PhotoShow';

function App() {
  const { signOut } = useAuthenticator();

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            marginRight: '2rem' 
          }}>
            Photo Editor App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/photo" sx={{ mr: 2 }}>
            Photo Editor
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={signOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={
            <div>
              <Typography variant="h3" gutterBottom sx={{ 
                fontWeight: 'bold',
                mb: 4
              }}>
                Welcome to Photo Editor App
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'text.secondary',
                mb: 3,
                maxWidth: '600px'
              }}>
                A powerful tool for editing and enhancing your photos with professional features.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/photo" 
                size="large"
                sx={{ mt: 2 }}
              >
                Start Editing
              </Button>
            </div>
          } />
          <Route path="/photo" element={<PhotoShow />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
