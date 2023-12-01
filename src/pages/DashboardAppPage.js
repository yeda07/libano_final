import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import AppTrafficBySite from '../sections/@dashboard/AppTrafficBySite/AppTrafficBySite';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,

  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  
  return (
    <>
      <Helmet>
        <title> Pagina Principal  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenidos a nuestra tapiceria
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} >
          <></>
                      </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <></>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <></>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
          <></>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
           <></>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
           
          <></>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
          <></>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
          <></>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
          <></>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
          <></>
    </Grid>
          <Grid item xs={12} md={10} lg={12}>
      <AppTrafficBySite
        title="Visita nuestros sitios"
        list={[
          {
            name: 'FaceBook',
            link: 'https://m.facebook.com/story.php?story_fbid=pfbid0M9V21QXNWrG8EtRKJbdzUUssNyPriJSu4YHQrRDXWrwfkwiTVahQiwuXEMXup1ftl&id=100075831464867&mibextid=Nif5oz', // Reemplaza con tu enlace de Facebook
            icon: <Iconify icon={'eva:facebook-fill'} color="#0053ff" width={32} />,
          },
          {
            name: 'Google',
            link: 'https://www.google.com', // Reemplaza con tu enlace de Google
            icon: <Iconify icon={'eva:google-fill'} color="#fe0000" width={32} />,
          },
          {
            name: 'instagram',
            link: 'https://www.instagram.com',// Reemplaza con tu enlace de LinkedIn
            icon: <Iconify icon={'eva:camera-fill'} color="#fe00fd" width={32} />,
          },
          {
            name: 'Twitter',
            link: 'https://twitter.com', // Reemplaza con tu enlace de Twitter
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
