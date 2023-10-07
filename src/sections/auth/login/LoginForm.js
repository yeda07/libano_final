import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div style={{ background: 'black', height: '100vh' }}> {/* Cambia el color de fondo a negro */}
      <Stack spacing={3}>
        <TextField name="correo" label="Correo" />

        <TextField
          name="contraseña"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="izq">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="start">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
        ¿Has olvidado tu contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="small" type="submit" variant="contained" onClick={handleClick} >
        Accede
      </LoadingButton>
    </div>
  );
}
