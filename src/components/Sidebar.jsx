export default function Sidebar({ children, workouts, onReset }) {
  return (
    <div className="w-[350px] bg-gray-800 text-white p-5 flex flex-col">
      <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-6" />

      {workouts.length >= 2 && (
        <div className="flex justify-end mb-2">
          <p
            onClick={onReset}
            className="text-sm underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Delete all
          </p>
        </div>
      )}

      <ul className="flex-1 overflow-y-auto space-y-3">{children}</ul>

    </div>
  );
}
