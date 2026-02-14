import React from 'react'

const Step2 = ({ decision, setDecision, goToStep }) => {
  const addProCon = (optionIndex, type) => {
    const newDecision = { ...decision }
    newDecision.options[optionIndex][type].push('')
    setDecision(newDecision)
  }

  const updateProCon = (optionIndex, type, itemIndex, value) => {
    const newDecision = { ...decision }
    newDecision.options[optionIndex][type][itemIndex] = value
    setDecision(newDecision)
  }

  const removeProCon = (optionIndex, type, itemIndex) => {
    const newDecision = { ...decision }
    newDecision.options[optionIndex][type].splice(itemIndex, 1)
    setDecision(newDecision)
  }

  const handleContinue = () => {
    const hasContent = decision.options.some(
      (opt) =>
        opt.pros.some((p) => p.trim()) || opt.cons.some((c) => c.trim())
    )

    if (!hasContent) {
      alert('Please add at least some pros or cons before continuing')
      return
    }

    goToStep(3)
  }

  return (
    <section id="step-2" className="section active">
      <div className="card">
        <h2>List Pros & Cons</h2>
        <p className="description">
          Add the advantages and disadvantages for each option.
        </p>

        <div id="options-container" className="options-grid">
          {decision.options.map((option, optionIndex) => (
            <div key={optionIndex} className="option-card">
              <h3>{option.name}</h3>

              <div className="pros-cons">
                <h4>✓ Pros</h4>
                <div>
                  {option.pros.map((pro, itemIndex) => (
                    <div key={itemIndex} className="list-item">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) =>
                          updateProCon(
                            optionIndex,
                            'pros',
                            itemIndex,
                            e.target.value
                          )
                        }
                        placeholder="Enter advantage"
                      />
                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeProCon(optionIndex, 'pros', itemIndex)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="add-item-btn"
                  onClick={() => addProCon(optionIndex, 'pros')}
                >
                  + Add Pro
                </button>
              </div>

              <div className="pros-cons">
                <h4>✗ Cons</h4>
                <div>
                  {option.cons.map((con, itemIndex) => (
                    <div key={itemIndex} className="list-item">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) =>
                          updateProCon(
                            optionIndex,
                            'cons',
                            itemIndex,
                            e.target.value
                          )
                        }
                        placeholder="Enter disadvantage"
                      />
                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeProCon(optionIndex, 'cons', itemIndex)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="add-item-btn"
                  onClick={() => addProCon(optionIndex, 'cons')}
                >
                  + Add Con
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button className="btn-secondary" onClick={() => goToStep(1)}>
            ← Back
          </button>
          <button className="btn-primary" onClick={handleContinue}>
            Continue to Questions →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Step2
