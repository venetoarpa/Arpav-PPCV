import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  Box,
  Toolbar,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SnowIcon from '@mui/icons-material/AcUnit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';

import { MultiRadioSelect } from '../MultiRadioSelect';

import {
  FirstRowStyle,
  GridContainerStyle,
  LeftSpaceStyle,
  MapMenuBarStyle,
  SecondRowStyle,
  SelectStyle,
  LeftSelectStyle,
  SelectMenuStyle,
  ButtonBoxStyle,
  MenuLabelStyle, MenuFormControlStyle,
} from './styles';
import { MapState } from '../../pages/MapPage/slice/types';
import DownloadDataDialog from '../DownloadDataDialog';
import { useEffect, useState } from 'react';
import { useMapSlice } from '../../pages/MapPage/slice';
import { MenuSelectionMobileStyle } from './styles';
import SnowSunIcon from "../../icons/SnowSunIcon";

export interface MapMenuBar {
  onDownloadMapImg?: Function;
}

export function MapMenuBar(props: MapMenuBar) {
  const onDownloadMapImg = props.onDownloadMapImg ?? (() => {});
  const {
    selected_map,
    forecast_parameters,
    selectactable_parameters,
    timeserie,
    // @ts-ignore
  } = useSelector(state => state?.map as MapState);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const actions = useMapSlice();

  const mapParameters = (mapKey, parameterListKey) => {
    const items = forecast_parameters[parameterListKey].map(item => {
      return {
        ...item,
        disabled:
          !(Array.isArray(selectactable_parameters[parameterListKey]) &&
          selectactable_parameters[parameterListKey].includes(item?.id)),
        selected: selected_map[mapKey] === item.id,
      };
    });
    const needsSelection = selected_map[mapKey]==null && items.filter(x => x.disabled === false).length > 0;
    return { items, needsSelection };
  };

  const setItemMenus = () => ({
    variableMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'variable',
            groupName: '',
            ...(mapParameters('variable', 'variables')),
          },
        ],
      },
    ],
    modelAndScenarioMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'forecast_model',
            groupName: t('app.map.menu.models'),
            ...(mapParameters('forecast_model', 'forecast_models')),
          },
        ],
      },
      {
        rows: [
          {
            key: 'scenario',
            groupName: t('app.map.menu.scenarios'),
            ...(mapParameters('scenario', 'scenarios')),
          },
        ],
      },
    ],
    periodMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'data_series',
            groupName: t('app.map.menu.dataSeries'),
            ...(mapParameters('data_series', 'data_series')),
          },
          {
            key: 'value_type',
            groupName: t('app.map.menu.valueTypes'),
            ...(mapParameters('value_type', 'value_types')),
          },
          {
            key: 'time_window',
            groupName: t('app.map.menu.timeWindows'),
            ...(mapParameters('time_window', 'time_windows')),
          },
        ],
      },
    ],
    seasonMenuSet: [
      // COLUMNS:
      {
        rows: [
          {
            key: 'year_period',
            groupName: '',
            ...(mapParameters('year_period', 'year_periods')),
          },
        ],
      },
    ],
  });

  const [menus, setMenus] = useState(setItemMenus());

  useEffect(() => {
    // console.log('PASSO')
    setMenus(setItemMenus());
  }, [forecast_parameters, selectactable_parameters, selected_map]);

  // const [selectedValues, setSelectedValues] = React.useState<IGrpItm[][] | []>(
  //   [],
  // );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));

  // const actualState = useSelector(state => state);
  //@ts-ignore
  // const forecastParams = actualState?.map?.forecast_parameters;

  const [isDownloadDataOpen, setDownloadDataOpen] =
    React.useState<boolean>(false);

  /* ********************************************************************************************************** */
  // MENU 0

  /* ********************************************************************************************************** */

  // const handleChange = (menuIdx: number, groupSelection: IGrpItm[]) => {
  const handleChange = (key: string, value: string) => {
    // console.log("ciao2", key, value)
    dispatch(actions.actions.changeSelection({ key, value }));
    // const selTmp = [...selectedValues];
    // selTmp[menuIdx] = groupSelection;
    // setSelectedValues(selTmp);
  };

  const findValueName = (key: string, listKey: string) => {
    const id = selected_map[key];
    let name = '';
    if (id)
      name = forecast_parameters[listKey]?.find(item => item.id === id)?.name;
    return name ?? '';
  };

  const selectedValuesToString = () => {
    const keys = [
      ['variable', 'variables'],
      ['forecast_model', 'forecast_models'],
      ['scenario', 'scenarios'],
      ['data_series', 'data_series'],
      ['value_type', 'value_types'],
      ['time_window', 'time_windows'],
      ['year_period', 'year_periods'],
    ];

    const values = keys.map(key => findValueName(key[0], key[1]));
    const label = values.filter(valSet => valSet).join(', ');

    return label;
  };

  const hasMissingValues = (items) => {
    return items.filter(h => h.rows.filter(x=>x.needsSelection).length > 0).length > 0;
  }

  return (
    <FormControl sx={MenuFormControlStyle}>
      <Toolbar disableGutters sx={MapMenuBarStyle}>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={{ xs: 0 }}
          columns={{ xs: 6, def: 10 }}
          sx={GridContainerStyle}
        >
          {isMobile ? (
            <></>
          ) : (
            <>
              <Grid xs={2} sx={FirstRowStyle}>
                <Box sx={LeftSpaceStyle}>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.indicator')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={2} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.model')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={2} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.period')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={2} sx={FirstRowStyle}>
                <Box>
                  <Typography sx={MenuLabelStyle}>
                    {t('app.map.menuBar.season')}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={1} sx={FirstRowStyle}>
                <Box></Box>
              </Grid>
              <Grid xs={1} sx={FirstRowStyle}>
                <Box></Box>
              </Grid>
            </>
          )}
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.variableMenuSet}
              // value={selectedValues[0]}
              onChange={handleChange}
              sx={LeftSelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<ThermostatIcon />}
              className={hasMissingValues(menus.variableMenuSet) ? 'NeedsSelection' : ''}
              label={t('app.map.menuBar.indicator')}
            />
          </Grid>
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.modelAndScenarioMenuSet}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<ShowChartIcon />}
              className={hasMissingValues(menus.modelAndScenarioMenuSet) ? 'NeedsSelection' : ''}
              // label={'Model and Scenario'}
              label={t('app.map.menuBar.model')}
            />
          </Grid>
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.periodMenuSet}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<DateRangeIcon />}
              className={hasMissingValues(menus.periodMenuSet) ? 'NeedsSelection' : ''}
              // label={'Period'}
              label={t('app.map.menuBar.period')}
            />
          </Grid>
          <Grid xs={1} def={2} sx={SecondRowStyle}>
            <MultiRadioSelect
              valueSet={menus.seasonMenuSet}
              onChange={handleChange}
              sx={SelectStyle}
              menuSx={SelectMenuStyle}
              mobileIcon={<SnowSunIcon />}
              className={hasMissingValues(menus.seasonMenuSet) ? 'NeedsSelection' : ''}
              label={t('app.map.menuBar.season')}
              // label={'Season'}
            />
          </Grid>
          <Grid xs={1} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              {isMobile ? (
                <IconButton
                  onClick={() => setDownloadDataOpen(true)}
                  disabled={timeserie.length == 0}
                >
                  <FileDownloadIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<FileDownloadIcon />}
                  onClick={() => setDownloadDataOpen(true)}
                  disabled={timeserie.length == 0}
                >
                  {t('app.map.menuBar.downloadData')}
                </Button>
              )}
              <DownloadDataDialog
                open={isDownloadDataOpen}
                setOpen={setDownloadDataOpen}
              />
            </Box>
          </Grid>
          <Grid xs={1} sx={SecondRowStyle}>
            <Box sx={ButtonBoxStyle}>
              {isMobile ? (
                <IconButton onClick={() => onDownloadMapImg()}>
                  <PhotoCameraIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => onDownloadMapImg()}
                >
                  {t('app.map.menuBar.downloadMap')}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
      {isMobile && (
        <Toolbar sx={MenuSelectionMobileStyle}>
          <Typography variant={'caption'}>
            {selectedValuesToString()}
          </Typography>
        </Toolbar>
      )}
    </FormControl>
  );
}

export default MapMenuBar;
