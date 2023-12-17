import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Card, CardContent, CardMedia } from '@mui/material';
import Iconify from '../components/iconify';
import AppTrafficBySite from '../sections/@dashboard/AppTrafficBySite/AppTrafficBySite';

export default function DashboardAppPage() {
  const tapiceriaItems = [
    {
      image: '/assets/images/products/product_1.jpg',
      title: 'Diseño Exclusivo',
      description: 'Explora nuestros exclusivos diseños que combinan estilo y comodidad.',
    },
   
    {
      image: '/assets/images/products/product_2.jpg',
      title: 'Diseño Exclusivo',
      description: 'Explora nuestros exclusivos diseños que combinan estilo y comodidad.',
    },
    {
      image: '/assets/images/products/product_3.jpg',
      title: 'Diseño Exclusivo',
      description: 'Explora nuestros exclusivos diseños que combinan estilo y comodidad.',
    },
    {
      image: '/assets/images/products/product_4.jpg',
      title: 'Diseño Exclusivo',
      description: 'Explora nuestros exclusivos diseños que combinan estilo y comodidad.',
    },
    {
      image: '/assets/images/products/product_5.jpg',
      title: 'Diseño Exclusivo',
      description: 'Explora nuestros exclusivos diseños que combinan estilo y comodidad.',
    },
    {
      image: '/assets/images/products/product_7.jpg',
      title: 'Diseño Exclusivo',
      description: 'Explora nuestros exclusivos diseños que combinan estilo y comodidad.',
    },
    // Agrega más elementos según sea necesario
  ];

  return (
    <>
      <Helmet>
        <title>Bienvenidos a nuestra Tapicería</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ marginBottom: 5, textAlign: 'center' }}>
          Descubre la Elegancia del Confort en Nuestra Tapicería
        </Typography>

        <Grid container justifyContent="center" spacing={3}>
          {tapiceriaItems.map((item, index) => (
            <Grid key={index} item xs={12} md={6} lg={4}>
              <Card>
                <CardMedia
                  component="img"
                  alt={`Imagen ${index + 1}`}
                  height="140"
                  image={item.image}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={10} lg={12}>
            <AppTrafficBySite
              title="Visita nuestros sitios"
              list={[
                {
                  name: 'FaceBook',
                  link: 'https://m.facebook.com/story.php?story_fbid=pfbid0M9V21QXNWrG8EtRKJbdzUUssNyPriJSu4YHQrRDXWrwfkwiTVahQiwuXEMXup1ftl&id=100075831464867&mibextid=Nif5oz',
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877f2" width={32} />,
                },
                {
                  name: 'Google',
                  link: 'https://www.google.com',
                  icon: <Iconify icon={'eva:google-fill'} color="#fe0000" width={32} />,
                },
                {
                  name: 'Instagram',
                  link: 'https://www.instagram.com',
                  icon: <Iconify icon={'eva:camera-fill'} color="#fe00fd" width={32} />,
                },
                {
                  name: 'Twitter',
                  link: 'https://twitter.com',
                  icon: <Iconify icon={'eva:twitter-fill'} color="#00cdff" width={32} />,
                },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
