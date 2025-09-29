import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "./components/Sidebar";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutItem from "./components/WorkoutItem";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5 
      });
    }
  }, [center, zoom, map]);
  return null;
}

function MapClick({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const [mapEvent, setMapEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [liveLocation, setLiveLocation] = useState(null); 

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (data) setWorkouts(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    const watchError = (err) => {
      console.error("Error watching location:", err);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapPosition([latitude, longitude]);
        setLiveLocation([latitude, longitude]);
      },
      (err) => {
        console.error(`Geolocation Error (${err.code}): ${err.message || "Please ensure permissions are granted."}`);
      },
      { enableHighAccuracy: true }
    );
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLiveLocation([latitude, longitude]);
      },
      watchError, 
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  function handleNewWorkout(workout) {
    setWorkouts((prev) => [...prev, workout]);
    setShowForm(false);
  }

  function handleDeleteWorkout(id) {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  function handleReset() {
    localStorage.removeItem("workouts");
    setWorkouts([]);
  }

  return (
    <div className="flex h-screen">
      <Sidebar workouts={workouts} onDelete={handleDeleteWorkout} onReset={handleReset}>
        {showForm && (
          <WorkoutForm
            coords={mapEvent}
            onAdd={handleNewWorkout}
            onCancel={() => setShowForm(false)}
          />
        )}
        {workouts.map((w) => (
          <WorkoutItem key={w.id} workout={w} onDelete={handleDeleteWorkout} />
        ))}
      </Sidebar>

      <MapContainer
        center={mapPosition} 
        zoom={15}
        className="flex-1"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ChangeView center={mapPosition} zoom={15} />

        <MapClick
          onClick={(coords) => {
            setMapEvent(coords);
            setShowForm(true);
          }}
        />

        {liveLocation && (
          <Marker position={liveLocation}>
            <Popup>📍 You are here</Popup>
          </Marker>
        )}

        {workouts.map((w) => (
          <Marker key={w.id} position={w.coords}>
            <Popup>
              {w.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} {w.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;