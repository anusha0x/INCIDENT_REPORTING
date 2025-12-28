import React from 'react';
import "../App.css";
import { useEffect } from "react";

const incidents = [
  {
    id: 1,
    type: "Accident",
    lat: 26.2183,
    lng: 78.1828,
    location: "NH-44, Gwalior",
    status: "Reported",
  },
  {
    id: 2,
    type: "Medical",
    lat: 26.225,
    lng: 78.170,
    location: "City Center",
    status: "Responding",
  },
  {
    id: 3,
    type: "Fire",
    lat: 26.230,
    lng: 78.190,
    location: "Industrial Area",
    status: "Resolved",
  },
];

function Dashboard() {
  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 26.2183, lng: 78.1828 },
      zoom: 13,
    });

    incidents.forEach((incident) => {
      new window.google.maps.Marker({
        position: { lat: incident.lat, lng: incident.lng },
        map,
        title: `${incident.type} - ${incident.status}`,
      });
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>🚨 Responder Dashboard</h1>
      <p className="subtitle">Live reported incidents</p>

      <div className="dashboard-grid">
        {/* Incident List */}
        <div className="incident-list">
          {incidents.map((i) => (
            <div key={i.id} className="incident-card">
              <div>
                <h3>{i.type}</h3>
                <p>{i.location}</p>
              </div>
              <span className={`status ${i.status.toLowerCase()}`}>
                {i.status}
              </span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div id="map" className="map-box"></div>
      </div>
    </div>
  );
}

export default Dashboard;
