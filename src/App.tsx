// src/App.tsx
// src/App.tsx
import React, { useEffect } from 'react';
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
  const template = JSON.parse(localStorage.getItem("selectedTemplate") || '{}');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">{template.name}</h1>
      <p className="text-gray-400 mb-6">Weeks: {template.weeks} | Split: {template.weekDetails?.[0]?.split}</p>
      <div className="space-y-4">
        {template.weekDetails?.[0]?.days?.map((day: any, idx: number) => (
          <div key={idx} className="bg-gray-800 rounded p-4">
            <h3 className="text-lg font-semibold">{day.label}</h3>
            <p className="text-sm text-gray-400">{day.exercises?.length || 0} exercises</p>
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