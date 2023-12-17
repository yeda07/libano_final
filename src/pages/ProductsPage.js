import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Stack,
  Typography,
  Paper,
} from '@mui/material';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener datos', error);
      }
    };

    fetchData();
  }, []);

 

  return (
    <Container>
      <Helmet>
        <title>Products | Your App Title</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Existencia de productos </Typography>
      </Stack>

      {/* Tabla de productos */}
      <Stack direction="row" spacing={2} mt={4}>
        {products.map((product) => (
          <Paper key={product._id} elevation={3} style={{ padding: '20px', width: '300px' }}>
            <img src={product.imagen} alt={product.descripcion} style={{ width: '100%', height: '290px', objectFit: 'cover' }} />
            <Typography variant="h6" style={{ marginTop: '10px' }}>{product.descripcion}</Typography>
            <Typography variant="body1" color="textSecondary">${product.precio_venta}</Typography>
            
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default ProductsPage;
