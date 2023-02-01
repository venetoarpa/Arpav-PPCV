import 'leaflet-timedimension';
import L from 'leaflet';
// import moment from 'moment';
// @ts-ignore
L.Control.TimeDimension = L.Control.TimeDimension.extend({
  _getDisplayDateFormat: function (date) {
    // @ts-ignore
    return date.getFullYear();
    // return moment(date).format('DD MM YYYY');
  },
});
