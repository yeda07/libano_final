// sections/@dashboard/sale/SaleForm.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const SaleForm = ({ open, onClose, onSubmit, sale }) => {
  const [formData, setFormData] = useState({
    userName: sale ? sale.userName : '',
    productName: sale ? sale.productName : '',
    purchaseDate: sale ? sale.purchaseDate : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{sale ? 'Edit Sale' : 'Add Sale'}</DialogTitle>
      <DialogContent>
        <TextField
          label="User Name"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Purchase Date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{sale ? 'Save Changes' : 'Add Sale'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleForm;
