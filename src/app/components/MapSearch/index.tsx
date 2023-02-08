import React from 'react';
import {
  Button,
  Paper,
  Autocomplete,
  Box,
  TextField,
  IconButton, Typography,
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
  MapSearchSecondRowStyle
} from './styles';
import {formatYear} from "../../../utils/dates";
import TodayIcon from '@mui/icons-material/Today';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import {OpacityComponent} from "../Map/OpacityComponent";
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import {RestartAlt} from "@mui/icons-material";

export interface MapSearchProps {
  className?: string;
  value: iCityItem | null;
  setPoint?: Function;
  openCharts?: Function;
  defaultCenter: [number, number];
  defaultZoom: number;
}


export const ValueRenderer = ({time, value, unit}) => {
  // console.log({timeserie});
  return (<div style={{ padding: 2, width: '25%'}}>
            <Typography variant={'body2'}>
            {/*<div style={{backgroundColor: 'red', color: 'white', padding: 3}}>*/}
              <TodayIcon fontSize={'small'}/> {formatYear(time)}
            </Typography>
            {/*</div>*/}
            <Typography variant={'body2'}>
              <GpsFixedOutlinedIcon fontSize={'small'}/> {value !== null ? roundTo4(value, 1) : '-'}{unit}
            </Typography>
          </div>);
}

export const MapSearch: React.FunctionComponent<
  MapSearchProps
> = props => {
  const { value, setPoint, openCharts, className, defaultCenter, defaultZoom } = props;
  const { cities, selected_map, timeserie } = useSelector((state: any) => state.map);
  const map = useMap();
  const context = useLeafletContext();
  const { t } = useTranslation();
  const resetMap = () => context.map.flyTo(defaultCenter, defaultZoom);
  const onChange = (event, value) => {
    // console.log('Ricerca per comune', event, value);
    typeof setPoint === 'function' && setPoint(value);
    if(!value) {
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
      context.map.flyTo([value.latlng.lat, value.latlng.lng], context.map.getZoom()-1);
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
        context.map.flyTo([value.latlng.lat, value.latlng.lng], context.map.getZoom()+1);
      }, 100);
    }
  };

  // @ts-ignore
  return (
    <Box className={className} sx={MapSearchContainerStyle}>
      <Box component="form" sx={MapSearchFirstRowStyle}>
        <Autocomplete
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
        {value && (typeof openCharts === 'function' && selected_map.data_series === 'yes' && (
          <IconButton onClick={() => openCharts(value)}>
            <LineAxisIcon />
          </IconButton>
        ))}
        {value && selected_map.data_series === 'no' && timeserie.length > 0 && (<ValueRenderer
          time={timeserie[0].values[0].time}
          value={timeserie[0].values[0].value}
          unit={selected_map.unit}
        />)}
      </Box>
      <Box sx={MapSearchSecondRowStyle}>
        <Box sx={LatLngStyle}>
          {value?.latlng &&
            <Button size={'small'}  color={'secondary'}
                    variant="outlined"
                    onClick={() => context.map.flyTo([value.latlng.lat, value.latlng.lng], context.map.getZoom())}
                    endIcon={<ZoomInMapIcon fontSize={'small'} color={'secondary'}/>}
                    >{roundTo4(value.latlng.lat)}, {roundTo4(value.latlng.lng)}</Button>}
          {
            !value?.latlng && (<Button size={'small'}  color={'secondary'} variant="outlined"
            onClick={resetMap}
            >
                {/*<RestartAlt/>*/}
                <ZoomInMapIcon/>
             </Button>)
          }
        </Box>
        <OpacityComponent/>
      </Box>
    </Box>
  );
};
