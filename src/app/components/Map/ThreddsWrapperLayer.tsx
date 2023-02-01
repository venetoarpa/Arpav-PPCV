import L, {TileLayer} from "leaflet";
import {useMap, useMapEvent} from "react-leaflet";
import {WMS_PROXY_URL} from "../../../utils/constants";
import {useSelector} from "react-redux";
import {useLeafletContext, withPane} from '@react-leaflet/core'
import {useEffect, useState} from 'react'
import 'leaflet-timedimension';
import './timedimension.extended';
import 'leaflet/dist/leaflet.css';
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css';


export const ThreddsWrapperLayer = (props: any) => {
  const {selected_map} = useSelector((state: any) => state.map);
  const map = useMap();
  const context = useLeafletContext()
  const [layer, setLayer] = useState<any>(null);

  const setupFrontLayer = (layer) => {
    if(layer) {
      layer.bringToFront();
    }
    try {
      const map = layer?._map ? layer._map : context.layerContainer ?? context.map;
      Object.keys(map._layers).map((l: any) => {
        l = map._layers[l];
        if (l && l._url && l._url.includes(`public.places_cities.geometry`)) {
          // console.log('PASSO!!!', {l});
          l.bringToFront();
        }
      });
    } catch (e) {
      console.log(e)
    }
  }

  useMapEvent('baselayerchange', () => setupFrontLayer(layer));
  // useMapEvent('click', () => setupFrontLayer(layer));

  useEffect(() => {
    if (selected_map.path) {
      const container = context.layerContainer ?? context.map;
      let tdWmsLayer = null;
      const params = {
        layers: selected_map.layer_id,
        format: 'image/png',
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
        // attribution: '&copy; <a target="_blank" rel="noopener" href="https://www.arpa.veneto.it/">ARPAV</a> Agenzia regionale per la protezione ambientale del Veneto'
      }
      // @ts-ignore
      const wmsLayer = new TileLayer.WMS(`${WMS_PROXY_URL}/thredds/wms/${selected_map.path}`, {...params, ...withPane(options, context),});
      if (selected_map.id && selected_map.data_series === 'yes') {
        // @ts-ignore
        tdWmsLayer = L.timeDimension.layer.wms(wmsLayer);
        if (tdWmsLayer) {
          context.map.addLayer(tdWmsLayer);
          // @ts-ignore
          setupFrontLayer(tdWmsLayer);
          setLayer(tdWmsLayer);
          try {
            // @ts-ignore
            context.map._controlContainer.getElementsByClassName("leaflet-bar-timecontrol")[0].style.display = 'flex';
          } catch (e) {
            // console.log(e)
          }
        }
      } else {
        context.map.addLayer(wmsLayer);
        setupFrontLayer(wmsLayer);
        setLayer(wmsLayer);
        try {
          // @ts-ignore
          context.map._controlContainer.getElementsByClassName("leaflet-bar-timecontrol")[0].style.display = 'none';
        } catch (e) {
          // console.log(e)
        }
      }
      return () => {
        // @ts-ignore
        Object.keys(container._layers).map((layer: any) => {
          // @ts-ignore
          layer = container._layers[layer];
          if (layer._url && layer._url.includes(`${WMS_PROXY_URL}/thredds/wms/`)) {
            container.removeLayer(layer);
          }
        });
      }
    }
  }, [selected_map.path, map]);

  return null;
}