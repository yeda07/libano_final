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
import { CreditListHead } from '../sections/@dashboard/credit';

const CreditPage = () => {
  const [creditList, setCreditList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCreditData, setNewCreditData] = useState({
    total_credito: 0,
    monto_inicial: 0,
    fecha_credito: '',
    usuario: 0, // Puedes ajustar esto según la lógica de tu aplicación
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - creditList.length) : 0;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCreditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createNewCredit = async () => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCreditData),
      });

      if (response.ok) {
        // Si la creación fue exitosa, actualiza la lista de créditos
        fetchCreditData();
        handleCloseDialog();
      } else {
        console.error('Error creating new credit:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating new credit:', error);
    }
  };

  const fetchCreditData = async () => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/');
      const data = await response.json();

      const mappedData = data.map((apiCredit) => ({
        id: apiCredit.id,
        applicantName: `Usuario ${apiCredit.usuario}`,
        amount: apiCredit.monto_inicial,
        status: 'disponible',
        applicationDate: apiCredit.fecha_credito,
      }));

      setCreditList(mappedData);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Credit | Your App Title</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenDialog}>
              New Credit
            </Button>
          </Stack>
        </Stack>

        <Card>
          <TableContainer component={Paper}>
            <Table>
              <CreditListHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={creditList.length}
              />
              <TableBody>
                {creditList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell>{credit.applicantName}</TableCell>
                      <TableCell>{credit.amount}</TableCell>
                      <TableCell>{credit.status}</TableCell>
                      <TableCell>{credit.applicationDate}</TableCell>
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
            count={creditList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* Dialog para el formulario de nuevo crédito */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>New Credit</DialogTitle>
        <DialogContent>

      
          <TextField
            label="Total del Credito"
            type="number"
            name="total_credito"
            value={newCreditData.total_credito}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="monto inicial"
            type="number"
            name="monto_inicial"
            value={newCreditData.monto_inicial}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="fecha de credito"
            type="date"
            name="fecha_credito"
            value={newCreditData.fecha_credito}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="usuario"
            type="number"
            name="usuario"
            value={newCreditData.usuario}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={createNewCredit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreditPage;
