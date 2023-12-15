import { Navigate, useRoutes } from 'react-router-dom';
import { useState } from 'react';
// layouts
import DashboardLayout from '../layouts/dashboard';
import SimpleLayout from '../layouts/simple';
//
import BlogPage from '../pages/BlogPage';
import LoginPage from '../pages/LoginPage';

import ProductsPage from '../pages/ProductsPage';
import DashboardAppPage from '../pages/DashboardAppPage';
import CreditPage from '../pages/CreditPage';
import InventoryPage from '../pages/InventoryPage'; // or .jsx, or the correct extension
import Page404 from '../pages/Page404';
import SalesPage from '../pages/SalesPage';



export default function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email, password) => {
    // Aquí debes realizar la lógica de autenticación adecuada.
    // Este es solo un ejemplo básico, no lo uses en producción.
  
    // Verificar si el nombre de usuario y la contraseña son correctos
    const isValidCredentials = checkCredentials(email, password);
  
    if (isValidCredentials) {
      // Si las credenciales son válidas, establecer isAuthenticated en true.
      setIsAuthenticated(true);
      console.log('Inicio de sesión exitoso!');
    } else {
      // Si las credenciales no son válidas, puedes mostrar un mensaje de error.
      console.error('Credenciales incorrectas. Intenta de nuevo.');
    }
  };
  
  const checkCredentials = (email, password) => {
    // Aquí puedes implementar la lógica para verificar las credenciales.
    // En un escenario real, podrías hacer una solicitud al servidor para autenticar.
  
    // Este es solo un ejemplo básico, NO lo uses en producción.
    const validemail = 'email';
    const validPassword = 'password';
  
    return email === validemail && password === validPassword;
  };
  

  const routes = useRoutes([
    {
      path: '/',
      element: isAuthenticated ? <DashboardLayout /> : <LoginPage onLogin={handleLogin} />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true }
       
      ],
    },

    {
      path: '/dashboard',
      element:  <DashboardLayout />  ,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'credit', element: <CreditPage /> },
        { path: 'inventory', element: <InventoryPage /> },
        { path: 'sale', element: <SalesPage/> },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/dashboard/app" /> : <LoginPage onLogin={handleLogin} />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
