# Piattaforma Proiezioni Climatiche per il Nord-Est

[![Piattaforma Proiezioni Climatiche per il Nord-Est](https://github.com/inkode-it/Arpav-PPCV/raw/main/public/img/screenshot.png)](https://clima.arpa.veneto.it/)

This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
<br/><a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>

Developed by  [INKODE soc coop](https://inkode.it)
<br/>
<a href="https://inkode.it"><img src="https://github.com/inkode-it/Arpav-PPCV/raw/main/public/img/logo-inkode.png" alt="inkode logo"></a>

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


