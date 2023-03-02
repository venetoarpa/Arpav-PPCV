import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  IconButton,
  Link as MuiLink,
  Typography,
  Button,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import {AppBarStyle, ToolBarStyle, BoxTitleStyle, BoxMenuStyle, BoxImgStyle, LogoStyle, LogoStyleV} from './styles';
import { Link } from "react-router-dom";


const HeaderBar = () => {
  const { t } = useTranslation();
  // const actualstate = useSelector(state => state);
  // const route = useLocation();
  // console.log({ route, actualstate });
  const regioneImg = 'img/logo_regione_veneto.png';
  const arpavImg = 'img/logo_arpav.png';
  const snpaImg = 'img/logo_SNPA.png';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  return (
    <AppBar // position="static"
      sx={AppBarStyle}
    >
      <Toolbar sx={ToolBarStyle}>
        {/*
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          */}
        <Box style={{paddingLeft: '10px'}}>
          <MuiLink sx={BoxTitleStyle} href="/" color='success.dark' underline={'none'}>
            <Typography variant="h5" component="span" sx={LogoStyle}>
              PPC
            </Typography>
            <Typography variant="h5" component="span" sx={LogoStyleV}>
              {'NE '}
            </Typography>
            {!isMobile &&
              <Typography variant="h6" component="span">
                {t('app.header.acronymMeaning')}
              </Typography>
            }
          </MuiLink>
        </Box>
        <Box sx={BoxMenuStyle}>
          <MuiLink component={Link} to="/info" color="primary" underline={'none'}>
            {t('app.header.menu.info')}
          </MuiLink>
          <MuiLink component={Link} to="/privacy" color="primary" underline={'none'}>
            {t('app.header.menu.privacyPolicy')}
          </MuiLink>
          <MuiLink component={Link} to="/data" color="primary" underline={'none'} style={{paddingRight: '10px'}}>
            {t('app.header.menu.dataPolicy')}
          </MuiLink>
        </Box>
        {/*
          <Box sx={BoxImgStyle}>
            {!isMobile && <MuiLink href={'https://www.regione.veneto.it/'}><img src={regioneImg} alt={'Regione Veneto'}/></MuiLink>}
            <MuiLink href={'https://www.arpa.veneto.it/'}><img src={arpavImg} alt={'ARPA Veneto'}/></MuiLink>
            {!isMobile && <MuiLink href={'https://www.snpambiente.it/'}><img src={snpaImg} alt={'SNPAmbiente'}/></MuiLink>}
          </Box>
         */}
      </Toolbar>
      {/*<p><small>{JSON.stringify(actualstate)} - {JSON.stringify(route)}</small></p>*/}
    </AppBar>
  );
};
export default HeaderBar;
