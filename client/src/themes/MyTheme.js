// https://mui.com/material-ui/customization/color/
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#94C4BB',
      main: '#87AEA6',
    },
    secondary: {
      light: '#FFFFFF',
      main: '#F1FFE8',
      dark: '#000000'
    }
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Arial'
    ].join(','),
  }
});

export default theme;