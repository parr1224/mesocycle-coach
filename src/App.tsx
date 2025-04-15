// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { presetTemplates } from "./utils/templates";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MesocycleView from "./components/MesocycleView";
import TemplatesPage from "./components/TemplatesPage";
import ExerciseLibrary from "./components/ExerciseLibrary";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goToTemplates = () => {
    setMenuOpen(false);
    navigate("/templates");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d8fce4727de0?auto=format&fit=crop&w=1400&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mesocycle Coach</h1>
          <div>
            <button
              className="text-white text-2xl focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            {menuOpen && (
              <div className="absolute right-6 mt-2 w-52 rounded-md shadow-lg z-10 origin-top-right bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                  <button
                    className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={goToTemplates}
                  >
                    📁 Templates</button>
                  <button
                    className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/exercise-library");
                    }}
                  >
                    🏋️ Exercise Library</button>
                  <button
                    className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => alert('Coming soon!')}
                  >
                    🧠 Tips & Tricks
                  </button>
                  <button
                    className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => alert('Settings coming soon!')}
                  >
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}

function exportToClipboard(template: any) {
  const lines: string[] = [];
  lines.push(`# ${template.name}`);
  lines.push(`Weeks: ${template.weeks} | Split: ${template.weekDetails?.[0]?.split}`);
  lines.push("\n====================\n");
  template.weekDetails[0].days.forEach((day: any) => {
    lines.push(`## ${day.label}`);
    day.exercises.forEach((ex: any, i: number) => {
      lines.push(`- ${ex.name || "[Exercise]"}`);
    });
    lines.push("");
  });
  navigator.clipboard.writeText(lines.join("\n")).then(() => alert("Mesocycle copied to clipboard!"));
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mesocycle" element={<MesocycleView />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/exercise-library" element={<ExerciseLibrary />} />
      </Routes>
    </Router>
  );
}

export default App;
