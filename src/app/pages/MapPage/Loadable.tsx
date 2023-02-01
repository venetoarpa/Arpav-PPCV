/**
 * Asynchronously loads the component for NotFoundPage
 */

import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import {
  CircularProgress,
} from '@mui/material';

export const MapPage = lazyLoad(
  () => import('./index'),
  module => module.MapPage,
  {
    fallback: <CircularProgress />,
  },
);
