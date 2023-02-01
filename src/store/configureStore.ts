import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReducer } from './reducers';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = createReducer();

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    middleware: defaultMiddleware => {
      return [...defaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }), ...middlewares]
    },
    // devTools: true,
    devTools:
      // /* istanbul ignore next line */
      process.env.NODE_ENV !== 'production' ||
      process.env.PUBLIC_URL.length > 0,
    enhancers,
  });

  let persistor = persistStore(store)
  return { store, persistor };
}
