import L from 'leaflet';
import { Circle, CircleMarker, Popup, Pane, useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useLeafletContext, withPane } from '@react-leaflet/core';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet.vectorgrid';
import { VECTORTILES_URL } from '../../../utils/constants';

import { Button, Paper, Box, IconButton, Typography } from '@mui/material';
import { MapPopup } from '../MapSearch';

import { PopupStyle } from './styles';

export const VectorWrapperLayer = (props: any) => {
  const [refReady, setRefReady] = useState(false);
  let popupRef: any = useRef();

  const { selected_map } = useSelector((state: any) => state.map);
  const { selectCallback, selectedPoint, openCharts } = props;
  const map = useMap();
  const context = useLeafletContext();

  useEffect(() => {
    if (refReady) {
      popupRef.openOn(map);
    }
  }, [refReady]);
  // console.log(context.map.latLngToLayerPoint(selectedPoint.latlng))
  // const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    let selected = false;
    // let hovered = false;
    const container = context.layerContainer || context.map;
    const url = `${VECTORTILES_URL}/public.places_cities.geometry/{z}/{x}/{y}.pbf`;
    // @ts-ignore
    let vectorLayer = L.vectorGrid
      .protobuf(url, {
        interactive: true,
        vectorTileLayerStyles: {
          'public.places_cities.geometry': (
            properties,
            zoom,
            geometryDimension,
          ) => {
            let opacity = 0.5;
            let color = '#808080';
            if (zoom <= 9) {
              opacity = 0.1;
              color = '#b6b6b6';
            } else if (zoom >= 10 && zoom < 11) {
              opacity = 0.2;
            } else if (zoom >= 11 && zoom <= 12) {
              opacity = 0.3;
            }

            // console.log(zoom, color, opacity)
            return {
              color: color,
              weight: 1,
              radius: 1,
              fill: true,
              fillOpacity: 0,
              opacity: opacity,
            };
          },
        },
        getFeatureId: function (f) {
          if (selectedPoint && f.properties.name === selectedPoint.name) {
            // console.log('mi arriva ', selectedPoint)
            selected = f.properties.name;
            vectorLayer.setFeatureStyle(f.properties.name, {
              color: '#164d36',
              weight: 2,
              radius: 1,
              fill: true,
              fillOpacity: 0,
              opacity: 1,
            });
            vectorLayer.bringToFront();
          }
          return f.properties.name;
        },
      })
      .on('click', function (e) {
        vectorLayer.resetFeatureStyle(selected);
        selected = e.layer.properties.name;
        if (selected && e.layer) {
          const payload = {
            ...e.layer.properties,
            latlng: e.latlng,
            label: e.layer.properties.name,
          };
          // console.log(payload)
          selectCallback(payload);
        }
      })
      .on('mouseover', function (e) {});

    context.map.addLayer(vectorLayer);
    vectorLayer.bringToFront();

    return () => {
      // console.log('RETURN')
      try {
        // @ts-ignore
        if (vectorLayer) container.removeLayer(vectorLayer);
      } catch (e) {
        console.log('error REMOVING', e);
      }
    };
  }, [
    selected_map,
    map,
    selectedPoint,
    context.layerContainer,
    context.map,
    selectCallback,
  ]);

  return (
    selectedPoint && (
      <Pane name="custom" style={{ zIndex: 1000 }}>
        <CircleMarker
          center={[selectedPoint.latlng.lat, selectedPoint.latlng.lng]}
          radius={2}
          pathOptions={{ color: '#164d36' }}
        >
          <Popup
            ref={r => {
              popupRef = r;
              setRefReady(true);
            }}
          >
            <Box sx={PopupStyle}>
              <MapPopup
                openCharts={openCharts}
                value={selectedPoint}
              ></MapPopup>
            </Box>
          </Popup>
        </CircleMarker>
      </Pane>
    )
  );
};
