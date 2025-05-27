import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import for React Router
import Navbar from "./components/Navbar";
import EarthquakeList from "./components/EarthquakeList";
import Guide from "./pages/Guideline"; // Fixed typo (Guidline -> Guideline)
import Footer from "./components/Footer";

import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<EarthquakeList />} />
            <Route path="/guidelines" element={<Guide />} />
            <Route path="/contact" element={<EarthquakeList />} />
          </Routes>
        </main>
      </BrowserRouter>

      <Footer />
    </div>
  );
}

export default App;
