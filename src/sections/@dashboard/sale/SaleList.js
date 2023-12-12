// sections/@dashboard/sale/SaleList.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Popover,
  MenuItem,
} from '@mui/material';
import Label from '../../../components/label'; // Asegúrate de tener un componente Label definido
import Iconify from '../../../components/iconify';

const SaleList = ({ sales, selected, onSelect, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Purchase Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.userName}</TableCell>
              <TableCell>{sale.productName}</TableCell>
              <TableCell>{sale.purchaseDate}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(sale)}>
                  <Iconify icon={'eva:edit-fill'} />
                </IconButton>
                <IconButton onClick={() => onDelete(sale.id)}>
                  <Iconify icon={'eva:trash-2-outline'} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SaleList;
