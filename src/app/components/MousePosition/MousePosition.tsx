import leaflet, { LatLng } from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';

import { MousePositionControl, MousePositionControlProps } from './Control';

const ControlBase: React.FunctionComponent<{
  map: leaflet.Map;
  control: React.FunctionComponent<MousePositionControlProps>;
  onClick: (latLng: LatLng) => void;
}> = props => {
  const [coords, setCoords] = React.useState(new leaflet.LatLng(0, 0));
  props.map.on({
    mousemove: event => {
      setCoords(event.latlng);
    },
    click: event => {
      setCoords(event.latlng);
      props.onClick(event.latlng);
    },
  });
  return <props.control latlng={coords} />;
};

export interface MousePositionProps extends leaflet.ControlOptions {
  customComponent?: React.FunctionComponent<MousePositionControlProps>;
  onClick?: (latLng: LatLng) => void;
}

export class MousePosition extends leaflet.Control {
  _div: HTMLElement | null;
  control: React.FunctionComponent<MousePositionControlProps>;
  onClick: (latLng: LatLng) => void;
  constructor(options?: MousePositionProps) {
    super(options);
    this._div = null;
    this.control = options?.customComponent || MousePositionControl;
    this.onClick = options?.onClick ?? (latLng => {});
  }

  onAdd = (map: leaflet.Map) => {
    this._div = leaflet.DomUtil.create('div', '');
    ReactDOM.render(
      <ControlBase map={map} control={this.control} onClick={this.onClick} />,
      this._div,
    );
    return this._div;
  };
  onRemove = () => {
    // console.log('Bye');
  };
}

declare let L: any;
L.MousePosition = MousePosition;
