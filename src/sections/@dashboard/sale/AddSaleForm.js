// AddSaleForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AddSaleForm = ({ onClose, initialSale, setSales }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [saleData, setSaleData] = useState({
    cantidad: '',
    venta: '',
    producto: '',
  });

  useEffect(() => {
    if (initialSale) {
      setSaleData(initialSale);
      setValue('cantidad', initialSale.cantidad);
      setValue('venta', initialSale.venta);
      setValue('producto', initialSale.producto.id); // Ajusta esto según la estructura real de tus datos
    }
  }, [initialSale, setValue]);

  const handleChange = (field, value) => {
    setSaleData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      const url = initialSale
        ? `https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/${initialSale.id}`
        : 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/';

      const method = initialSale ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialSale ? { ...initialSale, ...data, producto: { id: data.producto } } : data),
      });

      if (response.ok) {
        console.log(`${initialSale ? 'Venta editada' : 'Venta agregada'} con éxito`);
        // Actualiza la lista de ventas después de agregar/editar una
        const updatedSales = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/')
          .then(response => response.json());
        setSales(updatedSales);
      } else {
        console.error('Error en la respuesta de la API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{initialSale ? 'Editar Venta' : 'Agregar Venta'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {initialSale && (
            <input type="hidden" {...register('id')} value={initialSale.id} />
          )}
          <TextField
            {...register('cantidad')}
            label="Cantidad"
            fullWidth
            margin="normal"
            value={saleData.cantidad}
            onChange={(e) => handleChange('cantidad', e.target.value)}
          />
          <TextField
            {...register('venta')}
            label="Venta"
            fullWidth
            margin="normal"
            value={saleData.venta}
            onChange={(e) => handleChange('venta', e.target.value)}
          />
          <TextField
            {...register('producto')}
            label="Producto"
            fullWidth
            margin="normal"
            value={saleData.producto}
            onChange={(e) => handleChange('producto', e.target.value)}
          />
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {initialSale ? 'Guardar cambios' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleForm;
