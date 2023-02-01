import { createControlComponent } from '@react-leaflet/core';
import { DummyControl, DummyControlProps } from './DummyControl';

export const DummyControlComponent = createControlComponent<
  DummyControl,
  DummyControlProps
>(function createControlComponent(props) {
  return new DummyControl(props);
});
