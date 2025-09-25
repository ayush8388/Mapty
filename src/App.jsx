import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "./components/Sidebar";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutItem from "./components/WorkoutItem";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const [mapEvent, setMapEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (data) setWorkouts(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);


  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapPosition([latitude, longitude]); 
        setHasLocation(true);
      },
      () => {
        alert("Could not get your location 😢");
      }
    );
  }
}, []);


  function handleNewWorkout(workout) {
    setWorkouts([...workouts, workout]);
    setShowForm(false);
  }

  function handleDeleteWorkout(id) {
    setWorkouts(workouts.filter(w => w.id !== id));
  }

  function handleReset() {
    localStorage.removeItem("workouts");
    setWorkouts([]);
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        workouts={workouts}
        onDelete={handleDeleteWorkout}
        onReset={handleReset}
      >
        {showForm && (
          <WorkoutForm
            coords={mapEvent}
            onAdd={handleNewWorkout}
            onCancel={() => setShowForm(false)}
          />
        )}
        {workouts.map(w => (
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
         {hasLocation && (
            <Marker position={mapPosition}>
              <Popup>You are here 🚀</Popup>
            </Marker>
          )}

        <MapClick
          onClick={coords => {
            setMapEvent(coords);
            setShowForm(true);
          }}
        />
        {workouts.map(w => (
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

function MapClick({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default App;
