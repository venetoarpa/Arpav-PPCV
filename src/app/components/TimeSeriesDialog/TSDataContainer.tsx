import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { LatLng } from 'leaflet';
import {
  TSDataContainerStyle,
  FieldContainerStyle,
  RowContainerStyle,
  ChartContainerStyle,
  ChartLoaderContainerStyle,
} from './styles';
import { selectMap } from '../../pages/MapPage/slice/selectors';
import {
  caculateMovingAverage,
  getItemByFilters,
  roundTo4,
} from '../../../utils/json_manipulations';
import { full_find_keys, useMapSlice } from '../../pages/MapPage/slice';
import { RequestApi } from '../../Services';
import { formatYear } from '../../../utils/dates';
// import { saveAs } from 'file-saver';

export interface TSDataContainerProps {
  latLng: LatLng | any;
  place?: string | null;
  setIds: Function;
  setTimeRange: Function;
}

//TODO
// findValueName duplicated from src/app/components/DownloadDataDialog/mapDlData.tsx: put in utils ?
//    findValueName is similar to the one used in MapBar ?
// Use i18 for fields;

const TSDataContainer = (props: TSDataContainerProps) => {
  const { latLng, setIds, setTimeRange, place = '' } = props;
  const api = RequestApi.getInstance();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('def'));
  const [movingAvg, setMovingAvg] = useState(true);
  const chartRef = React.useRef<any>(null);

  const dispatch = useDispatch();
  const actions = useMapSlice();

  const findValueName = (key: string, listKey: string) => {
    const id = selected_map[key];
    let name = '';
    if (id)
      name = forecast_parameters[listKey]?.find(item => item.id === id)?.name;
    return name ?? '';
  };

  const findParamName = (key: string, listKey: string) => {
    return (
      forecast_parameters[listKey]?.find(item => item.id === key)?.name || ''
    );
  };

  const {
    selected_map,
    layers,
    forecast_parameters,
    selectactable_parameters,
    timeserie,
  } = useSelector(selectMap);
  const { scenarios, forecast_models } = selectactable_parameters;
  const [models, setModel] = React.useState<string[]>([
    selected_map.forecast_model,
    selected_map.forecast_model.includes('ens')
      ? null
      : forecast_models.find(x => x.includes('ens')),
  ]);
  const [timeseries, setTimeseries] = useState<any>([]);
  const joinNames = (names: string[]) => names.filter(name => name).join(' - ');
  const colors = [
    {
      Rcp26: 'rgb(46,105,193)',
      Rcp45: 'rgb(243, 156, 18)',
      Rcp85: 'rgb(231,60,60)',
    },
    {
      Rcp26: 'rgba(46,105,193, 0.4)',
      Rcp45: 'rgba(243, 156, 18, 0.4)',
      Rcp85: 'rgba(231,60,60, 0.4)',
    },
  ];

  useEffect(() => {
    setTimeseries([]);
    const baseSelection = Object.fromEntries(
      Object.entries(selected_map).filter(([key]) =>
        full_find_keys.includes(key),
      ),
    );
    // console.log(baseSelection)
    const ids = models
      .filter(x => x)
      .map(model => {
        return scenarios.map(scenario => {
          const input = {
            ...baseSelection,
            forecast_model: model,
            scenario,
          };
          const resItem = getItemByFilters(layers, input);
          // @ts-ignore
          return resItem ? resItem?.id : null;
        });
      })
      .flat();
    setIds(ids);
    api
      .getTimeseries(ids, latLng.lat, latLng.lng)
      .then(res => {
        //@ts-ignore
        setTimeseries(res.results);
      })
      .catch(err => {
        console.log(err);
        dispatch(actions.actions.genericError({ error: 'app.error.dlTimeSeries' }),);
      });
  }, [selected_map, selectactable_parameters, models]);

  const { t } = useTranslation();

  const getLegend = () => {
    //TODO names lookup
    const legend = timeseries?.map(
      item => `${findParamName(item.dataset.scenario_id, 'scenarios')} - ${findParamName(item.dataset.forecast_model_id, 'forecast_models')}`,
    );
    return legend;
  };

  const getColor = dataset => {
    const modelColor =
      dataset.forecast_model === models[0] ? colors[0] : colors[1];
    return modelColor[dataset.scenario];
  };
  const getLineType = dataset => {
    return 'solid';
    return dataset.forecast_model === models[0] ? 'solid' : 'dashed';
  };
  const getLineOpacity = dataset => {
    return 1;
    return dataset.forecast_model === models[0] ? 1 : 0.8;
  };

  const getChartData = item => {
    if (!movingAvg) {
      return item.values.map(val => [val.time.substring(0, 4), val.value]);
    } else {
      const window = 11;
      const values = item.values.map(val => val.value);
      const movingAvgValues = caculateMovingAverage(values, window);
      return item.values.map((val, index) => [
        val.time.substring(0, 4),
        window >= index ? movingAvgValues[0] : movingAvgValues[index - window],
      ]);
    }
  };

  const seriesObj = timeseries?.map(item => ({
    name: `${findParamName(item.dataset.scenario_id, 'scenarios')} - ${findParamName(item.dataset.forecast_model_id, 'forecast_models')}`,
    type: 'line',
    smooth: true,
    // sampling: 'average',
    symbol: 'none',
    lineStyle: {
      color: getColor(item.dataset),
      type: getLineType(item.dataset),
      opacity: getLineOpacity(item.dataset),
    },
    data: getChartData(item),
  }));

  const titleText = `
     ${findValueName(
    'variable',
    'variables',
  )}
  `;

  const subText = `
    ${findValueName('value_type', 'value_types')}  -  ${findValueName(
    'year_period',
    'year_periods',
  )}  -  ${t('app.map.timeSeriesDialog.from')} ${formatYear(
    selected_map.time_start,
  )} ${t('app.map.timeSeriesDialog.to')} ${formatYear(
    selected_map.time_end,
  )} - ${place ? place+' - ' : ''}${t('app.map.timeSeriesDialog.lat')} ${roundTo4(latLng.lat)} ${t(
    'app.map.timeSeriesDialog.lng',
  )} ${roundTo4(latLng.lng)}     © ARPAV - Arpa FVG
  Si tratta di proiezioni climatiche e non di previsioni a lungo termine. Il valore annuale ha validità in un contesto di trend trentennale.`;

  const photoCameraIconPath =
    'path://M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z';

  const chartOption = {
    title: {
      text: titleText,
      subtext: subText,
      textStyle: isMobile ? {width: 300, overflow: 'break'} : {},
      subtextStyle: isMobile ? {width: 300, overflow: 'break'} : {},
      itemGap: -22,
      top: '5%',
      left: 'center',
    },
    color: seriesObj.map(x => x.lineStyle.color),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true,
          formatter: (v) => `${t('app.map.timeSeriesDialog.xUnit')} ${v.value !== null ? roundTo4(v.value, 1) : '-'}`,
        },
      },
      valueFormatter: (v) => `${v !== null ? roundTo4(v, 1) : '-'} ${timeseries[0]?.dataset?.unit}`,
    },
    legend: {
      data: getLegend(),
      top: '30%',
      icon: 'rect',
    },
    grid: {
      top: '48%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      itemSize: 30,
      left: isMobile ? 'center' : 'right',
      feature: {
        saveAsImage: {
          name: `Serie temporale ${findValueName('variable', 'variables')} - ${joinNames([
          findValueName('forecast_model', 'forecast_models'),
          // findValueName('scenario', 'scenarios'),
        ])} - ${joinNames([
          findValueName('data_series', 'data_series'),
          findValueName('value_type', 'value_types'),
          findValueName('time_window', 'time_windows'),
        ])} - ${findValueName('year_period', 'year_periods')}`,
          title: t('app.map.timeSeriesDialog.saveAsImage'),
          icon: photoCameraIconPath,
          iconStyle: {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        showMinLabel: false,
        rotate: 45,
        margin: 0,
        padding: 10,
        align: 'right',
        verticalAlign: 'top',
      },
      splitNumber: 10,
      name: t('app.map.timeSeriesDialog.xUnit'),
      nameLocation: isMobile ? 'middle' : 'end',
      nameGap: isMobile ? -15 : 15,
    },
    yAxis: {
      type: 'value',
      scale: true,
      name: timeseries[0]?.dataset?.unit ?? '',
      nameTextStyle: {
        align: 'center',
        padding: 15,
      },
    },
    dataZoom: [
      {
        type: 'slider',
        height: 40,
      },
      {
        type: 'inside',
      },
    ],
    series: seriesObj,
  };

  const getMapsToDownloads = () => {
    const allIds = Object.entries(
      chartRef.current.getEchartsInstance().getOption().legend[0].selected,
    )
      .filter(x => !x[1])
      .map(x => x[0]);
    setIds(
      timeseries
        .filter(
          x =>
            !allIds.includes(
              `${findParamName(x.dataset.scenario_id, 'scenarios')} - ${findParamName(x.dataset.forecast_model_id, 'forecast_models')}`
            ),
        )
        .map(x => x.dataset.id),
    );
  };

  const dataZoomHandle = (params, chart) => {
    const {startValue, endValue} = chart.getOption().dataZoom[0];
    const range = {
      start: timeserie[0].values[startValue].time,
      end: timeserie[0].values[endValue-1].time
    };
    // console.log(startValue, endValue, range)
    setTimeRange(range);
  }

  return (
    <Box sx={TSDataContainerStyle}>
      <Box sx={RowContainerStyle}>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="SelectedModel">
              {t('app.map.timeSeriesDialog.selectedModel')}
            </InputLabel>
            <Select
              labelId="SelectedModel"
              id="SelectedModel"
              value={models[0]}
              label={t('app.map.timeSeriesDialog.selectedModel')}
              onChange={e => setModel([e.target.value as string, models[1]])}
            >
              {forecast_models.map(m => (
                <MenuItem value={m} disabled={m === models[1]}>
                  {findParamName(m, 'forecast_models')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="SelectedModel">
              {t('app.map.timeSeriesDialog.comparisonModel')}
            </InputLabel>
            <Select
              labelId="SelectedModel"
              id="SelectedModel"
              value={models[1]}
              label={t('app.map.timeSeriesDialog.comparisonModel')}
              onChange={e => setModel([models[0], e.target.value as string])}
            >
              {forecast_models.map(m => (
                <MenuItem key={m} value={m} disabled={m === models[0]}>
                  {findParamName(m, 'forecast_models')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={FieldContainerStyle}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <FormControlLabel
              control={
                <Switch
                  checked={movingAvg}
                  onChange={e => setMovingAvg(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={t('app.map.timeSeriesDialog.movingAverage')}
            />
          </FormControl>
        </Box>
      </Box>
      {timeseries?.length > 0 ? (
        <Box sx={ChartContainerStyle}>
          <ReactECharts
            ref={chartRef}
            option={chartOption}
            // style={{
            //   // minHeight: '70vh'
            //   minHeight: '550px'
            // }}
            onEvents={{
              // 'click': (A, B, C) => {console.log('click', A, B, C)},
              legendselectchanged: getMapsToDownloads,
              dataZoom: dataZoomHandle,
            }}
          />
        </Box>
      ) : (
        <Box sx={ChartLoaderContainerStyle}>
          <CircularProgress size={80} />
        </Box>
      )}
    </Box>
  );
};

export default TSDataContainer;
