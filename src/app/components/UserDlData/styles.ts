export const UserDataContainerStyle = theme => ({
  display: 'flex',
  // flexDirection: 'column',
  flexWrap: 'wrap',
});

export const FieldContainerStyle = theme => ({
  m: 6,
  [theme.breakpoints.down('def')]: {
    m:3,
  },
});

export const TextFieldSyle = theme => ({
  width: '20em',
  [theme.breakpoints.down('def')]: {
    width: '18em',
  },
});