// src/components/TemplatesPage.tsx
import React, { useState } from 'react';

export default function TemplatesPage() {
  const [workout, setWorkout] = useState([
    { name: 'Barbell Squat', sets: [false, false, false] },
    { name: 'Leg Press', sets: [false, false, false] },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleSet = (exerciseIndex: number, setIndex: number) => {
    const newWorkout = [...workout];
    newWorkout[exerciseIndex].sets[setIndex] = !newWorkout[exerciseIndex].sets[setIndex];
    setWorkout(newWorkout);
  };

  const allComplete = workout.every(e => e.sets.every(s => s));

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mesocycle Coach</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowCalendar(!showCalendar)} className="text-white">📅</button>
          <button onClick={() => setShowMenu(!showMenu)} className="text-white">⋮</button>
        </div>
      </div>

      {showCalendar && (
        <div className="grid grid-cols-6 gap-1 text-center mb-4">
          {[...Array(5)].map((_, w) => (
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div
                key={`${w}-${i}`}
                className={`py-2 rounded ${w === 3 && i === 1 ? 'bg-red-600' : w < 3 ? 'bg-green-700' : 'bg-gray-800'}`}
              >
                {d}
              </div>
            ))
          ))}
        </div>
      )}

      {showMenu && (
        <div className="absolute right-6 mt-2 bg-gray-800 text-white rounded shadow-lg w-48 z-10">
          <div className="px-4 py-2 font-bold border-b border-gray-700">MESOCYCLE</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">View notes</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Rename</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Progressions</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Summary</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">End meso</div>
          <div className="px-4 py-2 font-bold border-t border-gray-700">WORKOUT</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">New note</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Relabel</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Add exercise</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Bodyweight</div>
          <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400">End workout</div>
        </div>
      )}

      <div className="space-y-4">
        {workout.map((exercise, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
            <div className="grid grid-cols-3 gap-4">
              {exercise.sets.map((set, j) => (
                <button
                  key={j}
                  onClick={() => toggleSet(i, j)}
                  className={`py-2 rounded ${set ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  Set {j + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allComplete && (
        <button className="mt-6 px-4 py-2 bg-blue-600 rounded text-white block mx-auto">
          Finish Workout
        </button>
      )}
    </div>
  );
}
