import 'leaflet-timedimension';
import L from 'leaflet';
// import moment from 'moment';
// @ts-ignore
L.Control.TimeDimension = L.Control.TimeDimension.extend({
  _getDisplayDateFormat: function (date) {
    Object.keys(this._map._layers).forEach(layerId => {
      let x = this._map._layers[layerId];
      if (x && x._url && x._url.includes('/thredds/wms/', '')) {
        if (!x._url.includes(this._map.selected_path)) this._map.removeLayer(x);
        else this._map.setupFrontLayer(x, this._map);
      }
    });
    // @ts-ignore
    return date.getFullYear();
  },
});
