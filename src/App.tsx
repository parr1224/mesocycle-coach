// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { presetTemplates } from "./utils/templates";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613914-85f342c0c21b?auto=format&fit=crop&w=1400&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}
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
              <div className="absolute right-6 mt-2 bg-gray-800 shadow rounded w-48 z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                  onClick={goToTemplates}
                >
                  Templates
                </button>
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
      </Routes>
    </Router>
  );
}

function TemplatesPage() {
  const navigate = useNavigate();
  const handleUseTemplate = (template: any) => {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    navigate("/mesocycle");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Templates</h1>
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
    </div>
  );
}

export default App;

function MesocycleView() {
  const [template, setTemplate] = useState<any>(() => {
    const saved = localStorage.getItem("selectedTemplate");
    return saved ? JSON.parse(saved) : {};
  });

  const [exerciseLibrary, setExerciseLibrary] = useState<string[]>([]);

  useEffect(() => {
    localStorage.removeItem("exerciseLibrary");
    setExerciseLibrary([]);
  }, []);

  const handleAddExercise = (dayIndex: number) => {
    const updatedTemplate = { ...template };
    const day = updatedTemplate.weekDetails[0].days[dayIndex];
    day.exercises.push({ name: "" });
    setTemplate(updatedTemplate);
    localStorage.setItem("selectedTemplate", JSON.stringify(updatedTemplate));
  };

  const handleDeleteExercise = (dayIndex: number, exIndex: number) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    const updatedTemplate = { ...template };
    updatedTemplate.weekDetails[0].days[dayIndex].exercises.splice(exIndex, 1);
    setTemplate(updatedTemplate);
    localStorage.setItem("selectedTemplate", JSON.stringify(updatedTemplate));
  };

  const handleExerciseChange = (dayIndex: number, exIndex: number, value: string) => {
    const updatedTemplate = { ...template };
    const exercise = updatedTemplate.weekDetails[0].days[dayIndex].exercises[exIndex];
    exercise.name = value;

    if (value.trim().length >= 3 && !exerciseLibrary.includes(value.trim())) {
      const updated = [...exerciseLibrary, value.trim()];
      setExerciseLibrary(updated);
      localStorage.setItem("exerciseLibrary", JSON.stringify(updated));
    }

    setTemplate(updatedTemplate);
    localStorage.setItem("selectedTemplate", JSON.stringify(updatedTemplate));
  };

  const handleDragEnd = (result: any, dayIndex: number) => {
    if (!result.destination) return;
    const updatedTemplate = { ...template };
    const exercises = Array.from(updatedTemplate.weekDetails[0].days[dayIndex].exercises);
    const [moved] = exercises.splice(result.source.index, 1);
    exercises.splice(result.destination.index, 0, moved);
    updatedTemplate.weekDetails[0].days[dayIndex].exercises = exercises;
    setTemplate(updatedTemplate);
    localStorage.setItem("selectedTemplate", JSON.stringify(updatedTemplate));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <button
          onClick={() => exportToClipboard(template)}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          📋 Copy to Clipboard
        </button>
      </div>
      <p className="text-gray-400 mb-6">Weeks: {template.weeks} | Split: {template.weekDetails?.[0]?.split}</p>

      {template.weekDetails?.[0]?.days?.map((day: any, idx: number) => (
        <div key={idx} className="bg-gray-800 rounded p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">{day.label}</h3>
          <DragDropContext onDragEnd={(result) => handleDragEnd(result, idx)}>
            <Droppable droppableId={`day-${idx}`}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {day.exercises.map((exercise: any, exIdx: number) => (
                    <Draggable draggableId={`exercise-${idx}-${exIdx}`} index={exIdx} key={`exercise-${idx}-${exIdx}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-700 p-2 rounded"
                        >
                          <input
                            className="p-2 rounded bg-gray-800 text-white"
                            placeholder="Exercise Name"
                            list={`exercise-options-${idx}-${exIdx}`}
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(idx, exIdx, e.target.value)}
                          />
                          <datalist id={`exercise-options-${idx}-${exIdx}`}>
                            {exerciseLibrary.map((ex, i) => (
                              <option key={i} value={ex} />
                            ))}
                          </datalist>
                          <div className="sm:ml-auto">
                            <button
                              onClick={() => handleDeleteExercise(idx, exIdx)}
                              className="text-red-400 text-sm"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            onClick={() => handleAddExercise(idx)}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            ➕ Add Exercise
          </button>
        </div>
      ))}

      <div className="mt-10 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">Add to Exercise Library</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input id="newName" className="p-2 rounded bg-gray-700 text-white" placeholder="Exercise Name" />
          <input id="newType" className="p-2 rounded bg-gray-700 text-white" placeholder="Exercise Type (e.g., Machine)" />
          <input id="newMuscle" className="p-2 rounded bg-gray-700 text-white" placeholder="Muscle Group (e.g., Chest)" />
        </div>
        <button
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
          onClick={() => {
            const name = (document.getElementById('newName') as HTMLInputElement).value.trim();
            const type = (document.getElementById('newType') as HTMLInputElement).value.trim();
            const muscle = (document.getElementById('newMuscle') as HTMLInputElement).value.trim();
            if (name && !exerciseLibrary.includes(name)) {
              const updated = [...exerciseLibrary, name];
              setExerciseLibrary(updated);
              localStorage.setItem("exerciseLibrary", JSON.stringify(updated));
            }
            (document.getElementById('newName') as HTMLInputElement).value = "";
            (document.getElementById('newType') as HTMLInputElement).value = "";
            (document.getElementById('newMuscle') as HTMLInputElement).value = "";
          }}
        >
          ➕ Add to Library
        </button>
      </div>
    </div>
  );
}