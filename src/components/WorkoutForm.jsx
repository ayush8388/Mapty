import { useState } from "react";

export default function WorkoutForm({ coords, onAdd, onCancel }) {
  const [type, setType] = useState("running");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [cadence, setCadence] = useState("");
  const [elevation, setElevation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!coords) return;

    const id = Date.now().toString();
    const description = `${type[0].toUpperCase() + type.slice(1)} on ${
      new Date().toLocaleDateString()
    }`;

    const workout = {
      id,
      type,
      distance: +distance,
      duration: +duration,
      cadence: type === "running" ? +cadence : undefined,
      elevation: type === "cycling" ? +elevation : undefined,
      coords,
      description,
    };

    onAdd(workout);

    setDistance("");
    setDuration("");
    setCadence("");
    setElevation("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 rounded p-4 grid grid-cols-2 gap-3 text-sm"
    >
      <div className="flex items-center">
        <label className="w-1/2">Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full p-1 rounded text-black bg-slate-200 "
        >
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
        </select>
      </div>

      <div className="flex items-center">
        <label className="w-1/2">Distance</label>
        <input
          type="number"
          placeholder="km"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          className="w-full p-1 rounded text-black bg-slate-200 "
        />
      </div>

      <div className="flex items-center">
        <label className="w-1/2">Duration</label>
        <input
          type="number"
          placeholder="min"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          className="w-full p-1 rounded text-black bg-slate-200 "
        />
      </div>

      {type === "running" && (
        <div className="flex items-center">
          <label className="w-1/2">Cadence</label>
          <input
            type="number"
            placeholder="spm"
            value={cadence}
            onChange={e => setCadence(e.target.value)}
            className="w-full p-1 rounded text-black bg-slate-200 "
          />
        </div>
      )}

      {type === "cycling" && (
        <div className="flex items-center">
          <label className="w-1/2">Elevation</label>
          <input
            type="number"
            placeholder="m"
            value={elevation}
            onChange={e => setElevation(e.target.value)}
            className="w-full p-1 rounded text-black bg-slate-200 "
          />
        </div>
      )}

      <div className="col-span-2 flex justify-between mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 px-3 py-1 rounded"
        >
          Cancel
        </button>
        <button type="submit" className="bg-green-600 px-3 py-1 rounded">
          OK
        </button>
      </div>
    </form>
  );
}
