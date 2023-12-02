// pages/salepage.js
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Button,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Scrollbar from '../components/scrollbar';
import { SaleListHead, SaleListToolbar } from '../sections/@dashboard/sale'; // Asegúrate de importar correctamente.
import SaleList from '../sections/@dashboard/sale/SaleList';
import SaleForm from '../sections/@dashboard/sale/SaleForm';
import SALES from '../_mock/sales';

const TABLE_HEAD = [
  { id: 'userName', label: 'User Name', alignRight: false },
  { id: 'productName', label: 'Product Name', alignRight: false },
  { id: 'purchaseDate', label: 'Purchase Date', alignRight: false },
  { id: '' },
];

const SalePage = () => {
    const [sales, setSales] = useState(SALES);
    const [selected, setSelected] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingSale, setEditingSale] = useState(null);

    const handleOpenForm = () => {
      setOpenForm(true);
      setEditingSale(null);
    };

    const handleCloseForm = () => {
      setOpenForm(false);
      setEditingSale(null);
    };

    const handleAddSale = (newSale) => {
      setSales([...sales, newSale]);
    };

    const handleEditSale = (sale) => {
      setEditingSale(sale);
      setOpenForm(true);
    };

    const handleUpdateSale = (updatedSale) => {
      setSales((prevSales) =>
        prevSales.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale))
      );
    };

    const handleDeleteSale = (saleId) => {
      setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
    };

    return (
      <>
        <Helmet>
          <title>Sales | Your App Title</title>
        </Helmet>

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Sales
            </Typography>
            <Button variant="contained" onClick={handleOpenForm}>
              Add Sale
            </Button>
          </Stack>

          <Card>
            <SaleListToolbar
              numSelected={selected.length}
              onAdd={handleOpenForm}
              onDelete={() => handleDeleteSale(selected)}
            />

            <Scrollbar>
              <SaleList
                sales={sales}
                selected={selected}
                onSelect={(selectedSales) => setSelected(selectedSales)}
                onEdit={handleEditSale}
                onDelete={handleDeleteSale}
              />
            </Scrollbar>
          </Card>
        </Container>

        <SaleForm
          open={openForm}
          onClose={handleCloseForm}
          onSubmit={editingSale ? handleUpdateSale : handleAddSale}
          sale={editingSale}
        />
      </>
    );
  };

  export default SalePage;

// Resto del código similar al de CreditPage.js, pero adaptado para las ventas.
// Ajusta los nombres de los componentes y datos según sea necesario.
