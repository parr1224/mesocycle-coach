// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { presetTemplates } from "./utils/templates";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

function exportToClipboard(template: any) {
  const lines: string[] = [];
  lines.push(`# ${template.name}`);
  lines.push(`Weeks: ${template.weeks} | Split: ${template.weekDetails?.[0]?.split}`);
  lines.push("\n====================\n");
  template.weekDetails[0].days.forEach((day: any) => {
    lines.push(`## ${day.label}`);
    day.exercises.forEach((ex: any, i: number) => {
      lines.push(`- ${ex.name || "[Exercise]"} (${ex.type || "type"}, ${ex.muscleGroup || "group"})`);
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
      </Routes>
    </Router>
  );
}

export default App;

function MesocycleView() {
  const [template, setTemplate] = useState<any>(() => {
    const saved = localStorage.getItem("selectedTemplate");
    return saved ? JSON.parse(saved) : {};
  });

  const [exerciseLibrary, setExerciseLibrary] = useState<string[]>([]);
  const [typeLibrary, setTypeLibrary] = useState<string[]>([]);
  const [muscleLibrary, setMuscleLibrary] = useState<string[]>([]);

  useEffect(() => {
    localStorage.removeItem("exerciseLibrary");
    localStorage.removeItem("typeLibrary");
    localStorage.removeItem("muscleLibrary");
  }, []);

  const handleAddExercise = (dayIndex: number) => {
    const updatedTemplate = { ...template };
    const day = updatedTemplate.weekDetails[0].days[dayIndex];
    day.exercises.push({ name: "", type: "", muscleGroup: "" });
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

  const handleExerciseChange = (dayIndex: number, exIndex: number, field: string, value: string) => {
    const updatedTemplate = { ...template };
    const exercise = updatedTemplate.weekDetails[0].days[dayIndex].exercises[exIndex];
    exercise[field] = value;

    const libraries = {
      name: [exerciseLibrary, setExerciseLibrary, "exerciseLibrary"],
      type: [typeLibrary, setTypeLibrary, "typeLibrary"],
      muscleGroup: [muscleLibrary, setMuscleLibrary, "muscleLibrary"]
    };

    const [lib, setLib, key] = libraries[field];
    if (value.trim() && !lib.includes(value.trim())) {
      const updated = [...lib, value.trim()];
      setLib(updated);
      localStorage.setItem(key, JSON.stringify(updated));
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
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center bg-gray-700 p-2 rounded"
                        >
                          <input
                            className="p-2 rounded bg-gray-800 text-white"
                            placeholder="Exercise Name"
                            list={`exercise-options-${idx}-${exIdx}`}
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(idx, exIdx, "name", e.target.value)}
                          />
                          <datalist id={`exercise-options-${idx}-${exIdx}`}>
                            {exerciseLibrary.map((ex, i) => (
                              <option key={i} value={ex} />
                            ))}
                          </datalist>

                          <input
                            className="p-2 rounded bg-gray-800 text-white"
                            placeholder="Type (e.g., Machine)"
                            list={`type-options-${idx}-${exIdx}`}
                            value={exercise.type}
                            onChange={(e) => handleExerciseChange(idx, exIdx, "type", e.target.value)}
                          />
                          <datalist id={`type-options-${idx}-${exIdx}`}>
                            {typeLibrary.map((type, i) => (
                              <option key={i} value={type} />
                            ))}
                          </datalist>

                          <div className="flex gap-2">
                            <input
                              className="p-2 rounded bg-gray-800 text-white w-full"
                              placeholder="Muscle Group"
                              list={`muscle-options-${idx}-${exIdx}`}
                              value={exercise.muscleGroup}
                              onChange={(e) => handleExerciseChange(idx, exIdx, "muscleGroup", e.target.value)}
                            />
                            <datalist id={`muscle-options-${idx}-${exIdx}`}>
                              {muscleLibrary.map((muscle, i) => (
                                <option key={i} value={muscle} />
                              ))}
                            </datalist>
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
    </div>
  );
}