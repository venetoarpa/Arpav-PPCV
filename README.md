# PPCV Piattaforma Proiezioni Climatiche per il Veneto


## Install & development

This project uses the [Yarn Package Manager](https://yarnpkg.com) .

Install dependencies

```shell
yarn install
```

Before launching the application, copy the contents of `.env.example` file to `.env` and edit Environment variables.

Launch application in development mode

```shell
yarn start
```

Open the browser and enter the following URL in the address bar

```
http://localhost:3000
```

## Dependencies

- [React](https://reactjs.org/): entire project is based on React;
- [Redux](https://redux.js.org/): for state management;
- [Redux-Saga](https://redux-saga.js.org/): Side effects manager;
- [Material UI](https://mui.com/material-ui/getting-started/overview/): design system;
- [Leaflet](https://leafletjs.com/): library used for map visualization;
- [ECharts](https://echarts.apache.org/): library used display the timeseries charts.

## Project Structure

- `src/app/index.tsx`: application's entry point;
- `src/app/pages/MapPage/index.tsx`: main container, it's rendered throughout the application;
- `src/app/pages`: Application pages;
- `src/app/components`: React components;
- `src/app/Services/API`: APIs consumers, based on `axios`, to communicate with the server and other services such as Thredds;
- `src/app/utils/theme.ts`: Material UI theme customizations.
- `src/locales/it/translation.json`: Italian terms dictionary;
- `src/app/pages/MapPage/slice`: Redux and Redux-Saga management;
- `src/utils`: Utility functions.

## Docker build command for production

```shell
docker build -t ppcv_frontend -f production.Dockerfile .
```
