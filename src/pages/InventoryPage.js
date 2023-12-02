import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import Iconify from '../components/iconify';
import { InventoryListHead } from '../sections/@dashboard/inventory';

const InventoryPage = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemData, setNewItemData] = useState({
    id: '',
    productName: '',
    quantity: '',
    price: '',
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - inventoryList.length) : 0;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    // Aquí puedes manejar la lógica para agregar el nuevo ítem al inventario
    // Puedes realizar una solicitud para guardar el nuevo ítem en tu API, por ejemplo

    // Después de agregar el ítem, actualiza la lista y cierra el diálogo
    setInventoryList((prevList) => [...prevList, newItemData]);
    handleCloseDialog();
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/');
        const data = await response.json();

        const mappedData = data.map((inventoryItem) => ({
          id: inventoryItem.id,
          itemName: inventoryItem.descripcion,
          quantity: 1, // Ajusta según la lógica de tu aplicación
          price: inventoryItem.precio_venta,
          fabricationDate: inventoryItem.fecha_fabricacion, // Nuevo campo para la fecha de fabricación
          // Agrega más campos según sea necesario
        }));

        setInventoryList(mappedData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Inventory | Your App Title</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenDialog}>
              Add Item
            </Button>
          </Stack>
        </Stack>

        <Card>
          <TableContainer component={Paper}>
            <Table>
              <InventoryListHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={inventoryList.length}
              />
              <TableBody>
                {inventoryList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((inventoryItem) => (
                    <TableRow key={inventoryItem.id}>
                      <TableCell>{inventoryItem.itemName}</TableCell>
                      <TableCell>{inventoryItem.quantity}</TableCell>
                      <TableCell>{inventoryItem.price}</TableCell>
                      <TableCell>{inventoryItem.fabricationDate}</TableCell>
                      {/* Agrega más celdas para campos adicionales */}
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={inventoryList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            type="text"
            name="id"
            value={newItemData.id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Name"
            type="text"
            name="productName"
            value={newItemData.productName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            name="quantity"
            value={newItemData.quantity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            name="price"
            value={newItemData.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {/* Agrega más campos según sea necesario */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryPage;
