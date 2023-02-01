# PPCV Piattaforma Proiezioni Climatiche per il Veneto


## Installa & Inizia

Questo progetto utilizza [Yarn Package Manager](https://yarnpkg.com) .

Installa le dipendenze

```shell
yarn install
```

Prima di lanciare l'applicazione copia il contenuto del file `.env.example` nel file `.env`.

Lancia l'applicazione

```shell
yarn start
```

Apri il browser e nella barra degli indirizzi inserisci il seguente URL
```
http://localhost:3000
```

## Dipendenze

- [React](https://reactjs.org/): L'intero progetto è basato su React;
- [Redux](https://redux.js.org/): Per la gestione dello state;
- [Redux-Saga](https://redux-saga.js.org/): Side effects manager;
- [Material UI](https://mui.com/material-ui/getting-started/overview/): È il design system;
- [Leaflet](https://leafletjs.com/): È la libreria utilizzata per la visualizzazione della mappa;
- [ECharts](https://echarts.apache.org/): È usata per visualizzare il grafico delle serie temporali.

## Struttura del progetto

- `src/app/index.tsx`: È l'entry point dell'applicazione;
- `src/app/pages/MapPage/index.tsx`: È il container principale e vine renderizzato sull'intera applicazione;
- `src/app/pages`: Le pagine dell'applicazione;
- `src/app/components`: I componenti React;
- `src/app/Services/API`: Sono le Web API utilizzate per comunicare con il server e altri servizi come Thredds;
- `src/app/utils/theme.ts`: Il tema personalizzato per Material UI.
- `src/locales/it/translation.json`: Dizionario dei termini in Italiano;
- `src/app/pages/MapPage/slice`: Gestione di Redux e Redux-Saga;
- `src/utils`: Funzioni di utilità.