import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddSaleForm from './AddSaleForm';

const CrudSale = ({ products, selectedSale, setSales }) => {
  const [salesProducts, setSalesProducts] = useState([]);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedSaleForEdit, setSelectedSaleForEdit] = useState(null);

  // Filtra las ventasProductos relacionadas con la venta seleccionada
  const filteredSalesProducts = salesProducts.filter((sp) => sp.venta === selectedSale.id);

  const handleOpenEditForm = (sale) => {
    setEditFormVisible(true);
    setSelectedSaleForEdit(sale);
  };

  useEffect(() => {
    const fetchSalesProducts = async () => {
      // Llamada a la API de ventasProductos
      const salesProductsResponse = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/');
      const salesProductsData = await salesProductsResponse.json();
      setSalesProducts(salesProductsData);
    };

    fetchSalesProducts();
  }, []);

  const getProductNameById = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (!product || !product.descripcion) {
      console.error("Product not found or has no description.");
      return 'Producto no encontrado';
    }

    return product.descripcion;
  };

  const handleDeleteSale = async (saleId) => {
    console.log('Deleting sale with ID:', saleId);

    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta venta?');

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/${saleId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Venta eliminada con éxito desde la API');

        // Actualiza la lista de ventas después de eliminar una desde la API
        const updatedSales = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/')
          .then(response => response.json());
        setSales(updatedSales);
      } else {
        console.error('Error al eliminar la venta desde la API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud a la API:', error);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Sales | Your App Title</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        {/* Remove the title */}
      </Stack>

      {/* Tabla de ventas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>venta</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>cantidad</TableCell>
              <TableCell>Actiones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSalesProducts.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.venta}</TableCell>
                <TableCell>{getProductNameById(sale.producto)}</TableCell>
                <TableCell>{sale.cantidad}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditForm(sale)} color="primary" aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteSale(sale.id)} color="error" aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Formulario de edición */}
      {editFormVisible && (
        <AddSaleForm
          onClose={() => {
            setEditFormVisible(false);
            setSelectedSaleForEdit(null);
          }}
          initialSale={selectedSaleForEdit}
          setSales={setSales}
          products={products}
        />
      )}
    </Container>
  );
};

// Agrega validación de PropTypes
CrudSale.propTypes = {
  products: PropTypes.array.isRequired,
  selectedSale: PropTypes.object.isRequired,
  setSales: PropTypes.func.isRequired,
};

export default CrudSale;
