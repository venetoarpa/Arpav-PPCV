import {Property} from "csstype";

export const MapContainerStyle = {
  height: '100%',
  width: '100%',
};

export const MousePositionDisplayStyle = theme => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'white',
  width: '16.5em',
  marginRight: '0',

  '&>p': {
    marginTop: '0.7em',
    marginBottom: '0.7em',
  },
});

export const MobileSpaceDisplayStyle = {
  width: '1em',
  height: '1em',
  marginRight: '0',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column' as Property.FlexDirection,
  justifyContent: 'space-between',
  alignItems: 'center',
  // visibility: 'hidden',
  visibility: 'hidden' as Property.Visibility,
};

export const LegendBarStyle = theme => ({
  '& img': {
    width: '90px',
    [theme.breakpoints.down('def')]: {
      width: '65px',
    },
    '@media screen and (max-height: 770px)': {
      width: '65px',
    },
  },
});