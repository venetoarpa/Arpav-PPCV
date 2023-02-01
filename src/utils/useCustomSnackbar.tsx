import { OptionsObject, SnackbarMessage, useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const useCustomSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const enqueueCSnackbar = (
    message: SnackbarMessage,
    options?: OptionsObject,
  ) =>
    enqueueSnackbar(message, {
      action: key => (
        <>
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <CloseIcon />
          </IconButton>
        </>
      ),
      ...options,
    });

  return { enqueueCSnackbar };
};

export default useCustomSnackbar;
