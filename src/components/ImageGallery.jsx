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
  Paper,
  Checkbox,
  FormControlLabel,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Navigation from './Navigation';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
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
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  padding: '8px 24px',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState(new Set());

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://api.vsrs-rs.ru/images');
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
      <Container maxWidth="lg">
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedImages.has(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                        color="primary"
                        sx={{
                          '&.Mui-checked': {
                            color: 'error.main',
                          },
                        }}
                      />
                    }
                    label="Select for deletion"
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