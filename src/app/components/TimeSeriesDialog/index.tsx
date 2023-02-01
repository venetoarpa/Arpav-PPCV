import React, {useEffect, useRef, useState} from 'react';
import { Modal } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {LatLng} from "leaflet";
import {
  TSContainerStyle,
  TSModalStyle
} from "./styles";
import TSDataContainer from "./TSDataContainer";
import {iCityItem} from "../../pages/MapPage/slice/types";
import {DownloadForm} from "./DownloadForm";
import { selectMap } from '../../pages/MapPage/slice/selectors';
import {useSelector} from "react-redux";

export interface TimeSeriesDialogProps {
  selectedPoint: iCityItem | null;
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface TimeRangeProps {
  start: string,
  end: string,
}

const TimeSeriesDialog = (props: TimeSeriesDialogProps) => {
  const {open = false, setOpen, selectedPoint} = props;
  const latLng = selectedPoint ? new LatLng(selectedPoint.latlng.lat, selectedPoint.latlng.lng) : null;
  const { timeserie } = useSelector(selectMap);

  const ids = useRef<number[]>([]);
  const timeRange = useRef<TimeRangeProps|null>();
  // console.log(timeRange);
  const setIds = (newIds) => ids.current = newIds;
  const setTimeRange = (tr) => {
    timeRange.current = tr;
  };
  useEffect(() => {
    if(timeserie.length === 0) return;
    const ts = timeserie[0].values;
    const tr = {start:ts[0].time, end:ts[ts.length-1].time};
    setTimeRange(tr)
  }, [timeserie]);

  return (
    <Modal
      open={open}
      sx={TSModalStyle}
    >
      <Grid
        container
        rowSpacing={0}
        columnSpacing={{ xs: 0 }}
        columns={{ xs: 24, def: 24 }}
        sx={TSContainerStyle}
      >
        <Grid xs={1}/>
        <Grid xs={22}>
          {latLng && (<TSDataContainer latLng={latLng} setIds={setIds} setTimeRange={setTimeRange}/>)}
        </Grid>
        <DownloadForm
          setOpen={setOpen}
          latLng={latLng}
          ids={ids}
          timeRange={timeRange}
          />
      </Grid>
    </Modal>
  );
};

export default TimeSeriesDialog;
