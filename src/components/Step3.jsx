import React from 'react'
import { calculateDecision } from '../utils/decisionLogic'

const Step3 = ({ decision, setDecision, goToStep }) => {
  const updateAnswer = (question, value) => {
    setDecision({
      ...decision,
      answers: {
        ...decision.answers,
        [question]: value,
      },
    })
  }

  const handleCalculate = () => {
    if (
      !decision.answers.q1 ||
      !decision.answers.q2 ||
      !decision.answers.q3 ||
      !decision.answers.q4
    ) {
      alert('Please answer all 4 questions before continuing')
      return
    }

    const result = calculateDecision(decision)
    setDecision({
      ...decision,
      result,
    })

    goToStep(4)
  }

  const questions = [
    {
      id: 'q1',
      title: "Question 1: What's most important to you?",
      options: [
        {
          value: 'growth',
          label: 'Growth & Opportunity',
          description: 'Development, learning, new experiences',
        },
        {
          value: 'stability',
          label: 'Stability & Security',
          description: 'Predictability, safety, and comfort',
        },
        {
          value: 'lifestyle',
          label: 'Lifestyle & Freedom',
          description: 'Flexibility, time, and personal fulfillment',
        },
        {
          value: 'financial',
          label: 'Financial Value',
          description: 'Cost, savings, and monetary benefits',
        },
        {
          value: 'relationships',
          label: 'Relationships & Community',
          description: 'People, connections, and belonging',
        },
        {
          value: 'impact',
          label: 'Impact & Purpose',
          description: 'Meaning, contribution, and legacy',
        },
      ],
    },
    {
      id: 'q2',
      title: 'Question 2: How do you feel about change and uncertainty?',
      options: [
        {
          value: 'low',
          label: 'Prefer Safety',
          description: 'I like familiar, tried-and-tested choices',
        },
        {
          value: 'medium',
          label: 'Balanced Approach',
          description: 'Some change is good, but not too drastic',
        },
        {
          value: 'high',
          label: 'Embrace Change',
          description: "I'm excited by new possibilities and adventure",
        },
      ],
    },
    {
      id: 'q3',
      title: "Question 3: What's your decision-making style?",
      options: [
        {
          value: 'practical',
          label: 'Practical & Logical',
          description: 'I focus on facts, data, and concrete benefits',
        },
        {
          value: 'intuitive',
          label: 'Intuitive & Emotional',
          description: 'I trust my gut feelings and emotional response',
        },
        {
          value: 'balanced',
          label: 'Balanced & Holistic',
          description: 'I consider both logic and feelings equally',
        },
      ],
    },
    {
      id: 'q4',
      title: 'Question 4: What timeline are you thinking about?',
      options: [
        {
          value: 'immediate',
          label: 'Immediate Future',
          description: 'What happens in the next few months',
        },
        {
          value: 'medium',
          label: 'Medium-term',
          description: 'Impact over the next 1-3 years',
        },
        {
          value: 'longterm',
          label: 'Long-term Future',
          description: "Where I'll be 5+ years from now",
        },
      ],
    },
  ]

  return (
    <section id="step-3" className="section active">
      <div className="card">
        <h2>What matters most to you?</h2>
        <p className="description">
          Answer these 4 questions to help us understand your priorities.
        </p>

        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.title}</h3>
            <div className="radio-group">
              {question.options.map((option) => (
                <label
                  key={option.value}
                  className={`radio-option ${
                    decision.answers[question.id] === option.value
                      ? 'selected'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={decision.answers[question.id] === option.value}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                  />
                  <span>
                    <strong>{option.label}</strong> - {option.description}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="button-group">
          <button className="btn-secondary" onClick={() => goToStep(2)}>
            ← Back
          </button>
          <button className="btn-primary" onClick={handleCalculate}>
            See My Decision →
          </button>
        </div>
      </div>
    </section>
  )
}

export default Step3
