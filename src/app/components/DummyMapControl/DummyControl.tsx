import leaflet from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';

import { SimpleDisplay, SimpleDisplayProps } from './SimpleDisplay';

const ControlBase: React.FunctionComponent<{
  map: leaflet.Map;
  control: React.FunctionComponent<SimpleDisplayProps>;
}> = props => {
  return <props.control param1={'test1'} />;
};

export interface DummyControlProps extends leaflet.ControlOptions {
  customComponent?: React.FunctionComponent<SimpleDisplayProps>;
}

export class DummyControl extends leaflet.Control {
  _div: HTMLElement | null;
  control: React.FunctionComponent<SimpleDisplayProps>;
  constructor(options?: DummyControlProps) {
    super(options);
    this._div = null;
    this.control = options?.customComponent || SimpleDisplay;
  }

  onAdd = (map: leaflet.Map) => {
    this._div = leaflet.DomUtil.create('div', '');
    ReactDOM.render(
      <ControlBase map={map} control={this.control} />,
      this._div,
    );
    return this._div;
  };
  onRemove = () => {
    // console.log('Map control removed.');
  };
}

declare let L: any;
L.MousePosition = DummyControl;
