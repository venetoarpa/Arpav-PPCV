export const DownloadModalStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const DownloadContainerStyle = theme => ({
  overflow: 'auto',
  boxSizing: 'border-box',
  width: `calc(100% - ${theme.spacing(4)})`,
  height: `calc(100% - ${theme.spacing(4)})`,
  p: 0,
  m: 0,
  bgcolor: 'background.paper',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 12,
});

export const MapUserContainerStyle = theme => ({
  p: 0,
  pt: 4,
  m: 0,
});

export const CloseIconContStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: 0,
});

export const DLButtonContStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  padding: 4,
  [theme.breakpoints.down('def')]: {
    justifyContent: 'center',
    pt: 1,
    pb: 1,
  },
});

export const CloseButtonContStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  padding: 4,
  [theme.breakpoints.down('def')]: {
    justifyContent: 'center',
    pt: 2,
    pb: 2,
  },
});

export const FieldContainerStyle = theme => ({
  m: 4,
});

export const MapDataContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  gap: 16,
  [theme.breakpoints.down('def')]: {
    gap: 0,
  },
});

export const MapDataSectionTextStyle = theme => ({
  color: 'success.dark',
  fontWeight: 'bold',
});

export const MapDataValueTextStyle = theme => ({
  color: 'success.dark',
});

export const YearsSliderStyle = theme => ({
  marginTop: 6,
  maxWidth: '24em',
  '& .MuiSlider-valueLabel': {
    backgroundColor: 'success.dark',
  },
});

export const ImgButtonContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
  m: 3,
  [theme.breakpoints.down('def')]: {
    flexDirection: 'column',
  },
});

export const ImgDoubleButtonContainerStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
});
