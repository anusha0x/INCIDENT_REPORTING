import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const incidents = [
    { id: 1, type: "🔥 Fire", loc: [23.2599, 77.4126], desc: "Building A - Floor 3" },
    { id: 2, type: "🚑 Medical", loc: [23.2650, 77.4200], desc: "Road Accident" }
  ];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header"><h2>Rakshak Hub</h2></div>
        {incidents.map(inc => (
          <div key={inc.id} className="incident-card">
            <h4>{inc.type}</h4>
            <p>{inc.desc}</p>
            <button style={{width:'100%', marginTop:'10px', background:'#3b82f6', color:'white', border:'none', borderRadius:'5px', padding:'5px'}}>Dispatch</button>
          </div>
        ))}
      </div>
      <div className="map-area">
        <MapContainer center={[23.2599, 77.4126]} zoom={14} style={{height:'100%'}}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {incidents.map(inc => <Marker key={inc.id} position={inc.loc}><Popup>{inc.type}</Popup></Marker>)}
        </MapContainer>
      </div>
    </div>
  );
};
export default Dashboard;