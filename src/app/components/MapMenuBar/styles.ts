import { keyframes } from '@mui/system';

export const warning = keyframes`
    from {
      border: 1px solid yellow;
      background-color: #164d36;
    }
    to {
      border: none;
      background-color: #387e5d;
    }
`;
export const needsSelection = keyframes`
    from {
      border: none;
      # background-color: #d18a5c;
    }
    to {
      border: 1px solid yellow;
      # background-color: #D5956F;
    }
`;


export const MapMenuBarStyle = {
  alignItems: 'flex-end',
  '& .MuiSelect-select': {
    color: 'primary.contrastText',
  },
  '& button': {
    color: 'primary.contrastText',
  },
};

export const MenuFormControlStyle = theme => ({
  position: 'static',
});

export const GridContainerStyle = {
  // color: '#d5956f',
  flexBasis: '100%',
  '--Grid-borderWidth': '1px',
  borderTop: 'none',
  borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'none',
    borderColor: 'divider',
  },
};

// export const MenuSelectionMobileStyle = theme => ({
//   color: 'white',
//   backgroundColor: 'green',
// });

export const MenuSelectionMobileStyle = theme => ({
  border: '1px solid',
  borderColor: 'divider',
  color: 'success.contrastText',
  backgroundColor: 'success.dark',
  pt: 1.5,
  pb: 0.5,
  pl: 1.5,
  pr: 1.5,
});

export const FirstRowStyle = theme => ({
  color: 'success.dark',
  backgroundColor: 'secondary.light',
  paddingLeft: 2,
});

export const SecondRowStyle = theme => ({
  backgroundColor: 'success.dark',
  '& .NeedsSelection': {
    animation: `${warning} 2s infinite ease`
  },
});

export const MenuLabelStyle = {
  paddingTop: 1,
  paddingBottom: 0.5,
};

export const SelectStyle = theme => ({
  width: '100%',
  height: '100%',
  '& .MuiSelect-select': {
    paddingTop: 2,
    paddingBottom: 1,
    paddingLeft: 0,
  },
  '& .MultiRadioSelect': {
    paddingLeft: 2,
    borderRadius: '0',
    [theme.breakpoints.down('def')]: {
      paddingLeft: 0,
    },
  },
  '& .MultiRadioSelect-open': {
    backgroundColor: 'primary.main',
  },
  '& svg': {
    color: 'primary.contrastText',
  },
});

export const LeftSelectStyle = theme => ({...SelectStyle(theme),
  '& .MultiRadioSelect': {
    paddingLeft: 4,
    borderRadius: '0',
    [theme.breakpoints.down('def')]: {
      paddingLeft: 0,
    },
  },
});

export const SelectMenuStyle = theme => ({
  '& .MuiMenu-paper': {
    color: 'primary.contrastText',
    backgroundColor: 'primary.main',
    pt: 0,
    pb: 2,
    pl: 2,
    pr: 2,
    borderRadius: '0',
    '& .MultiRadioSelectMenu': {
      gap: 4,
      pr: 3,
    },
    '& .MultiRadioSelectMenuColumn': {
      gap: 2,
    },
    '& .MultiRadioSelectMenuGroupLabel': {
      textTransform: 'uppercase',
    },
    '& .NeedsSelection': {
      // padding: '5px',
      // border: '3px solid red',
      animation: `${needsSelection} 2s infinite ease`
    },
    '& .MultiRadioSelectMenuItem': {
      opacity: theme.palette.action.notSelectedOpacity,
      '& svg': {
        color: 'primary.contrastText',
      },
    },
    '& .MultiRadioSelectMenuItem-selected': {
      opacity: '1',
    },
    '& hr': {
      borderColor: 'primary.contrastText',
      opacity: theme.palette.action.notSelectedOpacity,
    },
  },
});

export const LeftSpaceStyle = {
  paddingLeft: 2,
};

export const ButtonBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alighItems: 'center',
  height: '100%',
};
