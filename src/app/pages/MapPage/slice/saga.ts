// import { take, call, put, select, takeLatest } from 'redux-saga/effects';
// import { mapActions as actions } from '.';

// function* doSomething() {}

import { call, delay, put, select, all, takeLatest } from 'redux-saga/effects';
import { mapActions as actions } from '.';
// import {RepoErrorType} from "../../HomePage/Features/GithubRepoForm/slice/types";
import { attributesList } from './index';
import { RequestApi } from '../../../Services';

export function* getAttributes() {
  const api = RequestApi.getInstance();
  try {
    const requests = (yield all(
      attributesList.map(attribute => {
        return call(api.getForecastAttribute, attribute);
      }),
    )).map(attribute => {
      // console.log(attribute);
      return attribute.results;
    });
    yield put(actions.parametersLoaded(requests));
  } catch (err: any) {
    console.log(err);
    yield put(actions.genericError({ error: 'app.error.dlParameters' }));
  }
}

export function* getLayers() {
  const api = RequestApi.getInstance();
  try {
    const layers = yield call(api.getLayers);
    yield put(actions.layerLoaded(layers.results));
  } catch (err: any) {
    console.log(err);
    yield put(actions.genericError({ error: 'app.error.dlParameters' }));
  }
}

export function* getCities() {
  const api = RequestApi.getInstance();
  try {
    const cities = yield call(api.getCities);
    yield put(actions.citiesLoaded(cities.results));
  } catch (err: any) {
    console.log(err);
    yield put(actions.genericError({ error: 'app.error.dlCities' }));
  }
}

export function* requestTimeserie(action) {
  // console.log({action})
  const { id, lat, lng } = action.payload;
  const api = RequestApi.getInstance();
  try {
    const timeserie = yield call(api.getTimeserie, id, lat, lng);
    // console.log(timeserie.results)
    yield put(actions.setTimeserie(timeserie.results));
  } catch (err: any) {
    console.log(err);
    yield put(actions.genericError({ error: 'app.error.dlTimeSeries' }));
  }
}

export function* mapSaga() {
  yield takeLatest(actions.loadParameters.type, getAttributes);
  yield takeLatest(actions.loadLayers.type, getLayers);
  yield takeLatest(actions.loadCities.type, getCities);
  yield takeLatest(actions.requestTimeserie.type, requestTimeserie);
}
