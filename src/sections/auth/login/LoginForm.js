// LoginForm.js

import React, { useState } from 'react';
import { useNavigate ,} from 'react-router-dom';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async () => {
    try {
      const response = await fetch('https://tapiceria-7efd4dfba1d5.herokuapp.com/apiauth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (response.ok) {
        const userData = await response.json();
  
        if (userData.access) {
          // Almacenar el token en localStorage
          localStorage.setItem('accessToken', userData.access);
          console.log('Usuario autenticado:', userData);
          // Redirigir al usuario al panel de control
          navigate('/dashboard/app', { replace: true });
        } else {
          // Mostrar mensaje de error si no hay token
          setError('Credenciales no válidas. Por favor, inténtalo de nuevo.');
        }
      } else {
        // Mostrar mensaje de error para respuestas no exitosas
        const errorData = await response.json(); // Intenta obtener más detalles del error desde la respuesta
        console.error('Error al autenticar:', errorData);
        setError('Credenciales no válidas. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      // Mostrar mensaje de error para errores de red u otros errores
      console.error('Error al comunicarse con el servidor', error);
      setError('Error en la comunicación con el servidor. Por favor, inténtalo de nuevo.');
    }
  };
  

  return (
    <Stack spacing={3}>
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
      />

      <TextField
        name="password"
        label="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="start">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Checkbox name="remember" label="Recuérdame" />
        <Link variant="subtitle2" underline="hover">
          ¿Olvidaste tu contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="small" type="submit" variant="contained" onClick={handleClick}>
        Acceder
      </LoadingButton>
    </Stack>
  );
}
