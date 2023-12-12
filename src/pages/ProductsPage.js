import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Stack,
  Typography,
  Button,

  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddProductForm from '../sections/@dashboard/products/AddProductForm';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Agrega el estado para el producto seleccionado

  // Funciones para manejar la apertura y cierre del formulario
  const handleOpenAddForm = () => {
    setIsAddFormOpen(true);
    setSelectedProduct(null); // Limpiar el producto seleccionado al abrir el formulario
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setSelectedProduct(null); // Limpiar el producto seleccionado al cerrar el formulario
  };

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

  const handleOpenEditForm = (product) => {
    setIsAddFormOpen(true);
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const url = `https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/${productId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Producto eliminado con éxito');
        // Actualiza la lista de productos después de eliminar uno
        const updatedProducts = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/')
          .then(response => response.json());
        setProducts(updatedProducts);
      } else {
        console.error('Error al eliminar el producto:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const handleAddToCart = (product) => {
    // Aquí puedes implementar la lógica para agregar el producto al carrito de compras
    console.log(`Agregar producto al carrito: ${product.descripcion}`);
  };
  

  return (
    <Container>
      <Helmet>
        <title>Products | Your App Title</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">List Product</Typography>
        
        <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenAddForm}>
          New Product
        </Button>
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

      {/* Formulario para agregar/editar productos */}
      {isAddFormOpen && (
        <AddProductForm
        onClose={handleCloseAddForm}
        initialProduct={selectedProduct}
        setProducts={setProducts} // Pasa setProducts como prop al componente AddProductForm
      />
    
      )}
    </Container>
  );
};

export default ProductsPage;
