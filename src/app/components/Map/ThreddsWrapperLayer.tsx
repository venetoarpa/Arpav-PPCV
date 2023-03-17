import L, {TileLayer} from "leaflet";
import {useMap, useMapEvent} from "react-leaflet";
import {WMS_PROXY_URL} from "../../../utils/constants";
import {useSelector} from "react-redux";
import {useLeafletContext, withPane} from '@react-leaflet/core'
import {useEffect, useRef} from 'react'
import 'leaflet-timedimension';
import './timedimension.extended';
import 'leaflet/dist/leaflet.css';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css';


export const ThreddsWrapperLayer = (props: any) => {
  const {selected_map} = useSelector((state: any) => state.map);
  const context = useLeafletContext()
  const layer = useRef<any>(null);
  const setLayer = (l: any) => {
    layer.current = l;
  }

  const getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')


  const setupFrontLayer = (layer, map, onlyRemove=false) => {
    if (layer && !onlyRemove) {
      layer.bringToFront();
    }
    try {
      // @ts-ignore
      Object.keys(map._layers).map((l: any) => {
        // @ts-ignore
        l = map._layers[l];
        if (l && l._url && l._url.includes(`public.places_cities.geometry`)) {
          l.bringToFront();
        }
        if (l && l._url
          && l._url.includes(`${WMS_PROXY_URL}/thredds/wms/`)
          // @ts-ignore
          && !l._url.includes(map.selected_path)
        ) {
          map.removeLayer(l);
        }
        if (l && l.currentLayer && l.currentLayer._url
          && l.currentLayer._url.includes(`${WMS_PROXY_URL}/thredds/wms/`)
          // @ts-ignore
          && !l.currentLayer._url.includes(map.selected_path)
        ) {
          l.currentLayer.hide();
          map.removeLayer(l);
        }
      });
    } catch (e) {
      console.log(e)
    }
  }

  useMapEvent('baselayerchange', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  useMapEvent('timeload', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  useMapEvent('timeloading', () => setupFrontLayer(layer.current, context.map));
  // @ts-ignore
  useMapEvent('layeradd', () => setupFrontLayer(layer.current, context.map, true));
  // @ts-ignore
  useMapEvent('layerremove', () => setupFrontLayer(layer.current, context.map, true));

  useEffect(() => {
    const map = context.map;
    // @ts-ignore
    if (!map.setupFrontLayer) map.setupFrontLayer = setupFrontLayer;
    // @ts-ignore
    map.selected_path = selected_map.path;
    if (selected_map.path) {
      // @ts-ignore
      if (layer.current && layer.current._currentLayer && layer.current._currentLayer._url && layer.current._currentLayer._url.includes(`${WMS_PROXY_URL}/thredds/wms/`) && layer.current._currentLayer._url.includes(selected_map.path)) {
        setupFrontLayer(layer.current, map);
        return;
      }
      let tdWmsLayer = null;
      const params = {
        layers: selected_map.layer_id,
        format: 'image/gif',
        numcolorbands: '100',
        version: '1.1.1',
        colorscalerange: `${selected_map.color_scale_min},${selected_map.color_scale_max}`,
        logscale: 'false',
        styles: `default-scalar/${selected_map.palette}`,
        // elevation: null,
        width: 256,
        transparent: true,
        crs: L.CRS.EPSG3857,
        bounds: selected_map.bbox,
      };
      const options = {
        opacity: 0.85,
        attribution: '&copy; <a target="_blank" rel="noopener" href="https://www.arpa.veneto.it/">ARPAV</a> ARPA Veneto'
      }
      // @ts-ignore
      const wmsLayer = new TileLayer.WMS(`${WMS_PROXY_URL}/thredds/wms/${selected_map.path}`, {...params, ...withPane(options, map),});
      if (selected_map.id && selected_map.data_series === 'yes') {
        // @ts-ignore
        tdWmsLayer = L.timeDimension.layer.wms(wmsLayer, {
          requestTimeFromCapabilities: true,
          cache: 0,
          cacheBackward: 0,
          cacheForward: 0,
          zIndex: 1000
        });
        if (tdWmsLayer) {
          map.addLayer(tdWmsLayer);
          // @ts-ignore
          setupFrontLayer(tdWmsLayer, context.map);
          setLayer(tdWmsLayer);
          try {
            // @ts-ignore
            map._controlContainer.getElementsByClassName("leaflet-bar-timecontrol")[0].style.display = 'flex';
          } catch (e) {
            // console.log(e)
          }
        }
      } else {
        map.addLayer(wmsLayer);
        setupFrontLayer(wmsLayer, context.map);
        setLayer(wmsLayer);
        try {
          // @ts-ignore
          map._controlContainer.getElementsByClassName("leaflet-bar-timecontrol")[0].style.display = 'none';
        } catch (e) {
          // console.log(e)
        }
      }
    }
  }, [selected_map.path]);

  return null;
}