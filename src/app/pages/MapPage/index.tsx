/**
 *
 * MapPage
 *
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Box, Backdrop, CircularProgress, useMediaQuery} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MapLoadingContainerStyle, mapStyle } from './styles';
import Map from '../../components/Map';
import MapMenuBar from '../../components/MapMenuBar';
import { LatLng, Map as LMap } from 'leaflet';
import {
  SimpleMapScreenshoter,
  PluginOptions,
} from 'leaflet-simple-map-screenshoter';
import { find_keys, full_find_keys, useMapSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import TimeSeriesDialog from '../../components/TimeSeriesDialog';
import { useSearchParams } from 'react-router-dom';
import { selectMap } from './slice/selectors';
import { Filters, iCityItem } from './slice/types';
import { saveAs } from 'file-saver';
import useCustomSnackbar from '../../../utils/useCustomSnackbar';
import HeaderBar from "../../components/HeaderBar";

interface Props {}

export function MapPage(props: Props) {
  const actions = useMapSlice();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { enqueueCSnackbar } = useCustomSnackbar();

  const [inProgress, setInProgress] = React.useState(false); //TODO only for debug?
  const [tSOpen, setTSOpen] = React.useState(false);
  const mapRef = React.useRef<LMap | undefined>(undefined);
  const coordRef = React.useRef<LatLng>(new LatLng(0, 0, 0));
  const { layers, selected_map, cities, forecast_parameters, error } =
    useSelector(selectMap);
  const [loading, setLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<iCityItem | null>(null);
  const [mapScreen, setMapScreen] = useState<any>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  const handleMapReady = (map: LMap) => {
    mapRef.current = map;
    const mapScreenPlugin = new SimpleMapScreenshoter(PLUGIN_OPTIONS);
    //@ts-ignore
    mapScreenPlugin.addTo(mapRef.current);
    setMapScreen(mapScreenPlugin);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const joinNames = (names: string[]) => names.filter(name => name).join(' - ');

  const findValueName = (key: string, listKey: string) => {
    const id = selected_map[key];
    let name = '';
    if (id)
      name = forecast_parameters[listKey]?.find(item => item.id === id)?.name;
    return name ?? '';
  };

  useEffect(() => {
    dispatch(actions.actions.loadParameters());
    dispatch(actions.actions.loadLayers());
    dispatch(actions.actions.loadCities());
    return () => {
      console.log('Unmounting MapPage');
    };
  }, []);

  useEffect(() => {
    let params = {};
    searchParams.forEach((v, k) => {
      if (full_find_keys.includes(k) && v !== 'null' && v !== '') {
        params[k] = v;
      }
    });
    if (Object.keys(params).length > 0 && layers.length > 0) {
      dispatch(actions.actions.setMap(params as Filters));
    } else if (layers.length > 0) {
      dispatch(actions.actions.setMap(selected_map));
    }
    if (layers.length === 0) setLoading(true);
  }, [layers]);

  useEffect(() => {
    if (selected_map.id) {
      setLoading(false);
      const filterDict = {
        ...Object.fromEntries(
          Object.entries(selected_map).filter(([key]) =>
            full_find_keys.includes(key),
          ),
        ),
        city: selectedPoint?.name || '',
        lat: selectedPoint?.latlng.lat || '',
        lng: selectedPoint?.latlng.lng || '',
      };
      // @ts-ignore
      setSearchParams(filterDict as Filters);
    }
  }, [selected_map, selectedPoint]);

  useEffect(() => {
    if (selected_map.id) {
      let payload = {
        id: selected_map.id,
      };
      if (selectedPoint) {
        payload['lat'] = selectedPoint.latlng.lat;
        payload['lng'] = selectedPoint.latlng.lng;
      }
      dispatch(actions.actions.requestTimeserie(payload));
    } else {
      dispatch(actions.actions.setTimeserie([]));
    }
  }, [selected_map, selectedPoint]);

  useEffect(() => {
    if (
      searchParams.get('city') &&
      searchParams.get('lat') &&
      searchParams.get('lng')
    ) {
      setSelectedPoint({
        // ...city,
        name: searchParams.get('city') || '',
        label: searchParams.get('city') || '',
        latlng: {
          // @ts-ignore
          lat: parseFloat(searchParams.get('lat')),
          // @ts-ignore
          lng: parseFloat(searchParams.get('lng')),
        },
      });
    } else {
      setSelectedPoint(null);
    }
  }, [cities]);

  useEffect(() => {
    if (error) enqueueCSnackbar(t(error), { variant: 'error' });
    dispatch(actions.actions.genericError({ error: '' }));
  }, [error]);

  const PLUGIN_OPTIONS: PluginOptions = {
    cropImageByInnerWH: true, // crop blank opacity from image borders
    hidden: true, // hide screen icon
    domtoimageOptions: {
      cacheBust: true,
    }, // see options for dom-to-image
    position: 'topleft', // position of take screen icon
    screenName: `${findValueName('variable', 'variables')}`, // string or function
    // iconUrl: ICON_SVG_BASE64, // screen btn icon base64 or url
    hideElementsWithSelectors: [
      // '.leaflet-control-legend',
      '.leaflet-control',
      '.leaflet-control-search',
      '.leaflet-control-zoom',
      '.leaflet-control-coordinates',
      '.leaflet-bar-timecontrol',
      '.leaflet-control-layers',
    ], // by default hide map controls All els must be child of _map._container
    mimeType: 'image/jpeg', // used if format == image,
    caption: `${findValueName('variable', 'variables')}
- ${joinNames([
      findValueName('forecast_model', 'forecast_models'),
      findValueName('scenario', 'scenarios'),
    ])}
- ${joinNames([
      findValueName('data_series', 'data_series'),
      findValueName('value_type', 'value_types'),
      findValueName('time_window', 'time_windows'),
    ])}
- ${findValueName('year_period', 'year_periods')}
      `, // streeng or function, added caption to bottom of screen
    captionFontSize: 15,
    captionFont: 'Arial',
    captionColor: theme.palette.success.contrastText,
    captionBgColor: theme.palette.success.dark,
    captionOffset: 5,
  };

  const handleDownloadMapImg = () => {
    const format = 'image';
    let year = '';
    try {
      // @ts-ignore
      year = selected_map.data_series === 'yes' ? (new Date(mapRef.current?.timeDimension?.getCurrentTime())).getFullYear() : '';
    } catch (e) {
      // console.log('no year');
    }

    setInProgress(true);
    mapScreen
      .takeScreen(format, {
        captionFontSize: isMobile ? 10 : 12,
        screenName: `${findValueName('variable', 'variables')}`,
        caption: `${isMobile ? selected_map.variable : findValueName('variable', 'variables')}
- ${joinNames([
          findValueName('forecast_model', 'forecast_models'),
          findValueName('scenario', 'scenarios'),
        ])}
- ${joinNames([
          findValueName('data_series', 'data_series'),
          findValueName('value_type', 'value_types'),
          findValueName('time_window', 'time_windows'),
        ])}
- ${findValueName('year_period', 'year_periods')}
${year ? ` - Anno ${year}` : ''}   © ARPA Veneto
      `, // streeng or function, added caption to bottom of screen
      })
      .then(blob => {
        setInProgress(false);
        saveAs(blob as Blob, 'ppcv-map.jpg');
      })
      .catch(e => {
        setInProgress(false);
        console.error(e);
      });
  };

  const openCharts = (latLng: LatLng) => {
    coordRef.current = latLng;
    setTSOpen(true);
  };

  const setPoint = (props: any) => {
    // console.log('==================== setPoint ====================');
    // console.log(props);
    setSelectedPoint(props);
    // console.log('setPoint', props);
  };

  return (
        <Box sx={mapStyle}>
          <HeaderBar />
          <MapMenuBar onDownloadMapImg={handleDownloadMapImg} />
          {!loading && (
            <Map
              onReady={handleMapReady}
              openCharts={openCharts}
              setPoint={setPoint}
              selectedPoint={selectedPoint}
            />
          )}
          {loading && (
            <Box sx={MapLoadingContainerStyle}>
              <CircularProgress size={80} />
            </Box>
          )}
          <TimeSeriesDialog
            selectedPoint={selectedPoint}
            open={tSOpen}
            setOpen={setTSOpen}
          />

          {/*TODO Backdrop only for debug?*/}
          <Backdrop
            sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
            open={inProgress}
          >
            <CircularProgress color="inherit" size={80} />
          </Backdrop>
        </Box>
  );
}
