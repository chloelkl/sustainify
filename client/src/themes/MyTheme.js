// https://mui.com/material-ui/customization/color/
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#94C4BB', // local sidebar
      main: '#87AEA6', // navbar colour
    },
    secondary: {
      light: '#FFFFFF', // white
      main: '#F1FFE8', // background colour
      dark: '#000000' // black
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