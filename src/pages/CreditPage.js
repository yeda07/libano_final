import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  TableHead,
  TableSortLabel,
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
  IconButton,
  Button,
  Stack,
  Paper,
  MenuItem,
} from '@mui/material';
import Iconify from '../components/iconify';
import { CreditListToolbar } from '../sections/@dashboard/credit';

const CreditListHead = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    { id: 'applicantName', label: 'Usuario' },
    { id: 'total_credito', label: 'Total Crédito' },
    { id: 'amount', label: 'Monto Inicial-consumido' },
    { id: 'status', label: 'Estado' },
    { id: 'applicationDate', label: 'Fecha' },
    { id: 'edit', label: 'Actualizar' },
    { id: 'delete', label: 'Eliminar' },
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span style={{ border: 0 }}>
                  {order === 'desc' ? (
                    <Iconify icon="eva:arrow-downward-fill" />
                  ) : (
                    <Iconify icon="eva:arrow-upward-fill" />
                  )}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const CreditPage = () => {
  const [creditList, setCreditList] = useState([]);
  const [filteredCreditList, setFilteredCreditList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCreditData, setNewCreditData] = useState({
    total_credito: 0,
    monto_inicial: 0,
    fecha_credito: '',
    usuario: 0,
  });

  const [editCreditData, setEditCreditData] = useState({
    id: null,
    total_credito: 0,
    monto_inicial: 0,
    fecha_credito: '',
    usuario: 0,
  });

  const [filterName, setFilterName] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCreditData({
      id: null,
      total_credito: 0,
      monto_inicial: 0,
      fecha_credito: '',
      usuario: 0,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'usuario') {
      setSelectedUser(value);
    }

    setNewCreditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setEditCreditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFilterNameChange = (event) => {
    const { value } = event.target;
    setFilterName(value);

    const filteredCredits = creditList.filter(
      (credit) => credit.applicantName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCreditList(filteredCredits);
  };

  const createNewCredit = async () => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCreditData,
          usuario: selectedUser,
        }),
      });

      if (response.ok) {
        fetchCreditData();
        handleCloseDialog();
      } else {
        console.error('Error creating new credit:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating new credit:', error);
    }
  };

  const deleteCredit = async (creditId) => {
    try {
      const response = await fetch(`https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/${creditId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCreditData();
      } else {
        console.error('Error deleting credit:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting credit:', error);
    }
  };

  const handleOpenEditForm = (credit) => {
    setEditCreditData({
      id: credit.id,
      total_credito: credit.total_credito,
      monto_inicial: credit.amount,
      fecha_credito: credit.applicationDate,
      usuario: credit.usuario,
    });
    setOpenDialog(true);
  };

  const handleEditCredit = async () => {
    try {
      const response = await fetch(`https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/${editCreditData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCreditData),
      });

      if (response.ok) {
        fetchCreditData();
        handleCloseDialog();
      } else {
        console.error('Error updating credit:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating credit:', error);
    }
  };

  const fetchCreditData = async () => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apicreditos/');
      const data = await response.json();

      const mappedData = data.map((apiCredit) => ({
        id: apiCredit.id,
        applicantName: `Usuario ${apiCredit.usuario}`,
        total_credito: apiCredit.total_credito,
        amount: apiCredit.monto_inicial,
        status: 'disponible',
        applicationDate: apiCredit.fecha_credito,
      }));

      setCreditList(mappedData);

      const filteredCredits = mappedData.filter(
        (credit) => credit.applicantName.toLowerCase().includes(filterName.toLowerCase())
      );
      setFilteredCreditList(filteredCredits);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiusers/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRFToken': 'fqp5Ix3rXXm45nlNhkIxN8WCVVEaATtEXMHBmAWBF4c4zLsx75JUcsxO9YcL1Phr',
        },
      });
  
      const data = await response.json();
  
      // Verificar que la respuesta sea un array antes de intentar mapearlo
      if (Array.isArray(data)) {
        setUserList(data);
      } else {
        console.error('La respuesta de la API de usuarios no es un array:', data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  useEffect(() => {
    fetchCreditData();
    fetchUserList();  // Llamamos a la función para cargar la lista de usuarios
  }, [filterName]);

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
          <CreditListToolbar
            filterName={filterName}
            onFilterName={handleFilterNameChange}
            numSelected={0}
            onDelete={() => {}}
          />
          <TableContainer component={Paper}>
            <Table>
              <CreditListHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={filteredCreditList.length}
              />
              <TableBody>
                {filteredCreditList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((credit) => (
                    <TableRow key={credit.id}>
                      <TableCell>{credit.applicantName}</TableCell>
                      <TableCell>{credit.total_credito}</TableCell>
                      <TableCell>{credit.amount}</TableCell>
                      <TableCell>{credit.status}</TableCell>
                      <TableCell>{credit.applicationDate}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditForm(credit)}
                        >
                          <Iconify icon={'eva:edit-fill'} />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => deleteCredit(credit.id)}
                        >
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCreditList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editCreditData.id ? 'Edit Credit' : 'New Credit'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Total_Credito"
            type="number"
            name="total_credito"
            value={editCreditData.total_credito}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Monto Inicial"
            type="number"
            name="monto_inicial"
            value={editCreditData.monto_inicial}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de Credito"
            type="date"
            name="fecha_credito"
            value={editCreditData.fecha_credito}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Usuario"
            type="number"
            name="usuario"
            value={selectedUser}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            {userList.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.nombre}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={editCreditData.id ? handleEditCredit : createNewCredit} color="primary">
            {editCreditData.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreditPage;
