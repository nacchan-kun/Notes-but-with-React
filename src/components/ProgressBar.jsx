import React from 'react'

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="progress-bar">
      {[
        { step: 1, label: 'Decision' },
        { step: 2, label: 'Pros & Cons' },
        { step: 3, label: 'Questions' },
        { step: 4, label: 'Result' },
      ].map(({ step, label }) => (
        <div
          key={step}
          className={`progress-step ${
            step < currentStep
              ? 'completed'
              : step === currentStep
              ? 'active'
              : ''
          }`}
          data-step={step}
        >
          <div className="progress-step-circle">{step}</div>
          <div className="progress-step-label">{label}</div>
        </div>
      ))}
    </div>
  )
}

export default ProgressBar
