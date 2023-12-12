import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Stack,
  CardContent,
  Typography,
} from '@mui/material';

import Iconify from '../components/iconify';


const API_URLS = {
  existenciasEspumillas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_espumillas/',
  existenciasMateriales: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_materiales/',
  existenciasProductos: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_productos/',
  existenciasTelasColores: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_telas_colores/',
  tiposEspumillas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitipos_espumillas/',
  tiposMateriales: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitipos_materiales/',
  tiposTelas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitiposTelas/',
  colores: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apicolores/',
  productos: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiproductos/',
  comprasTelasColores: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apicompras_telas_colores/',
  comprasTiposEspumillas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apicompras_tipos_espumillas/',
  comprasTiposMateriales: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apicompras_tipos_materiales/',
};

const InventoryPage = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemData, setNewItemData] = useState({
    itemType: '',
    itemId: '',
    cantidad: '',
  });
  const [productList, setProductList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [espumillaList, setEspumillaList] = useState([]);
  const [fabricList, setFabricList] = useState([]);
  const [specificItems, setSpecificItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [existenciasEspumillasList, setExistenciasEspumillasList] = useState([]);
  const [existenciasMaterialesList, setExistenciasMaterialesList] = useState([]);
  const [existenciasProductosList, setExistenciasProductosList] = useState([]);
  const [existenciasTelasColoresList, setExistenciasTelasColoresList] = useState([]);
  const [inventoryExistenciasData, setInventoryExistenciasData] = useState([]);

  const [selectedProductType, setSelectedProductType] = useState('');
  const [productTypeData, setProductTypeData] = useState([]);
  const [loadingProductTypeData, setLoadingProductTypeData] = useState(true);

  const transformInventoryData = (inventoryData) => {
    const transformedData = {};
    inventoryData.forEach((item) => {
      const category = getCategoryNameFromItemName(item.itemName);
      if (!transformedData[category]) {
        transformedData[category] = [];
      }
      transformedData[category].push({
        itemName: item.itemName,
        quantity: item.quantity,
      });
    });
    return transformedData;
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'itemType') {
      const items = getSpecificItems(value);
      setSpecificItems(items);
    }
  };

  const handleSearch = async (apiURL) => {
    try {
      setLoading(true);
      const response = await axios.get(apiURL);
      const data = response.data;
      const mappedData = data.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.cantidad,
      }));
      setInventoryList(mappedData);
    } catch (error) {
      setError(error);
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemTypeMappings = {
    espumilla: {
      apiURL: API_URLS.existenciasEspumillas,
      requestBody: (newItemData) => ({
        tipoEspumilla: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
    material: {
      apiURL: API_URLS.existenciasMateriales,
      requestBody: (newItemData) => ({
        tipoMaterial: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
    producto: {
      apiURL: API_URLS.existenciasProductos,
      requestBody: (newItemData) => ({
        producto: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
    telaColor: {
      apiURL: API_URLS.existenciasTelasColores,
      requestBody: (newItemData) => ({
        tela_Color: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
  };

  const itemTypeMappingsCompras = {
    espumilla: {
      apiURL: API_URLS.comprasTiposEspumillas,
      requestBody: (newItemData) => ({
        tipoEspumilla: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
    material: {
      apiURL: API_URLS.comprasTiposMateriales,
      requestBody: (newItemData) => ({
        tipoMaterial: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
    producto: {
      apiURL: API_URLS.comprasProductos,
      requestBody: (newItemData) => ({
        producto: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
    telaColor: {
      apiURL: API_URLS.comprasTelasColores,
      requestBody: (newItemData) => ({
        tela_Color: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
  };

  const handleAddItem = async () => {
    try {
      setLoading(true);
  
      const mapping = itemTypeMappingsCompras[newItemData.itemType];
  
      if (!mapping) {
        console.error('Tipo de item no soportado:', newItemData.itemType);
        return;
      }
  
      const { apiURL, requestBody } = mapping;
  
      const requestBodyData = {
        ...requestBody(newItemData),
        compra: 1,
        precio: 1,
        cantidad: parseInt(newItemData.cantidad, 10),
      };
  
      console.log('Cuerpo de la solicitud:', requestBodyData);
  
      // Log antes de enviar la solicitud
      console.log('Solicitud a la API:', {
        url: apiURL,
        method: 'POST',
        data: requestBodyData,
      });
  
      const response = await axios.post(apiURL, requestBodyData);
  
      // Log después de recibir la respuesta
      console.log('Respuesta de la API:', response.data);
  
      const addedItem = response.data;
  
      setInventoryList((prevList) => [...prevList, addedItem]);
  
      handleCloseDialog();
    } catch (error) {
      setError(error);
      console.error('Error al agregar el item:', error);
  
      // Log de la respuesta de error si está disponible
      if (error.response) {
        console.error('Respuesta de error de la API:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const getApiURL = (itemType) => {
    switch (itemType) {
      case 'espumilla':
        return API_URLS.existenciasEspumillas;
      case 'material':
        return API_URLS.existenciasMateriales;
      case 'producto':
        return API_URLS.existenciasProductos;
      case 'telaColor':
        return API_URLS.existenciasTelasColores;
      default:
        return '';
    }
  };

  const getProductTypeApiUrl = (productType) => {
    switch (productType) {
      case 'espumilla':
        return API_URLS.existenciasEspumillas;
      case 'material':
        return API_URLS.existenciasMateriales;
      case 'producto':
        return API_URLS.existenciasProductos;
      case 'telaColor':
        return API_URLS.existenciasTelasColores;
      default:
        return '';
    }
  };

  const getProductTypeApiUrlCompras = (productType) => {
    switch (productType) {
      case 'espumilla':
        return API_URLS.comprasEspumillas;
      case 'material':
        return API_URLS.comprasMateriales;
      case 'producto':
        return API_URLS.comprasProductos;
      case 'telaColor':
        return API_URLS.comprasTelasColores;
      default:
        return '';
    }
  };

  const getProductTypeItemName = (productType, item) => {
    let color;
    let nombre;
    let tela; // Move the declaration outside the switch block
  
    switch (productType) {
      case 'espumilla':
        return espumillaList.find((espumilla) => espumilla.id === item.tipoEspumilla)?.nombre || 'Nombre no disponible';
      case 'material':
        return materialList.find((material) => material.id === item.tipoMaterial)?.nombre || 'Nombre no disponible';
      case 'producto':
        return productList.find((producto) => producto.id === item.producto)?.descripcion || 'Nombre no disponible';
      case 'telaColor':
        tela = fabricList.find((telaColor) => telaColor.id === item.tela_Color); // Move the assignment here
        console.log('Tela:', tela);
        color = color?.color || 'Color no disponible';
        nombre = tela?.nombre || 'Nombre no disponible';
        console.log('Nombre y color:', nombre, color);
        return `${nombre} - Color: ${color}`;
      default:
        return 'Nombre no disponible';
    }
  };
  

  const handleProductTypeChange = async (event) => {
    const selectedType = event.target.value;
    try {
      setLoading(true);
      setSelectedProductType(selectedType);
  
      if (!selectedType) {
        // Si no se selecciona ningún tipo, obtén todos los datos de todos los tipos de productos
        const allProductTypesData = await fetchAllProductTypesData();
        setProductTypeData(allProductTypesData);
        console.log('Datos de tipos de productos:', allProductTypesData);
      } else {
        // Si se selecciona un tipo, obtén datos para ese tipo específico
        const productTypeData = await fetchExistenciasDataForType(selectedType);
        setProductTypeData(productTypeData);
      }
    } catch (error) {
      setError(error);
      console.error('Error al manejar el cambio de tipo de producto:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  

  // Importa las bibliotecas y componentes necesarios...
  const fetchExistenciasDataForType = async (productType) => {
    const apiUrl = getProductTypeApiUrl(productType);
  
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      const mappedData = data.map((item) => ({
        id: item.id,
        itemName: getProductTypeItemName(productType, item),
        quantity: item.cantidad,
      }));
  
      console.log(`Datos para ${productType}:`, mappedData);
  
      return mappedData;
    } catch (error) {
      console.error('Error al obtener datos de existencias para el tipo:', error);
      return [];
    }
  };
  
  
const handleFetchProductTypeData = async (productType) => {
  try {

    const apiUrl = getProductTypeApiUrl(productType);
    const response = await axios.get(apiUrl);
    const data = response.data;

    console.log('Data from API:', data);

    const mappedData = data.map((item) => ({
      id: item.id,
      itemName: getProductTypeItemName(productType, item),
      quantity: item.cantidad,
    }));

    console.log('Mapped Data:', mappedData);
    console.log('Setting productTypeData:', mappedData);
    setProductTypeData(mappedData);
  } catch (error) {
    setError(error);
    console.error('Error fetching product type data:', error);
  } finally {
    setLoading(false);
  }
};




const fetchAllProductTypesData = async () => {
  try {
    setLoading(true);

    // Obtener todas las existencias para cada tipo de producto
    const allData = await Promise.all([
      fetchExistenciasDataForType('espumilla'),
      fetchExistenciasDataForType('material'),
      fetchExistenciasDataForType('producto'),
      fetchExistenciasDataForType('telaColor'),
    ]);

    // Combinar todos los datos en un solo array
    const allProductTypesData = allData.reduce((acc, data) => {
      return acc.concat(data);
    }, []);

    console.log('fetchAllProductTypesData response:', allProductTypesData)

    return allProductTypesData;
  } catch (error) {
    setError(error);
    console.error('Error fetching all product types data:', error);
  } finally {
    setLoading(false);
  }

  // Agrega una declaración de retorno aquí, por ejemplo, return null;
  return null;
};

  

  
  const getSpecificItems = (itemType) => {
    switch (itemType) {
      case 'espumilla':
        return espumillaList.map((item) => ({ id: item.id, descripcion: item.nombre }));
      case 'material':
        return materialList.map((item) => ({ id: item.id, descripcion: item.nombre }));
      case 'producto':
        return productList.map((item) => ({ id: item.id, descripcion: item.descripcion }));
      case 'telaColor':
        return fabricList.map((item) => ({
          id: item.id,
          descripcion: item.nombre,
        }));
      default:
        return [];
    }
  };

  const getCategoryNameFromItemName = (itemName) => {
    if (itemName.includes('Espumilla')) {
      return 'Categoría de Espumilla';
    }
    if (itemName.includes('Material')) {
      return 'Categoría de Material';
    }
    if (itemName.includes('Producto')) {
      return 'Categoría de Producto';
    }
    if (itemName.includes('Tela y Color')) {
      return 'Categoría de Tela y Color';
    }

    return 'Otra Categoría';
  };

  const fetchExistenciasData = async () => {
    try {
      setLoading(true);

      const [
        existenciasEspumillas,
        existenciasMateriales,
        existenciasProductos,
        existenciasTelasColores,
      ] = await Promise.all([
        axios.get(API_URLS.existenciasEspumillas),
        axios.get(API_URLS.existenciasMateriales),
        axios.get(API_URLS.existenciasProductos),
        axios.get(API_URLS.existenciasTelasColores),
      ]);

      setExistenciasEspumillasList(existenciasEspumillas.data);
      setExistenciasMaterialesList(existenciasMateriales.data);
      setExistenciasProductosList(existenciasProductos.data);
      setExistenciasTelasColoresList(existenciasTelasColores.data);

      const inventoryExistenciasData = [...existenciasEspumillas.data, ...existenciasMateriales.data, ...existenciasProductos.data, ...existenciasTelasColores.data];

      console.log('Existencias Espumillas:', existenciasEspumillas.data);
      console.log('Existencias Materiales:', existenciasMateriales.data);
      console.log('Existencias Productos:', existenciasProductos.data);
      console.log('Existencias Telas y Colores:', existenciasTelasColores.data);
      console.log('Existencias Data:', inventoryExistenciasData);

      setLoading(false);
    } catch (error) {
      setError(error);
      console.error('Error fetching existencias data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [espumillas, materiales, productos, telasColores] = await Promise.all([
          axios.get(API_URLS.tiposEspumillas),
          axios.get(API_URLS.tiposMateriales),
          axios.get(API_URLS.productos),
          axios.get(API_URLS.tiposTelas),
        ]);

        setEspumillaList(espumillas.data);
        setMaterialList(materiales.data);
        setProductList(productos.data);
        setFabricList(telasColores.data);

        const inventoryData = [...espumillas.data, ...materiales.data, ...productos.data, ...telasColores.data];
        const allProductTypesData = await fetchAllProductTypesData();
        setProductTypeData(allProductTypesData);
        console.log('zzzProduct type data:', allProductTypesData);
        console.log('inventoryData:', inventoryData)
        
        setInventoryList(inventoryData);
        handleProductTypeChange({ target: { value: '' } });
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setLoadingProductTypeData(false); // Agrega esta línea
      }
    }

    fetchExistenciasData();
    fetchData();
  }, []);


  const handleDeleteItem = async (itemId, itemType) => {
    try {
      setLoading(true);
      const apiUrl = itemTypeMappings[itemType].apiURL + itemId;
      console.log(apiUrl);
      await fetch.delete(apiUrl);
      const updatedInventory = inventoryList.filter(item => item.id !== itemId);
      setInventoryList(updatedInventory);
    } catch (error) {
      setError(error);
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleUpdateItem = async (itemId, itemType, updatedData) => {
    try {
      setLoading(true);
      const apiUrl = itemTypeMappings[itemType].apiURL + itemId;
      console.log(apiUrl);
      await axios.put(apiUrl, updatedData);
  
      // Actualizar el estado con los datos actualizados, si es necesario
      const updatedInventory = inventoryList.map(item => {
        if (item.id === itemId) {
          return { ...item, ...updatedData };
        }
        return item;
      });
      setInventoryList(updatedInventory);
    } catch (error) {
      setError(error);
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Helmet>
        <title>Existencias</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <TextField
              label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSearch(getApiURL(selectedProductType))}
                  >
                    Buscar
                  </Button>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 120, marginLeft: 2 }}>
              <InputLabel id="product-type-label">Tipo de Producto</InputLabel>
              <Select
                labelId="product-type-label"
                id="product-type-select"
                value={selectedProductType}
                onChange={handleProductTypeChange}
                label="Tipo de Producto"
              >
                <MenuItem value="">Todos los productos</MenuItem>
                <MenuItem value="espumilla">Espumilla</MenuItem>
                <MenuItem value="material">Material</MenuItem>
                <MenuItem value="producto">Producto</MenuItem>
                <MenuItem value="telaColor">Tela y Color</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Agregar Item
          </Button>
        </Stack>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">Existencias</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productTypeData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteItem(item.id, selectedProductType)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productTypeData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Agregar Nuevo Item</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Tipo de Item</InputLabel>
              <Select
                value={newItemData.itemType}
                name="itemType"
                onChange={handleInputChange}
              >
                <MenuItem value="espumilla">Espumilla</MenuItem>
                <MenuItem value="material">Material</MenuItem>
                <MenuItem value="producto">Producto</MenuItem>
                <MenuItem value="telaColor">Tela y Color</MenuItem>
              </Select>
            </FormControl>
            {specificItems.length > 0 && (
              <FormControl fullWidth style={{ marginTop: 10 }}>
                <InputLabel>Seleccionar Item</InputLabel>
                <Select
                  value={newItemData.itemId}
                  name="itemId"
                  onChange={handleInputChange}
                >
                  {specificItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              name="cantidad"
              value={newItemData.cantidad}
              onChange={handleInputChange}
              style={{ marginTop: 10 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleAddItem} color="primary" variant="contained">
              Agregar
            </Button>
          </DialogActions>
        </Dialog>

        {loading && (
          <Stack sx={{ marginTop: 2 }} direction="row" alignItems="center" justifyContent="center">
            <CircularProgress color="primary" />
          </Stack>
        )}

        {error && (
          <Card sx={{ marginTop: 2 }} variant="outlined">
            <CardContent>
              <Typography variant="h5" color="error">
                Error
              </Typography>
              <Typography color="error">{error.message}</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default InventoryPage;