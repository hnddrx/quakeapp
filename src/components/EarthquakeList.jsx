import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { motion } from "framer-motion";

import "./earthquakelist.css";

// Helper function to get the color based on magnitude
const getMagColor = (mag) => {
  if (mag === null || mag === undefined) return "#9ca3af"; // gray
  if (mag < 2) return "#4ade80"; // green
  if (mag < 4) return "#facc15"; // yellow
  if (mag < 6) return "#f97316"; // orange
  return "#ef4444"; // red
};

// Helper function to calculate radius based on magnitude
const getMagRadius = (mag) => {
  if (mag === null || mag === undefined) return 4;
  return Math.min(Math.max(mag * 3, 4), 20); // radius between 4 and 20
};

// Animate map zoom on load
const AnimatedMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 3, { animate: false });
    const timeout = setTimeout(() => {
      map.flyTo(center, zoom, { duration: 2 });
    }, 500);
    return () => clearTimeout(timeout);
  }, [center, zoom, map]);
  return null;
};

// Haversine formula to get distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div role="status" aria-live="polite" className="loading-spinner">
    Loading earthquake data...
  </div>
);

const EarthquakeList = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setLoading(false)
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchEarthquakes = async () => {
      try {
        const today = new Date();
        const startTime = today.toISOString().slice(0, 10); // YYYY-MM-DD
        const endTime = new Date(today.getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10); // next day

        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minlatitude=4.5&maxlatitude=21.5&minlongitude=116&maxlongitude=127.5`;

        const res = await axios.get(url);
        const data = res.data.features.map((f) => ({
          id: f.id,
          place: f.properties.place,
          mag: f.properties.mag,
          time: f.properties.time,
          url: f.properties.url,
          coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]], // [lon, lat]
        }));
        setEarthquakes(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch earthquake data.");
        console.error("Error fetching earthquake data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 60000);
    return () => clearInterval(interval);
  }, [location]);

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <p role="alert" className="status-message error">
        {error}
      </p>
    );

  if (!location)
    return (
      <p role="alert" className="status-message error">
        Unable to get your location. Please allow location access.
      </p>
    );

  if (earthquakes.length === 0) {
    return (
      <p role="alert" className="status-message error">
        No earthquake data found for the selected region today.
      </p>
    );
  }

  const nearbyEarthquakes = earthquakes.filter((eq) => {
    const [lon, lat] = eq.coordinates;
    const dist = getDistanceFromLatLonInKm(
      location.lat,
      location.lon,
      lat,
      lon
    );
    return dist <= 300;
  });

  return (
    <div className="earthquake-container">
      <h1 className="title">Recent Earthquakes Near You</h1>

      <div className="map-list-wrapper">
        <motion.div
          className="map-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <MapContainer
            center={[location.lat, location.lon]}
            zoom={5}
            scrollWheelZoom={true}
            className="map-container"
            aria-label="Earthquake locations map"
          >
            <AnimatedMapView center={[location.lat, location.lon]} zoom={5} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* User location marker */}
            <CircleMarker
              center={[location.lat, location.lon]}
              radius={10}
              pathOptions={{
                color: "#2563eb",
                fillColor: "#3b82f6",
                fillOpacity: 0.6,
              }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>

            {/* Earthquake markers */}
            {earthquakes.map((eq) => (
              <CircleMarker
                key={eq.id}
                center={[eq.coordinates[1], eq.coordinates[0]]}
                radius={getMagRadius(eq.mag)}
                pathOptions={{ color: getMagColor(eq.mag), fillOpacity: 0.7 }}
                eventHandlers={{
                  click: () => window.open(eq.url, "_blank"),
                }}
                aria-label={`Earthquake magnitude ${eq.mag?.toFixed(1)} at ${eq.place}`}
              >
                <Popup>
                  <strong style={{ color: getMagColor(eq.mag) }}>
                    Magnitude: M{eq.mag?.toFixed(1)}
                  </strong>
                  <br />
                  Location: {eq.place}
                  <br />
                  Time: {new Date(eq.time).toLocaleString()}
                  <br />
                  <a
                    href={eq.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="popup-link"
                  >
                    View Details
                  </a>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="map-legend" aria-label="Earthquake magnitude legend">
            <h3>Magnitude Legend</h3>
            <ul>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#4ade80" }}
                />{" "}
                Less than 2.0 (Minor)
              </li>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#facc15" }}
                />{" "}
                2.0 to 3.9 (Light)
              </li>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#f97316" }}
                />{" "}
                4.0 to 5.9 (Moderate)
              </li>
              <li>
                <span
                  className="legend-color"
                  style={{ backgroundColor: "#ef4444" }}
                />{" "}
                6.0+ (Strong)
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Earthquake list */}
        <motion.ul
          className="earthquake-list"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          aria-label="List of recent earthquakes"
        >
          {nearbyEarthquakes.map((eq) => (
            <li key={eq.id} tabIndex={0}>
              <strong style={{ color: getMagColor(eq.mag) }}>
                M{eq.mag?.toFixed(1)}
              </strong>{" "}
              - {eq.place}
              <br />
              <time dateTime={new Date(eq.time).toISOString()}>
                {new Date(eq.time).toLocaleString()}
              </time>
              <br />
              <a
                href={eq.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-button"
              >
                View Details
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};
export default EarthquakeList;
