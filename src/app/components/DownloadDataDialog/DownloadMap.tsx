import {MapContainer, Pane, Rectangle, TileLayer} from "react-leaflet";
import {LatLngBounds} from "leaflet";

export const DownloadMap = ({mapBounds, downLoadBounds}) => {
  return (
    <MapContainer
      center={[45.9,12.45]}
      zoom={7}
      maxZoom={14}
      style={{ height: '320px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*<BlinkingPane/>*/}
      <Pane name="yellow-rectangle" style={{zIndex: 500}}>
        <Rectangle bounds={mapBounds} pathOptions={{color: 'grey'}}/>
        <Rectangle bounds={downLoadBounds} pathOptions={{color: 'yellow'}}/>
      </Pane>
    </MapContainer>
  );
}