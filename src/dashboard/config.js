
import { SvgIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DescriptionIcon from '@mui/icons-material/Description';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
//

export const items = [
  {
    title: 'Home',
    path: '',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Clientes',
    path: 'personas',
    icon: (
      <SvgIcon fontSize="small">
        <PersonIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Productos',
    path: 'productos',
    icon: (
      <SvgIcon fontSize="small">
        <StorefrontIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Servicios',
    path: 'servicios',
    icon: (
      <SvgIcon fontSize="small">
        <EngineeringIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Proformas',
    path: 'proformas',
    icon: (
      <SvgIcon fontSize="small">
        <DescriptionIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Tabla de Proformas',
    path: 'tablas_proformas',
    icon: (
      <SvgIcon fontSize="small">
        <ListAltIcon/>
      </SvgIcon>
    )
  },
  {
    title: 'Facturar',
    path: 'facturador',
    icon: (
      <SvgIcon fontSize="small">
        <PostAddIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Tabla de Facturas',
    path: 'tablas_facturas',
    icon: (
      <SvgIcon fontSize="small">
        <ReceiptIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Configuraciones',
    path: 'configuraciones',
    icon: (
      <SvgIcon fontSize="small">
        <SettingsIcon />
      </SvgIcon>
    )
  }
  

];