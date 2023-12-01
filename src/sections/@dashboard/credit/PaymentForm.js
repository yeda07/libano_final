import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

function PaymentForm({ onClose, onPaymentCreate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para crear un nuevo pago.
    // Puedes enviar los datos del nuevo pago al servidor o realizar otras acciones necesarias.
    // Luego, llama a la función `onPaymentCreate` y cierra el formulario.
    onPaymentCreate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Nombre del cliente" fullWidth />
      <TextField label="Cédula" fullWidth />
      <TextField label="Correo electrónico" fullWidth />
      <TextField label="Monto del pago" fullWidth />
      {/* Otros campos del formulario */}
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
}

export default PaymentForm;
