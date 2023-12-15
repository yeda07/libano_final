// AddSaleForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const SalesForm = ({ onClose, initialSale, setSales }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [saleData, setSaleData] = useState({
    fecha_venta: '',
    comprador: '',
    vendedor: '',
  });

  useEffect(() => {
    if (initialSale) {
      setSaleData(initialSale);
      setValue('cantidad', initialSale.cantidad);
      setValue('venta', initialSale.venta);
      setValue('producto', initialSale.producto ? initialSale.producto.id : ''); // Verifica si producto está definido antes de acceder a su id
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
        ? `https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventas/${initialSale.id}`
        : 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventas/';

      const method = initialSale ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialSale ? { ...initialSale, ...data } : data),
      });

      if (response.ok) {
        console.log(`${initialSale ? 'Venta editada' : 'Venta agregada'} con éxito`);
        // Actualiza la lista de ventas después de agregar/editar una
        const updatedSales = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventas/')
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
            {...register('fecha_venta')}
            label="Fecha de Venta"
            fullWidth
            margin="normal"
            value={saleData.fecha_venta}
            onChange={(e) => handleChange('fecha_venta', e.target.value)}
          />
          <TextField
            {...register('comprador')}
            label="Comprador"
            fullWidth
            margin="normal"
            value={saleData.comprador}
            onChange={(e) => handleChange('comprador', e.target.value)}
          />
          <TextField
            {...register('vendedor')}
            label="Vendedor"
            fullWidth
            margin="normal"
            value={saleData.vendedor}
            onChange={(e) => handleChange('vendedor', e.target.value)}
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

export default SalesForm;
