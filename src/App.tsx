// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { presetTemplates } from "./utils/templates";

function Home() {
  const navigate = useNavigate();

  const handleUseTemplate = (template: any) => {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    navigate("/mesocycle");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Mesocycle Coach</h1>
        <p className="text-center text-gray-400 mt-1">Choose a template to begin</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {presetTemplates.map((template, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-1">{template.name}</h2>
            <p className="text-gray-400 text-sm mb-2">{template.weeks} weeks · {template.weekDetails[0].split}</p>
            <button
              onClick={() => handleUseTemplate(template)}
              className="text-blue-400 hover:underline"
            >
              Use this template
            </button>
          </div>
        ))}
      </main>

      <footer className="mt-12 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Mesocycle Coach
      </footer>
    </div>
  );
}

function MesocycleView() {
  const [template, setTemplate] = useState<any>(() => {
    const saved = localStorage.getItem("selectedTemplate");
    return saved ? JSON.parse(saved) : {};
  });

  const handleAddExercise = (dayIndex: number) => {
    const updatedTemplate = { ...template };
    const week0 = updatedTemplate.weekDetails[0];
    const day = week0.days[dayIndex];
    day.exercises.push({ name: "", type: "", muscleGroup: "" });
    setTemplate(updatedTemplate);
    localStorage.setItem("selectedTemplate", JSON.stringify(updatedTemplate));
  };

  const handleExerciseChange = (dayIndex: number, exIndex: number, field: string, value: string) => {
    const updatedTemplate = { ...template };
    updatedTemplate.weekDetails[0].days[dayIndex].exercises[exIndex][field] = value;
    setTemplate(updatedTemplate);
    localStorage.setItem("selectedTemplate", JSON.stringify(updatedTemplate));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{template.name}</h1>
      <p className="text-gray-400 mb-6">Weeks: {template.weeks} | Split: {template.weekDetails?.[0]?.split}</p>
      <div className="space-y-6">
        {template.weekDetails?.[0]?.days?.map((day: any, idx: number) => (
          <div key={idx} className="bg-gray-800 rounded p-4">
            <h3 className="text-lg font-semibold mb-2">{day.label}</h3>
            <div className="space-y-2">
              {day.exercises.map((exercise: any, exIdx: number) => (
                <div key={exIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    className="p-2 rounded bg-gray-700 text-white"
                    placeholder="Exercise Name"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(idx, exIdx, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    className="p-2 rounded bg-gray-700 text-white"
                    placeholder="Type (e.g., Machine)"
                    value={exercise.type}
                    onChange={(e) => handleExerciseChange(idx, exIdx, "type", e.target.value)}
                  />
                  <input
                    type="text"
                    className="p-2 rounded bg-gray-700 text-white"
                    placeholder="Muscle Group"
                    value={exercise.muscleGroup}
                    onChange={(e) => handleExerciseChange(idx, exIdx, "muscleGroup", e.target.value)}
                  />
                </div>
              ))}
              <button
                onClick={() => handleAddExercise(idx)}
                className="mt-2 text-sm text-blue-400 hover:underline"
              >
                ➕ Add Exercise
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mesocycle" element={<MesocycleView />} />
      </Routes>
    </Router>
  );
}