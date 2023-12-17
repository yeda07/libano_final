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

const API_URLS = {
  existenciasEspumillas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_espumillas/',
  existenciasMateriales: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_materiales/',
  existenciasProductos: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_productos/',
  existenciasTelasColores: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_telas_colores/',
  tiposEspumillas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitipos_espumillas/',
  tiposMateriales: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitipos_materiales/',
  telas: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitiposTelas/',
  TelasColores: 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apitelas_colores/',
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
  const [colorList, setColorList] = useState([]);
  const [telaList, setTelaList] = useState([]);
  const [telasColoresList, settelasColoresList] = useState([]);
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
  const [productTypeDataAux, setProductTypeDataAux] = useState([]);
  const [loadingProductTypeData, setLoadingProductTypeData] = useState(true);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedItemData, setUpdatedItemData] = useState({
    itemType: '',
    itemId: '',
    cantidad: '',
  });
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);

  const handleOpenUpdateDialog = (item) => {
    const { id, quantity } = item;

    setUpdatedItemData({
      itemType: selectedProductType,
      itemId: id,
      cantidad: quantity.toString(), // Asegúrate de que cantidad sea una cadena
    });

    setSelectedItemForEdit(item);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
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

  const handleSearch = async () => {
    console.log('searchTerm', searchTerm);
    console.log('productypedata', productTypeData);
    const apiURL = 'https://tapiceria-7efd4dfba1d5.herokuapp.com/apiexistencias_productos/';

    try {
      setLoading(true);
      const searchResults = productTypeDataAux.filter((item) => {
        return item.itemName.includes(searchTerm);
      });
      console.log('searchResults', searchResults);
      setProductTypeData(searchResults);

      const response = await axios.get(apiURL);
      console.log('API Response:', response); // Agrega esta línea para ver la respuesta en la consola
      const data = response.data;

      const mappedData = data.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.cantidad,
      }));

      console.log('Mapped Data:', mappedData); // Agrega esta línea para ver el mapeo en la consola

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
        tela_color: newItemData.itemId,
        cantidad: newItemData.cantidad,
      }),
    },
  };

  const handleAddItem = async (id = null) => {
    try {
      setLoading(true);
      console.log('id-handleAddItem', id ?? null);
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

  const getProductTypeItemName = (productType, item) => {
    let tela;
    let color;
    let nombret;
    let nombrec;
    let telascolores;
    console.log('espumillaList', espumillaList);
    console.log('materialList', materialList);

    switch (productType) {
      case 'espumilla':
        return espumillaList.find((espumilla) => espumilla.id === item.tipoEspumilla)?.nombre || 'Nombre no disponible';
      case 'material':
        return materialList.find((material) => material.id === item.tipoMaterial)?.nombre || 'Nombre no disponible';
      case 'producto':
        return productList.find((producto) => producto.id === item.producto)?.descripcion || 'Nombre no disponible';
      case 'telaColor':
        console.log('telasColoresList:', telasColoresList);
        console.log('telaList:', telaList);
        console.log('colorList:', colorList);

        telascolores = telasColoresList.find((telacolor) => telacolor.id === item.tela_Color);

        console.log('telascolores:', telascolores);

        // Verificamos si telascolores es una ID válida
        if (telascolores) {
          // Buscamos la tela correspondiente en la lista de telas
          tela = telaList.find((tela) => tela.id === telascolores.tela);

          // Buscamos el color correspondiente en la lista de colores
          color = colorList.find((colorItem) => colorItem.id === telascolores.color)?.nombre;
        }

        // Asignamos nombres o 'Nombre no disponible' si no se encuentran
        nombret = tela ? tela.nombre : 'Nombre no disponible';
        nombrec = color || 'Color no disponible';

        return `${nombret} - ${nombrec}`;
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
        const allProductTypesData = await fetchAllProductTypesData();
        setProductTypeData(allProductTypesData);
        setProductTypeDataAux(allProductTypesData);
        console.log('Datos de tipos de productos:', allProductTypesData);
      } else {
        const productTypeData = await fetchExistenciasDataForType(selectedType);
        setProductTypeData(productTypeData);
        setProductTypeDataAux(productTypeData);
      }
    } catch (error) {
      setError(error);
      console.error('Error al manejar el cambio de tipo de producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistenciasDataForType = async (productType) => {
    const apiUrl = getProductTypeApiUrl(productType);

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;
      console.log('data tes', data);
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
      setProductTypeDataAux(mappedData);
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

      console.log('fetchAllProductTypesData response:', allProductTypesData);

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
        return telasColoresList.map((item) => {
          const tela = telaList.find((telaItem) => telaItem.id === item.tela);
          const color = colorList.find((colorItem) => colorItem.id === item.color);
          const nombreTela = tela ? tela.nombre : 'Nombre no disponible';
          const nombreColor = color ? color.nombre : 'Color no disponible';
          return {
            id: item.id,
            descripcion: `${nombreTela} - ${nombreColor}`,
          };
        });
      default:
        return [];
    }
  };

  const fetchExistenciasData = async () => {
    try {
      setLoading(true);

      const [existenciasEspumillas, existenciasMateriales, existenciasProductos, existenciasTelasColores] =
        await Promise.all([
          axios.get(API_URLS.existenciasEspumillas),
          axios.get(API_URLS.existenciasMateriales),
          axios.get(API_URLS.existenciasProductos),
          axios.get(API_URLS.existenciasTelasColores),
        ]);

      setExistenciasEspumillasList(existenciasEspumillas.data);
      setExistenciasMaterialesList(existenciasMateriales.data);
      setExistenciasProductosList(existenciasProductos.data);
      setExistenciasTelasColoresList(existenciasTelasColores.data);

      const inventoryExistenciasData = [
        ...existenciasEspumillas.data,
        ...existenciasMateriales.data,
        ...existenciasProductos.data,
        ...existenciasTelasColores.data,
      ];

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

        const [espumillas, materiales, productos, telasColores, telas, colores] = await Promise.all([
          axios.get(API_URLS.tiposEspumillas),
          axios.get(API_URLS.tiposMateriales),
          axios.get(API_URLS.productos),
          axios.get(API_URLS.TelasColores),
          axios.get(API_URLS.telas),
          axios.get(API_URLS.colores),
        ]);

        setEspumillaList(espumillas.data);
        setMaterialList(materiales.data);
        setProductList(productos.data);
        settelasColoresList(telasColores.data);
        setColorList(colores.data);
        setTelaList(telas.data);

        const inventoryData = [
          ...espumillas.data,
          ...materiales.data,
          ...productos.data,
          ...telasColores.data,
          ...colores.data,
          ...telas.data,
        ];
        const allProductTypesData = await fetchAllProductTypesData();
        setProductTypeData(allProductTypesData);
        setProductTypeDataAux(allProductTypesData);
        console.log('zzzProduct type data:', allProductTypesData);
        console.log('inventoryData:', inventoryData);

        setInventoryList(inventoryData);
        handleProductTypeChange({ target: { value: '' } });
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setLoadingProductTypeData(false); // Agrega esta línea
      }
    };

    fetchExistenciasData();
    fetchData();
  }, []);

  const handleDeleteItem = async (itemId, itemType) => {
    try {
      setLoading(true);

      // Verificar si itemType existe en itemTypeMappings
      if (!itemTypeMappings[itemType]) {
        throw new Error(`Tipo de ítem no encontrado: ${itemType}`);
      }

      const barra = '/';
      const apiUrl = itemTypeMappings[itemType].apiURL + itemId + barra;
      console.log('LINK', apiUrl);

      await axios.delete(apiUrl);

      console.log('Item eliminado correctamente');

      const updatedInventory = inventoryList.filter((item) => item.id !== itemId);
      setInventoryList(updatedInventory);
    } catch (error) {
      setError(error);
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (item, productType, newCantidad) => {
    try {
      setLoading(true);

      const { id } = item;
      const mapping = itemTypeMappings[productType];

      if (!mapping) {
        console.error('Tipo de item no soportado:', productType);
        return;
      }

      const { apiURL } = mapping;
      const apiUrl = `${apiURL}${id}/`; // Build the correct URL for updating an item

      console.log('URL de la solicitud:', apiUrl);
      console.log('Datos de la solicitud:', { cantidad: newCantidad }); // Make sure updatedData is correct

      const response = await axios.patch(apiUrl, { cantidad: newCantidad });

      // Update the state with the updated data
      const updatedProductTypeData = productTypeData.map((item) => {
        if (item.id === id) {
          return { ...item, cantidad: response.data.cantidad };
        }
        return item;
      });

      setProductTypeData(updatedProductTypeData);
      handleCloseUpdateDialog();
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
            Agregar producto
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
                      <Button variant="outlined" color="secondary" onClick={() => handleOpenUpdateDialog(item)}>
                        Editar
                      </Button>

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

        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Editar Existencias</DialogTitle>
          <DialogContent>
            {selectedItemForEdit && (
              <TextField
                fullWidth
                label="Nueva Cantidad"
                type="number"
                name="cantidad"
                value={updatedItemData.cantidad || ''}
                onChange={(e) =>
                  setUpdatedItemData({
                    ...updatedItemData,
                    cantidad: e.target.value,
                  })
                }
                style={{ marginTop: 10 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => handleUpdateItem(selectedItemForEdit, selectedProductType, updatedItemData.cantidad || 0)}
              color="primary"
              variant="contained"
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Agregar Nuevo Item</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Tipo de Item</InputLabel>
              <Select value={newItemData.itemType} name="itemType" onChange={handleInputChange}>
                <MenuItem value="espumilla">Espumilla</MenuItem>
                <MenuItem value="material">Material</MenuItem>
                <MenuItem value="telaColor">Tela y Color</MenuItem>
              </Select>
            </FormControl>
            {specificItems.length > 0 && (
              <FormControl fullWidth style={{ marginTop: 10 }}>
                <InputLabel>Seleccionar Item</InputLabel>
                <Select value={newItemData.itemId} name="itemId" onChange={handleInputChange}>
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
