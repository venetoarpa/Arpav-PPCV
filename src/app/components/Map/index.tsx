import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';
import sensorPositions from './data';
import L from 'leaflet';

import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
  LayersControl,
  Circle,
  CircleMarker,
  Popup,
  GeoJSON,
} from 'react-leaflet';
import { Map as LMap } from 'leaflet';
import {
  MousePositionComponent,
  MousePositionComponentProps,
  MousePositionControlProps,
} from '../MousePosition';
import { MapSearch } from '../MapSearch';
import { DummyControlComponent } from '../DummyMapControl';
import { useSelector } from 'react-redux';
import { ThreddsWrapperLayer } from './ThreddsWrapperLayer';
import CustomControlMap from './CustomControlMap';
import { LegendBar } from './LegendBar';
import { VectorWrapperLayer } from './VectorWrapperLayer';
import { roundTo4 } from '../../../utils/json_manipulations';
import { iCityItem } from '../../pages/MapPage/slice/types';
import {
  MapContainerStyle,
  MobileSpaceDisplayStyle,
  MousePositionDisplayStyle,
} from './styles';
import { OpacityComponent } from './OpacityComponent';
// import {BaseLayerControl} from "./BaseLayerControl";

const MobileSpaceDisplay = () => {
  return (
    <div
      className={'custom-panel leaflet-bar leaflet-control'}
      style={MobileSpaceDisplayStyle}
      // style={{visibility: 'hidden'}}
    ></div>
  );
};

const MousePositionDisplay = (props: MousePositionControlProps) => {
  //{props.latlng.lat}
  //{props.latlng.lng}
  return (
    <Box
      className={
        'custom-panel leaflet-bar leaflet-control leaflet-control-coordinates'
      }
      sx={MousePositionDisplayStyle}
    >
      <div>
        {`Lat 
      ${roundTo4(props.latlng.lat)}`}
        <span style={{ visibility: 'hidden' }}>__</span>
        {`Long 
      ${roundTo4(props.latlng.lng)}`}
      </div>
    </Box>
  );
};

const MobileMousePositionDisplay = (props: MousePositionControlProps) => {
  return <></>;
};

interface MapProps {
  onReady?: (map: LMap) => void;
  openCharts?: (iCityItem) => void;
  setPoint?: Function;
  selectedPoint?: iCityItem | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const Map = (props: MapProps) => {
  const {
    setPoint = () => {},
    openCharts = () => {},
    onReady = () => {},
    selectedPoint = null,
    defaultCenter = [45.9, 12.45],
    defaultZoom = 8,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const timeDimensionOptions = {
    // requestTimeFromCapabilities: true,
    // updateTimeDimension: true,
  };

  return (
    <MapContainer
      style={MapContainerStyle}
      className="main-map"
      // @ts-ignore
      center={defaultCenter}
      zoom={defaultZoom}
      maxZoom={12}
      zoomControl={false}
      // @ts-ignore
      timeDimensionControl={true}
      timeDimensionextendedControl={true}
      timeDimension={true}
      timeDimensionOptions={timeDimensionOptions}
      timeDimensionControlOptions={{
        speedSlider: false,
        backwardButton: true,
        forwardButton: true,
        playButton: false,
      }}
      //@ts-ignore
      whenReady={obj => onReady(obj.target)}
    >
      <ZoomControl position={'topright'} />
      {isMobile && (
        <DummyControlComponent
          position={'topright'}
          customComponent={MobileSpaceDisplay}
        />
      )}
      <CustomControlMap position={'topright'}>
        <Box
          className="leaflet-bar"
          style={{ backgroundColor: 'white', padding: '2px' }}
        >
          <OpacityComponent></OpacityComponent>
        </Box>
        <LegendBar
          className={'leaflet-control-legend leaflet-control leaflet-bar'}
          isMobile={isMobile}
        />
      </CustomControlMap>
      <MousePositionComponent
        position={'bottomright'}
        customComponent={
          isMobile ? MobileMousePositionDisplay : MousePositionDisplay
        }
        // onClick={onMapClick}
      />
      <CustomControlMap position={'topleft'}>
        <MapSearch
          className={'leaflet-control-search'}
          value={selectedPoint}
          setPoint={setPoint}
          openCharts={openCharts}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />
      </CustomControlMap>
      {/*<BaseLayerControl/>*/}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a target="_blank" rel="noopener" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Sentinel 2">
          <TileLayer
            url="https://s2maps-tiles.eu/wmts?layer=s2cloudless-2021_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}"
            attribution='&copy; <a target="_blank" rel="noopener" href="https://s2maps.eu/">Sentinel-2 cloudless</a> by EOX'
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="Sensori">
          <GeoJSON
            data={sensorPositions}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 2,
                weight: 1,
              });
            }}
          ></GeoJSON>
        </LayersControl.Overlay>
      </LayersControl>
      <VectorWrapperLayer
        selectCallback={point => setPoint(point)}
        selectedPoint={selectedPoint}
        openCharts={openCharts}
      />
      {/*<CustomControlMap position={'topleft'}>*/}
      {/*  <OpacityComponent/>*/}
      {/*</CustomControlMap>*/}
      <CustomControlMap position="bottomleft">
        <Typography
          className={'leaflet-bar-timecontrol leaflet-bar leaflet-disclaimer'}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fontSize: '11px',
            position: 'absolute',
            bottom: '-10px',
            left: '-10px',
            minWidth: '50vw',
            margin: 0,
            border: 0,
            borderRadius: 0,
          }}
        >
          Si trastta di proiezioni climatiche e non di previsioni a lungo
          termine. Il valore annuale ha validità in un contesto di trend
          trentennale.
        </Typography>
      </CustomControlMap>
      <ThreddsWrapperLayer />
    </MapContainer>
  );
};

export default Map;
