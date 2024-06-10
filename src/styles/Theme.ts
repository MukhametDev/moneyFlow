import { createTheme } from '@mui/material/styles';
import { ruRU } from '@mui/x-date-pickers/locales';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#696969',
    },
    secondary: {
      main: '#808080',
    },
    background: {
      default: '#ffffff',
      
    },
  },
}, ruRU);