import { Helmet } from 'react-helmet-async';

// @mui

import { Grid, Container, Typography, Card, CardContent, CardMedia } from '@mui/material';
// components
import Iconify from '../components/iconify';
import AppTrafficBySite from '../sections/@dashboard/AppTrafficBySite/AppTrafficBySite';
// sections


// ----------------------------------------------------------------------

export default function DashboardAppPage() {

  // Función para obtener rutas de imágenes locales
  const getImagePath = (imageName) => `/public/assets/images/products${imageName}`; // Ajusta la ruta según tu estructura de carpetas


  return (
    <>
      <Helmet>
        <title>Pagina Principal</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenidos a nuestra tapiceria
        </Typography>

        <Grid container spacing={3}>
          {/* Otras cards existentes */}
      
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardMedia
                component="img"
                alt="mueble"
                height="200"
                image={getImagePath('yeda.jpg')}
                style={{ width: '100%', objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Título del Card 1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                descripcion
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardMedia
                component="img"
                alt="Imagen 2"
                height="200"
                image={getImagePath('imagen2.jpg')}
                style={{ width: '100%', objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Título del Card 2
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  descripcion
                </Typography>
              </CardContent>
            </Card>
          </Grid>




          {/* AppTrafficBySite con campos de imágenes locales */}
          <Grid item xs={12} md={10} lg={12}>
            <AppTrafficBySite
              title="Visita nuestros sitios"
              list={[
                {
                  name: 'FaceBook',
                  link: 'https://m.facebook.com/story.php?story_fbid=pfbid0M9V21QXNWrG8EtRKJbdzUUssNyPriJSu4YHQrRDXWrwfkwiTVahQiwuXEMXup1ftl&id=100075831464867&mibextid=Nif5oz',
                  icon: <Iconify icon={'eva:facebook-fill'} color="#0053ff" width={32} />,
                  image: getImagePath('facebook-icon.png'),
                },
                {
                  name: 'Google',
                  link: 'https://www.google.com',
                  icon: <Iconify icon={'eva:google-fill'} color="#fe0000" width={32} />,
                  image: getImagePath('google-icon.png'),
                },
                {
                  name: 'Instagram',
                  link: 'https://www.instagram.com',
                  icon: <Iconify icon={'eva:camera-fill'} color="#fe00fd" width={32} />,
                  image: getImagePath('instagram-icon.png'),
                },
                {
                  name: 'Twitter',
                  link: 'https://twitter.com',
                  icon: <Iconify icon={'eva:twitter-fill'} color="#00cdff" width={32} />,
                  image: getImagePath('twitter-icon.png'),
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
