import React, { useState } from 'react';
 // Assuming the CreditForm component is in the same directory as the CreditPage component.

import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Label from '../components/label'; // Asegúrate de tener un componente Label definido
import Iconify from '../components/iconify'; 
import Scrollbar from '../components/scrollbar';

import { CreditListHead, CreditListToolbar,} from '../sections/@dashboard/credit'; 
import CreditForm from '../sections/@dashboard/credit/CreditForm'; 
import PaymentForm from '../sections/@dashboard/credit/PaymentForm';// Replace './CreditForm' with the actual path to your CreditForm component.
// Asegúrate de importar CreditListHead y CreditListToolbar correctamente.
import CREDITLIST from '../_mock/credit'; // Supongo que tienes un archivo con datos simulados de créditos.

const TABLE_HEAD = [
  { id: 'applicantName', label: 'Applicant Name', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'applicationDate', label: 'Application Date', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_credit) => _credit.applicantName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CreditPage() {
  
    const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('applicantName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = CREDITLIST.map((n) => n.applicantName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const [isCreditFormOpen, setIsCreditFormOpen] = useState(false);

  const openCreditForm = () => {
    setIsCreditFormOpen(true);
  };
  
  const closeCreditForm = () => {
    setIsCreditFormOpen(false);
  };
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  const openPaymentForm = () => {
    setIsPaymentFormOpen(true);
  };

  const closePaymentForm = () => {
    setIsPaymentFormOpen(false);
  };
  const handleClick = (event, applicantName) => {
    const selectedIndex = selected.indexOf(applicantName);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, applicantName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - CREDITLIST.length) : 0;

  const filteredCredits = applySortFilter(CREDITLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredCredits.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Credit | Your App Title</title>
      </Helmet>

      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
  <Stack direction="row" alignItems="center" justifyContent="flex-end">
          
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openCreditForm}>
          New Credit
          </Button>

          </Stack> 
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
  <Stack direction="row" alignItems="center" justifyContent="flex-end">
    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openPaymentForm}>
      New Payment
    </Button>
  </Stack>
</Stack>

        <Card>
          <CreditListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CreditListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={CREDITLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCredits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, applicantName, amount, status, applicationDate } = row;
                    const selectedCredit = selected.indexOf(applicantName) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedCredit}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedCredit} onChange={(event) => handleClick(event, applicantName)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          {applicantName}
                        </TableCell>

                        <TableCell align="left">{amount}</TableCell>

                        <TableCell align="left">{applicationDate}</TableCell>
                        
    {   /*  aqui cambio en color aplication date este era el eror   */  }                       
                        <TableCell align="left">
                            
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell>
                     

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={CREDITLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>


      
    {/* Conditional rendering of CreditForm */}
    {isCreditFormOpen && (

<div style={{
  position: 'absolute',
  zIndex: 1000,
  top: '50%',   // Centra verticalmente en relación con el contenedor principal
  left: '50%',  // Centra horizontalmente en relación con el contenedor principal
  transform: 'translate(-50%, -50%)',  // Centra el contenido
  width: '500px',  // Ajusta el ancho deseado
  padding: '20px',  // Añade un espacio de relleno alrededor del formulario
  backgroundColor: 'white',  // Fondo blanco
  borderRadius: '8px',  // Bordes redondeados
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',  // Sombra ligera
}}>
    <CreditForm
      onClose={closeCreditForm}
      onCreditCreate={() => {
        // Add logic to create a new credit here.
        // After creating the credit, you can close the form by calling `closeCreditForm()`.
      }}
      sx={{ backgroundColor: 'white' }}
    />
  </div>
)}
 {/* Conditional rendering of PaymentForm */}
 {isPaymentFormOpen && (
        <div style={{
          position: 'absolute',
          zIndex: 1000,
          top: '50%',   // Centra verticalmente en relación con el contenedor principal
          left: '50%',  // Centra horizontalmente en relación con el contenedor principal
          transform: 'translate(-50%, -50%)',  // Centra el contenido
          width: '500px',  // Ajusta el ancho deseado
          padding: '20px',  // Añade un espacio de relleno alrededor del formulario
          backgroundColor: 'white',  // Fondo blanco
          borderRadius: '8px',  // Bordes redondeados
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',  // Sombra ligera
        }}>
          <PaymentForm
            onClose={closePaymentForm}
            onPaymentCreate={() => {
              // Agrega la lógica para crear un nuevo pago aquí.
              // Después de crear el pago, puedes cerrar el formulario llamando a `closePaymentForm()`.
            }}
          />
        </div>
      )}




      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
