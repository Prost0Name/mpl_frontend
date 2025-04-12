import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Checkbox,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Navigation from './Navigation';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    '& .MuiCardMedia-root': {
    },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 250,
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
});

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  padding: '8px 24px',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

const ImageGallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState(new Set());

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      navigate('/enter');
    } else {
      fetchImages();
    }
  }, [navigate]);

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://api.vsrs-rs.ru/images');
      // const response = await axios.get('http://localhost:1323/images');
      setImages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;

    try {
      const deletePromises = Array.from(selectedImages).map(id =>
        axios.delete(`https://api.vsrs-rs.ru/images/${id}`)
        // axios.delete(`http://localhost:1323/images/${id}`)
      );
      
      await Promise.all(deletePromises);
      setSelectedImages(new Set());
      fetchImages();
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Navigation />
        <LoadingContainer>
          <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
        </LoadingContainer>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {selectedImages.size > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <DeleteButton
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={deleteSelectedImages}
            >
              Delete Selected ({selectedImages.size})
            </DeleteButton>
          </Box>
        )}
        
        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <StyledCard>
                <StyledCardMedia
                  component="img"
                  image={`data:image/jpeg;base64,${image.image_data}`}
                  alt={`Defective image ${image.id}`}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Uploaded: {new Date(image.created_at).toLocaleString()}
                  </Typography>
                  <Checkbox
                    checked={selectedImages.has(image.id)}
                    onChange={() => toggleImageSelection(image.id)}
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      '&.Mui-checked': {
                        color: 'error.main',
                      },
                    }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ImageGallery; 