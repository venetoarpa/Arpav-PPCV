import React, { useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ModalStyle, PageContainerStyle } from './styles';
import InfoPage from 'app/pages/InfoPage';
import DataPolicyPage from '../../pages/DataPolicyPage';
import PrivacyPolicyPage from '../../pages/PrivacyPolicyPage';

const ModalRouter = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const location = useLocation();

  const routes = ['/info', '/data', '/privacy'];

  useEffect(() => {
    if (routes.includes(location.pathname)) {
      handleOpen();
    } else if (open) {
      handleClose();
    }
  }, [location]);

  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={ModalStyle}
    >
      <Routes>
        <Route path={routes[0]} element={<InfoPage />} />
        <Route path={routes[1]} element={<DataPolicyPage />} />
        <Route path={routes[2]} element={<PrivacyPolicyPage />} />
      </Routes>
    </Modal>
  );
};
export default ModalRouter;
