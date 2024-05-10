import { Http } from '../Http';

export interface AuthResponse {
  [key: string]: {};
}

export interface ListResults<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface iNetcdfDownload {
  id: number;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  public?: number;
  reason?: string;
  other_reason?: string;
  place?: string;
  membership?: string;
  accept_disclaimer?: boolean;
}

export class RequestApi extends Http {
  protected static classInstance?: RequestApi;
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new RequestApi();
    }
    return this.classInstance;
  }

  public getLayers = () => this.instance.get<any>('/maps/maps/');

  public getCities = () => this.instance.get<any>('/places/cities/');

  public getTimeserie = (
    id: number | null,
    lat: number = 45.5,
    lng: number = 11,
  ) =>
    this.instance.get<any>(
      `/maps/ncss/timeserie/?id=${id}&latitude=${lat}&longitude=${lng}`,
    );

  // public getTimeserie = (id:number|null, lat:number = 45.5, lng:number = 11) => this.instance.get<any>(`/maps/timeserie/?id=${id}&latitude=${lat}&longitude=${lng}`);

  public getTimeseries = (
    ids: Array<number>,
    lat: number = 45.5,
    lng: number = 11,
  ) =>
    this.instance.get<any>(
      `/maps/ncss/timeserie/?ids=${ids.join(',')}&latitude=${lat.toFixed(
        4,
      )}&longitude=${lng.toFixed(4)}`,
    );

  public downloadTimeseries = params =>
    this.instance.post<any>(`/maps/ncss/timeserie/`, params, {
      responseType: 'blob',
    });

  public getNetcdf = (params: iNetcdfDownload) =>
    this.instance.post<any>(`/maps/ncss/netcdf/`, params, {
      responseType: 'blob',
    });

  // public getNetcdf = (params) => {
  //   return this.instance.get<any>(`/maps/ncss/netcdf/?${(new URLSearchParams(params)).toString()}`, {responseType: 'blob'});
  // }

  public getForecastAttribute = (attribute, params = {}) => {
    return this.instance.get<any>(`/forcastattributes/${attribute}/`, {
      params,
    });
  };
}
