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
  createTileLayerComponent, LayerProps,
  updateGridLayer,
  withPane,
} from '@react-leaflet/core';

import { WMSTileLayerProps } from 'react-leaflet';

import L, { TileLayer } from 'leaflet';

import 'leaflet.vectorgrid';

export interface VectorGridTileLayerProps extends WMSTileLayerProps {
  // data: any;
  // style: any;
  // hoverStyle: any;
  // activeStyle: any;
  // onClick: any;
  // onMouseover: any;
  // onMouseout: any;
  // onDblclick: any;
  // onContextmenu: any;
  vectorTileLayerStyles?: any;
  map?: any;
  // url: any;
  // maxNativeZoom: any;
  // subdomains: any;
  // accessKey: any;
  // accessToken: any;
  // type: any;
  // interactive: any;
  // idField: any;
  // rest: any;
  // tooltipClassName: any;
  // tooltip: any;
  // popup: any;
}


export const VectorGridTileLayer = createTileLayerComponent<
  TileLayer.WMS,
  VectorGridTileLayerProps
>(
  function createVectorGridTileLayer(
    { eventHandlers: _eh, params = {}, url, ...options },
    context,
  ) {

    // @ts-ignore
    // const tdWmsLayer = L.timeDimension.layer.wms(wmsLayer);
    const tdWmsLayer = L.vectorGrid.protobuf(url, {
		interactive: true,
		getFeatureId: function(f) {
			return f.properties;
		},
    vectorTileLayerStyles: {
      // 'public.places_cities.centroid': (properties, zoom, geometryDimension) => {
      //   // console.log(properties, zoom, geometryDimension);
      //   return {
      //     color: 'grey',
      //     weight: 1,
      //     radius: 5,
      //     fill: true,
      //     fillOpacity: 1,
      //   }
      // },
      // 'public.places_provinces.geometry': {
      //   // color: 'green',
      //   // fill: false
			// 	weight: 1,
			// 	// fillColor: '#3bb50a',
			// 	color: '#b50a0a',
			// 	fillOpacity: 0,
			// 	opacity: 0.4
      // },
      'public.places_regions.geometry': {
				fill: true,
				weight: 1,
				fillColor: '#c0c0c0',
				color: '#b50a0a',
				fillOpacity: 0,
				opacity: 0.4
        // color: 'red',
        // fill: false
      },
      // 'public.places_provinces.centroid': {
      //   color: 'blue',
      //   fill: true
      // },
    },
  //   getFeatureId: function (e) {
  //     const {map} = context;
  //     console.log(e);
  //     if(e.geometry[0].length == 1) {
  //       const latlng = map.layerPointToLatLng(e.geometry[0][0]);
  //       console.log(latlng);
  //       const stationName = e.properties.name;
  //       const marker = L.marker(latlng, {
  //         icon: L.divIcon({
  //           html: `<span class=labelName>${stationName}</span>`,
  //           iconAnchor: [5, 10],
  //         }),
  //       });
  //       marker.addTo(map);
  //     }
  // },
  })
	.on('click', function(e) {
		// console.log('BAUBAU ',e)
	})
  .on('moveend', function(e) {
     // console.log(e.map.getBounds());
  })
	.on('mouseover', function(e) {
		// console.log('sopra!!! ',e)
		// $('.leaflet-tile-loaded').addClass("leaflet-interactive");
	})
;

    return createElementObject(tdWmsLayer, context);
  },
  function updateVectorGridTileLayer(layer, props, prevProps) {
    // console.log('PASSO')
    updateGridLayer(layer, props, prevProps);

    if (props.params != null && props.params !== prevProps.params) {
      layer.setParams(props.params);
    }
  },
);
