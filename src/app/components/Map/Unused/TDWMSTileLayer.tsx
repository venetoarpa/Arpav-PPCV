/*
 *
 * Time Dimension WMS Tile Layer
 *
 * From leafletjs TileLayer.WMS options documentation:
 * If any custom options not documented here are used, they will be sent to the WMS server as
 * extra parameters in each request URL. This can be useful for non-standard vendor WMS parameters.
 *
 */

import {
  createElementObject,
  createTileLayerComponent,
  updateGridLayer,
  withPane,
} from '@react-leaflet/core';

import { WMSTileLayerProps } from 'react-leaflet';

import { TileLayer } from 'leaflet';
import L from 'leaflet';

export const TDWMSTileLayer = createTileLayerComponent<
  TileLayer.WMS,
  WMSTileLayerProps
>(
  function createTDWMSTileLayer(
    { eventHandlers: _eh, params = {}, url, ...options },
    context,
  ) {
    const wmsLayer = new TileLayer.WMS(url, {
      ...params,
      ...withPane(options, context),
    });

    // @ts-ignore
    const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer);

    return createElementObject(tdWmsLayer, context);
  },
  function updateTDWMSTileLayer(layer, props, prevProps) {
    const { url } = props;
    // console.log('UPDATING')
    updateGridLayer(layer, props, prevProps);
    if (url != null && url !== prevProps.url) {
      // @ts-ignore
      layer._currentLayer.setUrl(url);
      // @ts-ignore
      layer._currentLayer.redraw();
    }

    if (props.params != null && props.params !== prevProps.params) {
      layer.setParams(props.params);
    }
  },
);
