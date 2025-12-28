import "../App.css";

function CitizenView() {
  return (
    <div className="hero">
      <div className="overlay">
        <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
          Report Road Incident
        </h1>

        <p style={{ maxWidth: "500px", marginBottom: "30px" }}>
          Quickly report accidents or emergencies. Your location is captured automatically.
        </p>

        <form style={{ maxWidth: "400px" }}>
          <select required style={inputStyle}>
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
            style={inputStyle}
          />

          <button style={buttonStyle}>Submit Report</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "none",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#e63946",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

export default CitizenView;
