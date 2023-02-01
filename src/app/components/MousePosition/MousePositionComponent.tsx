import { createControlComponent } from '@react-leaflet/core';
import { MousePosition, MousePositionProps } from './MousePosition';

export type MousePositionComponentProps = MousePositionProps;

export const MousePositionComponent = createControlComponent<
  MousePosition,
  MousePositionProps
>(function createControlComponent(props) {
  return new MousePosition(props);
});
