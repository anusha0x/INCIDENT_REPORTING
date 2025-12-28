import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function MapRefresher({ coords }) {
  const map = useMap();
  useEffect(() => { map.setView(coords, 16); }, [coords, map]);
  return null;
}

const CitizenView = () => {
  const [position, setPosition] = useState([23.2599, 77.4126]);
  const [type, setType] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => setPosition([pos.coords.latitude, pos.coords.longitude]));
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer center={position} zoom={13} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Marker position={position} />
        <MapRefresher coords={position} />
      </MapContainer>

      <div className="action-card">
        <h2>Rakshak SOS</h2>
        <select className="styled-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select Emergency...</option>
          <option value="Fire">🔥 Fire</option>
          <option value="Medical">🚑 Medical</option>
          <option value="Crime">🚨 Crime</option>
        </select>
        <textarea className="styled-textarea" placeholder="Describe the situation..." rows="2" />
        <button className="sos-button" onClick={() => alert("SOS Sent!")}>SEND HELP</button>
      </div>
    </div>
  );
};
export default CitizenView;