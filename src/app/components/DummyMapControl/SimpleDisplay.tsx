import React from 'react';
import leaflet from 'leaflet';

export interface SimpleDisplayProps {
  param1?: string;
}

export const SimpleDisplay: React.FunctionComponent<
  SimpleDisplayProps
> = props => {
  const param1 = props.param1;
  return (
    <React.Fragment>
      <small>
        Dummy control, params: {param1}
      </small>
    </React.Fragment>
  );
};
