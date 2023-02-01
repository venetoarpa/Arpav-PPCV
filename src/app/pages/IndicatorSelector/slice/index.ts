import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { indicatorSelectionSaga } from './saga';
import { IndicatorSelectionState } from './types';

export const initialState: IndicatorSelectionState = {};

const slice = createSlice({
  name: 'indicatorSelection',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions: indicatorSelectionActions } = slice;

export const useIndicatorSelectionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: indicatorSelectionSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useIndicatorSelectionSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
