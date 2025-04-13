// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { presetTemplates } from "./utils/templates";

export default function App() {
  return (
    <Router>
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
              <Link to="#" className="text-blue-400 hover:underline">Use this template</Link>
            </div>
          ))}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Mesocycle Coach
        </footer>
      </div>
    </Router>
  );
}