import React from 'react'

const Step4 = ({ decision, setDecision, goToStep }) => {
  const startOver = () => {
    if (
      confirm(
        'Are you sure you want to start a new decision? Current data will be cleared.'
      )
    ) {
      setDecision({
        name: '',
        options: [],
        answers: {},
        result: null,
      })
      goToStep(1)
    }
  }

  if (!decision.result) {
    return null
  }

  const { winner, scores, reasons } = decision.result
  const prosCount = winner.pros.filter((p) => p.trim()).length
  const consCount = winner.cons.filter((c) => c.trim()).length

  return (
    <section id="step-4" className="section active">
      <div className="card">
        <div className="result-card">
          <h3>Based on your priorities, we recommend:</h3>
          <div className="winner">{winner.name}</div>
          <p>This option best aligns with what matters to you</p>
        </div>

        <div className="explanation">
          <h4>Why this choice?</h4>
          <div>
            <p>
              <strong>Here's why:</strong>
            </p>
            {reasons.length > 0 && (
              <ul style={{ marginLeft: '20px', lineHeight: 2 }}>
                {reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            )}
            <p>
              This option has <strong>{prosCount} pros</strong> and{' '}
              <strong>{consCount} cons</strong>.{' '}
              {prosCount > consCount
                ? 'The advantages clearly outweigh the disadvantages.'
                : 'While the numbers are close, it aligns better with your stated priorities.'}
            </p>
          </div>

          <h4 style={{ marginTop: '24px' }}>Score Breakdown</h4>
          <div className="score-comparison">
            {scores.map((s) => {
              const opt = decision.options[s.optionIndex]
              return (
                <div key={s.optionIndex} className="score-item">
                  <div className="option-name">{opt.name}</div>
                  <div className="score">{s.score.toFixed(1)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="button-group">
          <button className="btn-secondary" onClick={startOver}>
            Start New Decision
          </button>
          <button className="btn-primary" onClick={() => goToStep(1)}>
            Edit Decision
          </button>
        </div>
      </div>
    </section>
  )
}

export default Step4
