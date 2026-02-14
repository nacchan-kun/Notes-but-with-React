import React, { useState, useEffect } from 'react'

const Step1 = ({ decision, setDecision, goToStep }) => {
  const [decisionName, setDecisionName] = useState('')
  const [options, setOptions] = useState(['', ''])

  useEffect(() => {
    if (decision.name) {
      setDecisionName(decision.name)
    }
    if (decision.options.length > 0) {
      setOptions(decision.options.map((opt) => opt.name))
    }
  }, [decision])

  const addOption = () => {
    setOptions([...options, ''])
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleContinue = () => {
    if (!decisionName.trim()) {
      alert('Please enter a decision name')
      return
    }

    const filledOptions = options.filter((opt) => opt.trim())
    if (filledOptions.length < 2) {
      alert('Please enter at least 2 options to compare')
      return
    }

    setDecision({
      ...decision,
      name: decisionName,
      options: filledOptions.map((name) => ({
        name,
        pros: [],
        cons: [],
      })),
    })

    goToStep(2)
  }

  return (
    <section id="step-1" className="section active">
      <div className="card">
        <h2>What are you deciding?</h2>
        <p className="description">
          Enter a name for your decision and the options you're considering.
        </p>

        <div className="form-group">
          <label htmlFor="decision-name">Decision Name</label>
          <input
            type="text"
            id="decision-name"
            placeholder="e.g., Where should I live? Which car to buy? Career change?"
            value={decisionName}
            onChange={(e) => setDecisionName(e.target.value)}
          />
        </div>

        {options.map((option, index) => (
          <div key={index} className="form-group">
            <label htmlFor={`option${index + 1}`}>Option {index + 1}</label>
            <input
              type="text"
              id={`option${index + 1}`}
              placeholder={`e.g., Option ${String.fromCharCode(65 + index)}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
            />
          </div>
        ))}

        <button className="btn-secondary btn-small" onClick={addOption}>
          + Add Another Option
        </button>

        <div className="button-group">
          <button className="btn-primary" onClick={handleContinue}>
            Continue to Pros & Cons →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Step1
