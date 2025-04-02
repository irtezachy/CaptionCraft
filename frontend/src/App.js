import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  ThemeProvider,
  createTheme,
  Snackbar,
  Fade,
  Zoom,
  useMediaQuery,
} from '@mui/material';
import { CloudUpload, Image as ImageIcon, Error as ErrorIcon, AutoAwesome } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const API_URL = 'http://localhost:8000';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [showCaption, setShowCaption] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        setApiStatus(response.data.status);
      } catch (err) {
        setApiStatus('error');
        setError('Backend API is not available. Please ensure the backend server is running.');
      }
    };
    checkApiHealth();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImage(file);
        setError(null);
        setShowCaption(false);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }

      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0].message;
        setError(error);
      }
    },
  });

  const generateCaption = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(`${API_URL}/generate-caption/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaption(response.data.caption);
      setShowCaption(true);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || 'Failed to generate caption. Please try again.';
      setError(errorMessage);
      setCaption('');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        py: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="md">
          <Box sx={{ 
            textAlign: 'center',
            mb: { xs: 2, sm: 4 }
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              📸 CaptionCraft
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom
              sx={{ mb: 2 }}
            >
              AI-Powered Image Captioning System
            </Typography>
          </Box>

          {apiStatus === 'error' && (
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ mb: 2 }}
            >
              Backend API is not available. Please ensure the backend server is running.
            </Alert>
          )}

          <Paper
            {...getRootProps()}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <Box sx={{ mt: 2 }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {image.name}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                py: { xs: 2, sm: 4 }
              }}>
                <CloudUpload sx={{ 
                  fontSize: 48, 
                  color: 'primary.main', 
                  mb: 2,
                  animation: 'pulse 2s infinite',
                }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {isDragActive
                    ? 'Drop the image here'
                    : 'Drag & drop an image here, or click to select'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports JPG, PNG, GIF (max 10MB)
                </Typography>
              </Box>
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={generateCaption}
              disabled={!image || loading || apiStatus === 'error'}
              startIcon={loading ? <CircularProgress size={20} /> : <ImageIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)',
                },
              }}
            >
              {loading ? 'Generating Caption...' : 'Generate Caption'}
            </Button>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={handleCloseError}
            >
              {error}
            </Alert>
          )}

          <Fade in={showCaption}>
            <Zoom in={showCaption}>
              {caption && (
                <Paper 
                  sx={{ 
                    p: 3, 
                    mt: 2, 
                    background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AutoAwesome sx={{ fontSize: 20 }} />
                      Generated Caption:
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.6,
                    }}>
                      {caption}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Zoom>
          </Fade>
        </Container>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ThemeProvider>
  );
}

export default App; 