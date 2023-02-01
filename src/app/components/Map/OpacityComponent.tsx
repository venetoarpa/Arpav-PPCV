import React, {useEffect, useState} from "react";
import {useLeafletContext} from "@react-leaflet/core";
import {Box, Slider, Stack, Typography} from "@mui/material";
import OpacityIcon from '@mui/icons-material/Opacity';
import {useDispatch, useSelector} from "react-redux";
import {Filters, MapState} from "../../pages/MapPage/slice/types";
import {useMapSlice} from "../../pages/MapPage/slice";
export const OpacityComponent = () => {
  const context = useLeafletContext()
  const dispatch = useDispatch();
  const actions = useMapSlice();
  //@ts-ignore
  const {opacity} = useSelector((state) => state?.map as MapState);

  useEffect(() => {
    // @ts-ignore
        Object.keys(context.map._layers).map((layer: any) => {
          // @ts-ignore
          layer = context.map._layers[layer];
          if (layer._url && layer._url.includes(`/thredds/wms/`)) {
            layer.setOpacity(opacity);
          }
        });
  }, [opacity]);

  return (<Box sx={{ width: 120 }}>
      <Stack spacing={2} direction="row" alignItems="center">
          <OpacityIcon color="secondary"/>
          <Slider size="small"
              color="secondary"
              aria-label="Opacità"
              value={opacity}
              // @ts-ignore
              onChangeCommitted={(e, v) => dispatch(actions.actions.setOpacity(parseFloat(v)))}
              step={0.05}
              // marks
              min={0}
              max={1}
          />
      </Stack>
  </Box>);
}