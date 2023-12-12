// AddProductForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types'; // Importa PropTypes
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

  const createNewProduct = async (data) => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer tu_token', // Reemplaza con tu token de autenticación
        },
        body: JSON.stringify({
          descripcion: data.descripcion || '',
          fecha_fabricacion: data.fecha_fabricacion || '',
          precio_costo: parseFloat(data.precio_costo) || 0,
          precio_venta: parseFloat(data.precio_venta) || 0,
          tipoProducto: parseInt(data.tipoProducto, 10) || 0, // Añadido el parámetro radix
          tipoMaterial: parseInt(data.tipoMaterial, 10) || 0, // Añadido el parámetro radix
        }),
      });
  
      if (response.ok) {
        console.log('Producto creado con éxito');
      } else {
        console.error('Error al crear el producto:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };
  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
 
    // Lee el contenido del archivo y lo convierte en una URL de datos
    const reader = new FileReader();
    reader.onloadend = () => {
       setProductData((prevData) => ({
          ...prevData,
          imagen: reader.result,
       }));
    };
 
    if (file) {
       reader.readAsDataURL(file);
    }
 };

 const onSubmit = async (data) => {
  try {
    console.log('1. Antes de createNewProduct');
    await createNewProduct(data);
    console.log('2. Después de createNewProduct');

    // Aquí puedes agregar más logs o lógica adicional si es necesario

    // Después de crear el producto con éxito, obtén la lista de productos actualizada
    console.log('3. Después de createNewProduct - Obtener la lista de productos actualizada');
    const updatedProducts = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/')
      .then((response) => response.json());
    console.log('4. Después de obtener la lista de productos actualizada:', updatedProducts);

    // Actualiza el estado de products con la lista actualizada
    setProducts(updatedProducts);
  } catch (error) {
    console.error('Error al crear un nuevo producto:', error);
  }

  onClose(); // Cierra el formulario después de enviar la información
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
            type="file" // Cambia el tipo a "file" para permitir la selección de archivos
            label="Imagen" /* Cambiado de "Imagen URL" a "Imagen" */
            fullWidth
            margin="normal"
            onChange={(e) => handleFileChange(e)} /* Nueva función para manejar el cambio de archivo */
          />
          <TextField
            label=""
            type="date"
            name="fecha fabricacion"
            value={productData.fecha_fabricacion}
            onChange={(e) => handleChange('fecha_fabricacion', e.target.value)}
            fullWidth
            margin="normal"
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
          <TextField
            {...register('tipoProducto')}
            label="Tipo de Producto"
            fullWidth
            margin="normal"
            type="number"  // Cambia el tipo a "number" para permitir solo números
            value={productData.tipoProducto}
            onChange={(e) => handleChange('tipoProducto', e.target.value)}
          />
          <TextField
            {...register('tipoMaterial')}
            label="Tipo de Material"
            fullWidth
            margin="normal"
            type="number"  // Cambia el tipo a "number" para permitir solo números
            value={productData.tipoMaterial}
            onChange={(e) => handleChange('tipoMaterial', e.target.value)}
          />
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

AddProductForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialProduct: PropTypes.shape({
    tipoProducto: PropTypes.string,
    tipoMaterial: PropTypes.string,
    // Añade otras propiedades según sea necesario
  }),
  setProducts: PropTypes.func.isRequired,
};

export default AddProductForm;
