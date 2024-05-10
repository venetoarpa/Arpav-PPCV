import React from 'react';
import {
  Button,
  Paper,
  Autocomplete,
  Box,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { useTranslation } from 'react-i18next';
import { roundTo4 } from '../../../utils/json_manipulations';
import { iCityItem } from '../../pages/MapPage/slice/types';
import {
  AutocompleteSyle,
  LatLngStyle,
  MapSearchContainerStyle,
  MapSearchFirstRowStyle,
  MapSearchSecondRowStyle,
} from './styles';
import { formatYear } from '../../../utils/dates';
import TodayIcon from '@mui/icons-material/Today';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import { OpacityComponent } from '../Map/OpacityComponent';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { RestartAlt } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useMapEvent } from 'react-leaflet';

export interface MapSearchProps {
  className?: string;
  value: iCityItem | null;
  setPoint?: Function;
  openCharts?: Function;
  defaultCenter: [number, number];
  defaultZoom: number;
}

export interface MapPopupProps {
  className?: string;
  value: iCityItem | null;
  setPoint?: Function;
  openCharts: Function;
}

export const ValueRenderer = ({ time, value, unit }) => {
  // console.log({timeserie});
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ flex: '1 1 1px' }}></span>
      <Typography variant={'body2'}>
        {/*<div style={{backgroundColor: 'red', color: 'white', padding: 3}}>*/}
        <TodayIcon fontSize={'small'} /> {formatYear(time)}
      </Typography>
      {/*</div>*/}
      <Typography variant={'body2'}>
        <GpsFixedOutlinedIcon fontSize={'small'} />{' '}
        {value !== null ? roundTo4(value, 1) : '-'}
        {unit}
      </Typography>
      <span style={{ flex: '1 1 1px' }}></span>
    </div>
  );
};

export const MapSearch: React.FunctionComponent<MapSearchProps> = props => {
  const { value, setPoint, openCharts, className, defaultCenter, defaultZoom } =
    props;
  const { cities, selected_map, timeserie } = useSelector(
    (state: any) => state.map,
  );
  const map = useMap();
  const context = useLeafletContext();
  const { t } = useTranslation();
  const resetMap = () => context.map.flyTo(defaultCenter, defaultZoom);
  const onChange = (event, value) => {
    // console.log('Ricerca per comune', event, value);
    typeof setPoint === 'function' && setPoint(value);
    if (!value) {
      // console.log('no value')
      resetMap();
    }
    // @ts-ignore
    const found = Object.values(map._layers).find(
      // @ts-ignore
      x => x._url && x._url.includes('public.places_cities.geometry'),
    );
    // @ts-ignore
    if (found && value?.latlng) {
      context.map.flyTo(
        [value.latlng.lat, value.latlng.lng],
        context.map.getZoom() - 1,
      );
      // @ts-ignore
      found.setFeatureStyle(value.name, {
        color: 'yellow',
        weight: 1,
        radius: 1,
        fill: true,
        fillOpacity: 1,
        opacity: 1,
      });
      // @ts-ignore
      found.fire('click', {
        // @ts-ignore
        latlng: L.latLng([value.latlng.lat, value.latlng.lng]),
        // latlng: found.latlng,
        layer: {
          properties: value,
        },
      });
      setTimeout(() => {
        context.map.flyTo(
          [value.latlng.lat, value.latlng.lng],
          context.map.getZoom() + 1,
        );
      }, 100);
    }
  };

  // @ts-ignore
  return (
    <Box component="form" className={className} sx={MapSearchContainerStyle}>
      <Box sx={MapSearchFirstRowStyle}>
        <Autocomplete
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          size={'small'}
          // disablePortal
          options={cities}
          sx={AutocompleteSyle}
          renderInput={params => (
            <TextField {...params} label="" placeholder="Ricerca per comune" />
          )}
          onChange={onChange}
          value={value}
          isOptionEqualToValue={(option, value) => option.label === value.label}
        />
      </Box>
      <Box sx={MapSearchSecondRowStyle}>
        {value?.latlng && (
          <TextField
            sx={LatLngStyle}
            size={'small'}
            color={'secondary'}
            variant="outlined"
            value={
              roundTo4(value.latlng.lat) + ', ' + roundTo4(value.latlng.lng)
            }
            InputProps={{
              endAdornment: (
                <>
                  <IconButton
                    edge="end"
                    onClick={() =>
                      context.map.flyTo(
                        [value.latlng.lat, value.latlng.lng],
                        context.map.getZoom(),
                      )
                    }
                  >
                    <ZoomInMapIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                  <IconButton edge="end" onClick={resetMap}>
                    <RefreshIcon fontSize={'small'} color={'secondary'} />
                  </IconButton>
                </>
              ),
            }}
            aria-label={'Centra la mappa'}
          ></TextField>
        )}
      </Box>
    </Box>
  );
};

export const CompactValueRenderer = ({ time, value, unit }) => {
  // console.log({timeserie});
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ flex: '1 1 1px' }}></span>
      <div style={{ padding: '0', margin: 0 }}>
        {/*<div style={{backgroundColor: 'red', color: 'white', padding: 3}}>*/}
        <TodayIcon fontSize={'small'} /> {formatYear(time)}
      </div>
      {/*</div>*/}
      <div style={{ padding: '0', margin: 0 }}>
        <GpsFixedOutlinedIcon fontSize={'small'} />{' '}
        {value !== null ? roundTo4(value, 1) : '-'}
        {unit}
      </div>
      <span style={{ flex: '1 1 1px' }}></span>
    </div>
  );
};

export const MapPopup: React.FunctionComponent<MapPopupProps> = props => {
  const { value, setPoint, openCharts, className } = props;
  const { cities, selected_map, timeserie } = useSelector(
    (state: any) => state.map,
  );
  const baseYear = 1976;
  let yr = 2024;
  let yrfield = document.getElementsByClassName('timecontrol-date');
  let yrstring = '2024';
  if (yrfield.length > 0) {
    yrstring = yrfield[0].textContent!;
  }
  try {
    yr = parseInt(yrstring, 10);
  } catch (ex) {
    yr = 2024;
  }

  let tsindex = 0;

  if (timeserie[0].values.length > 1) {
    tsindex = yr - baseYear;
  } else {
    tsindex = 0;
  }
  const map = useMap();
  const context = useLeafletContext();
  const { t } = useTranslation();
  const onChange = (event, value) => {
    // console.log('Ricerca per comune', event, value);
    typeof setPoint === 'function' && setPoint(value);
    // @ts-ignore
    const found = Object.values(map._layers).find(
      // @ts-ignore
      x => x._url && x._url.includes('public.places_cities.geometry'),
    );
    // @ts-ignore
    if (found && value?.latlng) {
      context.map.flyTo(
        [value.latlng.lat, value.latlng.lng],
        context.map.getZoom() - 1,
      );
      // @ts-ignore
      found.setFeatureStyle(value.name, {
        color: 'yellow',
        weight: 1,
        radius: 1,
        fill: true,
        fillOpacity: 1,
        opacity: 1,
      });
      // @ts-ignore
      found.fire('click', {
        // @ts-ignore
        latlng: L.latLng([value.latlng.lat, value.latlng.lng]),
        // latlng: found.latlng,
        layer: {
          properties: value,
        },
      });
      setTimeout(() => {
        context.map.flyTo(
          [value.latlng.lat, value.latlng.lng],
          context.map.getZoom() + 1,
        );
      }, 100);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {timeserie && (
        <CompactValueRenderer
          time={timeserie[0]?.values[tsindex].time}
          value={timeserie[0]?.values[tsindex].value}
          unit={selected_map.unit}
        />
      )}
      <span style={{ flex: '1 1 1px' }}></span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ flex: '1 1 1px' }}></span>
        <IconButton
          onClick={() => openCharts(value)}
          aria-label={'Mostra serie temporale'}
        >
          <LineAxisIcon />
        </IconButton>
        <span style={{ flex: '1 1 1px' }}></span>
      </div>
    </div>
  );
};
