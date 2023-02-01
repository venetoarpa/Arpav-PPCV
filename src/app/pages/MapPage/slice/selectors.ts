import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.map || initialState;

export const selectMap = createSelector([selectSlice], state => state);
