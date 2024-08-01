import { styled } from '@mui/material/styles';
import theme from '../themes/MyTheme'; // Adjust the path to where your theme is located
import {Link} from 'react-router-dom';


export const Sidebar = styled('div')({
  width: '22vw',
  height: '75vh',
  background: theme.palette.primary.light,
});

export const SideNav = styled('div')({
  height: '10%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const SideLink = styled(Link)({
  color: theme.palette.secondary.light,
  textDecoration: 'none',
  width: '130px',
});


