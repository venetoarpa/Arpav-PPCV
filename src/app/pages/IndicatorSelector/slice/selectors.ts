import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.indicatorSelection || initialState;

export const selectIndicatorSelection = createSelector(
  [selectSlice],
  state => state,
);
