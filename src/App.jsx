import { useState, useEffect } from 'react'
import './App.css'

// Data is hardcoded - no server needed
const APP_DATA = {
  title: "Linus 3M",
  version: "1.0.0",
  modules: [
    { id: 1, name: "Module 1", description: "Getting Started" },
    { id: 2, name: "Module 2", description: "Core Concepts" },
    { id: 3, name: "Module 3", description: "Advanced Topics" },
  ]
}

function App() {
  // Load progress from localStorage on mount
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('linus3m-progress')
    return saved ? JSON.parse(saved) : { completed: [], currentModule: 1 }
  })

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('linus3m-progress', JSON.stringify(progress))
  }, [progress])

  const completeModule = (moduleId) => {
    if (!progress.completed.includes(moduleId)) {
      setProgress(prev => ({
        ...prev,
        completed: [...prev.completed, moduleId]
      }))
    }
  }

  const resetProgress = () => {
    localStorage.removeItem('linus3m-progress')
    setProgress({ completed: [], currentModule: 1 })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">{APP_DATA.title}</h1>
        <p className="text-center text-blue-100 text-sm">v{APP_DATA.version}</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Completed: {progress.completed.length} / {APP_DATA.modules.length}</span>
            <button 
              onClick={resetProgress}
              className="text-red-500 hover:text-red-700"
            >
              Reset
            </button>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.completed.length / APP_DATA.modules.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {APP_DATA.modules.map(module => {
            const isCompleted = progress.completed.includes(module.id)
            return (
              <div 
                key={module.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                  isCompleted ? 'border-green-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                  {isCompleted ? (
                    <span className="text-green-500 text-xl">✓</span>
                  ) : (
                    <button
                      onClick={() => completeModule(module.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Local Storage Info */}
        <p className="text-center text-xs text-gray-400 mt-8">
          All data stored locally on your device
        </p>
      </main>
    </div>
  )
}

export default App
