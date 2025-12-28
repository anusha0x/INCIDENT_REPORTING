import CitizenView from "./pages/CitizenView";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

function App() {
  const [view, setView] = useState("citizen");

  return (
    <>
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 999 }}>
        <button onClick={() => setView("citizen")}>Citizen</button>
        <button onClick={() => setView("dashboard")} style={{ marginLeft: 10 }}>
          Responder
        </button>
      </div>

      {view === "citizen" ? <CitizenView /> : <Dashboard />}
    </>
  );
}

export default App;
