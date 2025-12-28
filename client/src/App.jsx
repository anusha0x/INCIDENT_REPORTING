import React from 'react';
import CitizenView from "./pages/CitizenView";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

function App() {
  const [view, setView] = useState("citizen");

  return (
    <>
      {view === "citizen" ? (
        <CitizenView setView={setView} />
      ) : (
        <Dashboard setView={setView} />
      )}
    </>
  );
}

export default App;
