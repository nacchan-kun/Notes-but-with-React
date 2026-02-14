import React, { useState, useEffect } from 'react'
import './App.css'
import ProgressBar from './components/ProgressBar'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import Step4 from './components/Step4'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [decision, setDecision] = useState({
    name: '',
    options: [],
    answers: {},
    result: null,
  })

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('decision')
    if (saved) {
      try {
        setDecision(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load from localStorage:', e)
      }
    }
  }, [])

  // Save to localStorage whenever decision changes
  useEffect(() => {
    try {
      localStorage.setItem('decision', JSON.stringify(decision))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [decision])

  const goToStep = (step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container">
      <header>
        <h1>Notes That Decide For You</h1>
        <p className="subtitle">
          Stop overthinking. Answer 4 questions and let your priorities guide
          you.
        </p>
      </header>

      <ProgressBar currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1
          decision={decision}
          setDecision={setDecision}
          goToStep={goToStep}
        />
      )}

      {currentStep === 2 && (
        <Step2
          decision={decision}
          setDecision={setDecision}
          goToStep={goToStep}
        />
      )}

      {currentStep === 3 && (
        <Step3
          decision={decision}
          setDecision={setDecision}
          goToStep={goToStep}
        />
      )}

      {currentStep === 4 && (
        <Step4
          decision={decision}
          setDecision={setDecision}
          goToStep={goToStep}
        />
      )}
    </div>
  )
}

export default App
