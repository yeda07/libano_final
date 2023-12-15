import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Stack,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { AddSaleForm, SalesForm } from '../sections/@dashboard/sale';


const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [products, setProducts] = useState([]);  // Agrega el estado de productos
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isAddSalesFormOpen, setIsAddSalesFormOpen] = useState(false);
  const handleOpenAddForm = () => {
    setIsAddFormOpen(true);
    setSelectedSale(null);
  };

  const handleCloseAddForm = () => {
    setIsAddFormOpen(false);
    setIsAddSalesFormOpen(false);
    setSelectedSale(null);
  };
  const handleOpenSalesForm = () => {
    setIsAddSalesFormOpen(true);
    setSelectedSale(null);
  };
  

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Llamada a la API de ventas
        const responseSales = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventas/');
        const dataSales = await responseSales.json();
        setSales(dataSales);
      } catch (error) {
        console.error('Error al obtener datos de ventas:', error);
      }
    };

    const fetchSalesProducts = async () => {
      try {
        // Llamada a la nueva API de ventasProductos
        const responseSalesProducts = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/');
        const dataSalesProducts = await responseSalesProducts.json();
        setSalesProducts(dataSalesProducts);
      } catch (error) {
        console.error('Error al obtener datos de ventasProductos:', error);
      }
    };

    const fetchProducts = async () => {
      // Llamada a la API de productos
      const productsResponse = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/');
      const productsData = await productsResponse.json();
      setProducts(productsData);
      console.log(productsData);
    };

    fetchSales();
    fetchSalesProducts();
    fetchProducts();
  }, []);

  const getProductNameById = (productId) => {
    const product = products.find((p) => p.id === productId);
  
    if (!product || !product.descripcion) {
      console.error("Product not found or has no description.");
      return 'Producto no encontrado';
    }
  
    return {
      nombre: product.descripcion,
      precioVenta: product.precio_venta,
    };
  };

  const handleAddSale = (newSale) => {
    // Verificar si el producto ya existe en la lista
    const existingProductIndex = salesProducts.findIndex(sp => sp.producto === newSale.producto);

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, actualiza la cantidad
      const updatedSalesProducts = [...salesProducts];
      updatedSalesProducts[existingProductIndex].cantidad += newSale.cantidad;

      setSalesProducts(updatedSalesProducts);
    } else {
      // Si el producto no existe, agrégalo a la lista
      setSalesProducts(prevSalesProducts => [...prevSalesProducts, newSale]);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Sales | Your App Title</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">List Sales</Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" onClick={handleOpenAddForm}>
            New Sale
          </Button>
          <Button variant="contained" onClick={handleOpenSalesForm}>
            Sales Form
          </Button>
        </Stack>
      </Stack>

      {/* Tarjetas de ventas */}
      <Stack direction="row" spacing={2} mt={4}>
        {sales.map((sale) => {
          // Filtrar las ventasProductos relacionadas con la venta actual
          const relatedSalesProducts = salesProducts.filter((sp) => sp.venta === sale.id);

          return (
            <Paper key={sale.id} elevation={3} style={{ padding: '20px', width: '300px' }}>
              <Typography variant="subtitle1">Fecha de Venta: {sale.fecha_venta}</Typography>
              <Typography variant="body2" color="textSecondary">Comprador: {sale.comprador}</Typography>
              <Typography variant="body2" color="textSecondary">Vendedor: {sale.vendedor}</Typography>

              {/* Mostrar productos y cantidades relacionados con la venta */}
              {relatedSalesProducts.reduce((acc, sp) => {
                const existingProduct = acc.find(item => item.producto === sp.producto);
                if (existingProduct) {
                  existingProduct.cantidad += sp.cantidad;
                } else {
                  const productInfo = getProductNameById(sp.producto);
                  acc.push({
                    producto: sp.producto,
                    cantidad: sp.cantidad,
                    precioVenta: productInfo.precioVenta,
                    precioTotal: productInfo.precioVenta * sp.cantidad,
                  });
                }
                return acc;
              }, []).map((item) => (
                <div key={item.producto}>
                  <Typography variant="body2" color="textSecondary">- Producto: {getProductNameById(item.producto).nombre}</Typography>
                  <Typography variant="body2" color="textSecondary">- Cantidad: {item.cantidad}</Typography>
                  <Typography variant="body2" color="textSecondary">- Precio de Venta: ${item.precioVenta}</Typography>
                </div>
              ))}
              {/* Precio Total de la Venta */}
              <Paper elevation={3} style={{ padding: '10px', marginTop: '10px', width: '200px' }}>
                <Typography variant="subtitle1" color="textSecondary">Precio Total de la Venta: ${relatedSalesProducts.reduce((total, item) => total + (getProductNameById(item.producto).precioVenta * item.cantidad), 0)}</Typography>
              </Paper>
            </Paper>
            
          );
        })}
      </Stack>

      {/* Formulario para agregar/editar ventas */}
      {isAddFormOpen && (
        <AddSaleForm
          onClose={handleCloseAddForm}
          initialSale={selectedSale}
          setSales={setSales}
          onAddSale={handleAddSale} // Pasa la función onAddSale al formulario
          products={products} // Pasa la lista de productos al formulario
        />
      )}
      {/* Formulario para ver las ventas */}
      {isAddSalesFormOpen && (
        <SalesForm
          onClose={handleCloseAddForm}
          initialSale={selectedSale}
          setSales={setSales}
          // Asegúrate de pasar las propiedades necesarias aquí
        />
      )}
    </Container>
  );
};

export default SalesPage;
