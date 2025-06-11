import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d84315', 
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4caf50', 
    },
    background: {
      default: '#fbe9e7',
      paper: '#fff3e0',
    },
    text: {
      primary: '#3e2723',
      secondary: '#5d4037',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, sans-serif',
    h1: {
      fontWeight: 600,
      color: '#d84315',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;