/* --- STATE --- */
export interface iBaseParameterItem {
  id: string;
  name: string;
  description: string;
  disabled?: boolean;
}
export interface iLayerItem {
  id: number;

  variable: string;
  forecast_model: string;
  scenario: string;
  data_series: string;
  year_period: string;
  time_window: string;
  value_type: string;
  layer_id: string;
  elevation: number;
  color_scale_min: number;
  color_scale_max: number;

  time_start: string;
  time_end: string;
  time_interval: string;

  csr: string;
  path: string;
  palette: string;
  unit: string;
  bbox: [[number, number], [number, number]];
}
export interface iForecastParameters {
  variables: iBaseParameterItem[];
  forecast_models: iBaseParameterItem[];
  scenarios: iBaseParameterItem[];
  data_series: iBaseParameterItem[];
  year_periods: iBaseParameterItem[];
  time_windows: iBaseParameterItem[];
  value_types: iBaseParameterItem[];
}
export interface iSelectableParameters {
  variables: string[];
  forecast_models: string[];
  scenarios: string[];
  data_series: string[];
  year_periods: string[];
  time_windows: string[];
  value_types: string[];
}
export interface iCityItem {
  name: string;
  label?: string;
  id?: number;
  latlng: {
    lat: number;
    lng: number;
  };
}
export interface searchCityItem {
  name: string;
  lat?: number;
  lng?: number;
}
export interface MapState {
  selected_map: any;
  city: searchCityItem | null;
  layers: iLayerItem[];
  cities: iCityItem[];
  opacity: number;
  // selectactable_parameters: iForecastParameters;
  selectactable_parameters: iSelectableParameters;
  forecast_parameters: iForecastParameters;
  loading: boolean;
  error: any | null;
  timeserie: any[];
}

export interface Filters {
  variable: string;
  forecast_model: string;
  scenario: string;
  data_series: 'yes' | 'no';
  year_period: string;
  time_window: string | null;
  value_type: 'anomaly' | 'absolute';
}

export interface ChangeMapSelectionPatyload {
  key: string;
  value: string;
}

export interface SetMapIdPayload {
  id: Number;
}
