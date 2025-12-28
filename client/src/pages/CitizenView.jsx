import "../App.css";
import { useState } from "react";

function CitizenView() {
  const [incidentType, setIncidentType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const getGuidance = () => {
    switch (incidentType) {
      case "Accident":
        return "Turn on hazard lights, avoid moving injured people, apply pressure to bleeding, and stay visible.";
      case "Medical":
        return "Keep the person comfortable, do not give food or water, and monitor breathing.";
      case "Fire":
        return "Move away from smoke, do not use elevators, cover mouth with cloth, and follow exits.";
      default:
        return "Stay in a safe place, keep your phone reachable, and wait for responders.";
    }
  };

  return (
    <div className="hero">
      <div className="overlay">
        {!submitted ? (
          <>
            <h1 className="title">Help is on the way</h1>
            <p className="subtitle">
              Take a deep breath. Report the incident and we will alert responders immediately.
            </p>

            <form
              className="incident-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <select
                required
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
              >
                <option value="">Select Incident Type</option>
                <option>Accident</option>
                <option>Medical</option>
                <option>Fire</option>
                <option>Other</option>
              </select>

              <textarea
                placeholder="Describe what happened..."
                rows="4"
                required
              />

              <button type="submit">Submit Report</button>
            </form>
          </>
        ) : (
          <div className="guide-box">
            <h2>Stay Calm. Help Has Been Notified 🚑</h2>

            <ul className="status-list">
              <li>✔ Your location has been shared</li>
              <li>✔ Emergency responders alerted</li>
              <li>✔ Keep your phone reachable</li>
            </ul>

            <h3>What to do right now:</h3>
            <p className="guidance-text">{getGuidance()}</p>

            <div className="breathing-tip">
              <strong>Calm Tip:</strong> Breathe in for 4 seconds, hold for 4, exhale for 6.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CitizenView;
