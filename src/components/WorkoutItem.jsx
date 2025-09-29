export default function WorkoutItem({ workout, onDelete }) {
  return (
    <li
      className={`p-4 rounded bg-gray-700 cursor-pointer grid grid-cols-2 gap-2 border-l-4 ${
        workout.type === "running" ? "border-green-500" : "border-yellow-500"
      }`}
    >
      <div className="col-span-2 flex justify-between items-center">
        <h2 className="font-semibold text-xl ">{workout.description}</h2>
        <button
          onClick={() => onDelete(workout.id)}
          className="text-xs opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
      <div className=" col-span-2 flex items-center justify-between w-full">
        <p>📏 {workout.distance} <span className="text-xs text-slate-400">KM</span></p>
        <p>⏱ {workout.duration} <span className="text-xs text-slate-400">MIN</span></p>
        {workout.type === "running" && <p>🦶 {workout.cadence} <span className="text-xs text-slate-400">SPM</span></p>}
        {workout.type === "cycling" && <p>⛰ {workout.elevation} <span className="text-xs text-slate-400">M</span></p>}
      </div>
    </li>
  );
}
