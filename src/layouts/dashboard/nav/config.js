// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'producto',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'sale',
    path: '/dashboard/sale',
    icon: icon('ic_cart'),
  },
 
  
  {
    title: 'inventory',
    path: '/dashboard/inventory',
    icon: icon('ic_inventory'),
  },

  {
    title: 'credit',
    path: '/dashboard/credit',
    icon: icon('ic_credit'),
  },

  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
 
  {
    title: 'usuario',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
 

  {
    title: 'No se ha encontrado',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
