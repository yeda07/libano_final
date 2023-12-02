// AddProductForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const AddProductForm = ({ onClose, initialProduct, setProducts }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [productData, setProductData] = useState(initialProduct || {
    descripcion: '',
    imagen: '',
    fecha_fabricacion: '',
    precio_costo: '',
    precio_venta: '',
    tipoProducto: '',
    tipoMaterial: '',
  });
  const [tiposMateriales, setTiposMateriales] = useState([]);
  const [tiposProductos, setTiposProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const responseMateriales = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apitipos_materiales/');
      const responseProductos = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apitipos_productos/');
      const dataMateriales = await responseMateriales.json();
      const dataProductos = await responseProductos.json();

      setTiposMateriales(dataMateriales);
      setTiposProductos(dataProductos);

      if (initialProduct) {
        setProductData(initialProduct);
        setValue('tipoProducto', initialProduct.tipoProducto);
        setValue('tipoMaterial', initialProduct.tipoMaterial);
      }
    };

    fetchData();
  }, [initialProduct, setValue]);

  const handleChange = (field, value) => {
    setProductData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      const url = 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/';
      const method = initialProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(`Producto ${initialProduct ? 'editado' : 'agregado'} con éxito`);
        // Recarga la lista de productos después de agregar/editar uno
        const updatedProducts = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/')
          .then(response => response.json());
        setProducts(updatedProducts);
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
      <DialogTitle>{initialProduct ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
          {/* Incluir un campo oculto solo si se está editando un producto existente */}
          {initialProduct && (
            <input type="hidden" {...register('id')} value={productData.id} />
          )}
          <TextField
            {...register('descripcion')}
            label="Descripción"
            fullWidth
            margin="normal"
            value={productData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
          />
          <TextField
            {...register('fecha_fabricacion')}
            label="Fecha de Fabricación"
            fullWidth
            margin="normal"
            value={productData.fecha_fabricacion}
            onChange={(e) => handleChange('fecha_fabricacion', e.target.value)}
          />
          <TextField
            {...register('precio_costo')}
            label="Precio de Costo"
            fullWidth
            margin="normal"
            value={productData.precio_costo}
            onChange={(e) => handleChange('precio_costo', e.target.value)}
          />
          <TextField
            {...register('precio_venta')}
            label="Precio de Venta"
            fullWidth
            margin="normal"
            value={productData.precio_venta}
            onChange={(e) => handleChange('precio_venta', e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Producto</InputLabel>
            <Select
              {...register('tipoProducto')}
              value={productData.tipoProducto}
              onChange={(e) => handleChange('tipoProducto', e.target.value)}
            >
              {tiposProductos.map((tipo) => (
                <MenuItem key={tipo._id} value={tipo.nombre}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Material</InputLabel>
            <Select
              {...register('tipoMaterial')}
              value={productData.tipoMaterial}
              onChange={(e) => handleChange('tipoMaterial', e.target.value)}
            >
              {tiposMateriales.map((tipo) => (
                <MenuItem key={tipo._id} value={tipo.nombre}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {initialProduct ? 'Guardar cambios' : 'Guardar'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;
