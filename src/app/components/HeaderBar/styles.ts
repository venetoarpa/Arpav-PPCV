import { HeaderProps } from 'design-react-kit';

export const AppBarStyle = theme => ({
  position: 'static',
  height: theme.custom.headerHeight,
  maxHeight: theme.custom.headerHeight,
  overflow: 'hidden',
  boxShadow: 'none',
  color: 'success.dark',
  backgroundColor: 'background.paper',
  justifyContent: 'center',
});

export const ToolBarStyle = theme => ({
  '@media (min-width:0px)': {
    maxHeight: 'inherit',
    minHeight: '0px',
    pl: 1,
    pr: 1,
    gap: 5,
    [theme.breakpoints.down('def')]: {
      gap: 2,
      justifyContent: 'space-between',
      pl: 0.2,
      pr: 0.2,
    },
  },
});

export const BoxTitleStyle = theme => ({
  flexGrow: 8,
});

export const BoxMenuStyle = theme => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8,

  '& .MuiLink-root': {
    textAlign: 'center',
  },

  [theme.breakpoints.down('def')]: {
    gap: 2,
    fontSize: '0.8em',
    ml: 1,
  },
});

export const BoxImgStyle = theme => ({
  maxHeight: 'inherit',
  height: 'inherit',

  '& a': {
    boxSizing: 'border-box',
    p: 0,
    maxHeight: 'inherit',
    height: 'inherit',
    objectFit: 'contain',
  },

  '& img': {
    boxSizing: 'border-box',
    p: 1,
    maxHeight: 'inherit',
    height: 'inherit',
    objectFit: 'contain',
  },
});

export const LogoStyle = theme => ({
  fontWeight: 'bold',
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'inline',
  },
});

export const LogoStyleV = theme => ({
  ...LogoStyle(theme),
  color: 'primary.main',
});

export const HeaderStyle = {
  fontFamily: 'Titillium Web, Helvetica Neue, Helvetica, Arial, sans-serif',
};

export const HeaderBrandStyle = {
  fontFamily: 'Titillium Web, Helvetica Neue, Helvetica, Arial, sans-serif',
  fontSize: '1.25rem',
  color: 'rgb(22, 77, 54)',
};

export const LinkStyle = {
  color: '#ae6028',
};

export const HeaderTextStyle = {
  color: 'rgb(22, 77, 54)',
  fill: 'rgb(22, 77, 54)',
};
