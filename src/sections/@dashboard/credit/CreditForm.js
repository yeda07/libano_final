import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

function CreditForm({ onClose, onCreditCreate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para crear un nuevo crédito.
    // Puedes enviar los datos del nuevo crédito al servidor o realizar otras acciones necesarias.
    // Luego, llama a la función `onCreditCreate` y cierra el formulario.
    onCreditCreate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="nombre del cliente " fullWidth />
      <TextField label="cedula" fullWidth />
      <TextField label="email" fullWidth />
      <TextField label="monto del credito" fullWidth />
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

export default CreditForm;
