import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';

const AddSaleForm = ({ onClose, initialSale, setSales, products }) => {
  const { register, handleSubmit } = useForm();
  const [saleData, setSaleData] = useState({
    cantidad: '',
    venta: '',
    producto: '',
  });
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    // Fetch ventas from API
    const fetchVentas = async () => {
      try {
        const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventas/');
        if (response.ok) {
          const ventasData = await response.json();
          setVentas(ventasData);
        } else {
          console.error('Error en la respuesta de la API:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener las ventas desde la API:', error);
      }
    };

    fetchVentas();
  }, []);

  useEffect(() => {
    if (initialSale) {
      setSaleData({
        ...initialSale,
        producto: initialSale.producto ? initialSale.producto.id : '',
      });
    }
  }, [initialSale]);

  // Update product field when the selected sale changes
  useEffect(() => {
    if (initialSale) {
      setSaleData((prevData) => ({
        ...prevData,
        producto: initialSale.producto ? initialSale.producto.id : '',
      }));
    }
  }, [initialSale]);

  const handleChange = (field, value) => {
    setSaleData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      console.log('Data before submission:', data);

      const url = initialSale
        ? `https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/${initialSale.id}/`
        : 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/';

      const method = initialSale ? 'PATCH' : 'POST';

      const bodyData = initialSale
        ? {
          ...data,
        }
        : {
          ...data,
          producto: { id: String(data.producto) },
        };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      console.log('API Response:', response);

      if (response.ok) {
        console.log(`${initialSale ? 'Venta editada' : 'Venta agregada'} con éxito`);
        // Actualiza la lista de ventas después de agregar/editar una
        const updatedSales = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiventasProductos/')
          .then((response) => response.json());
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
            select
            label="Venta"
            fullWidth
            margin="normal"
            value={saleData.venta || ''}
            onChange={(e) => handleChange('venta', e.target.value)}
          >
            {ventas.map((venta) => (
              <MenuItem key={venta.id} value={venta.id}>
                Venta {venta.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            {...register('producto')}
            select
            label="Producto"
            fullWidth
            margin="normal"
            value={saleData.producto || ''}
            onChange={(e) => handleChange('producto', e.target.value)}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.descripcion}
              </MenuItem>
            ))}
          </TextField>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {initialSale ? 'Guardar cambios' : 'Agregar Venta'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleForm;