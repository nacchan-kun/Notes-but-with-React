export function calculateDecision(decision) {
  const scores = decision.options.map((option, index) => {
    let score = 0
    const reasons = []

    // Base score: count of pros minus cons
    const prosCount = option.pros.filter((p) => p.trim()).length
    const consCount = option.cons.filter((c) => c.trim()).length
    score = prosCount - consCount

    // Weight based on Question 1: What's most important
    const q1Keywords = {
      growth: [
        'learn',
        'grow',
        'challenge',
        'new',
        'opportunity',
        'develop',
        'experience',
        'skill',
        'advance',
        'expand',
        'improve',
      ],
      stability: [
        'stable',
        'secure',
        'safe',
        'establish',
        'reliable',
        'proven',
        'consistent',
        'predictable',
        'steady',
        'certain',
      ],
      lifestyle: [
        'flexible',
        'balance',
        'time',
        'freedom',
        'autonomy',
        'independent',
        'personal',
        'leisure',
        'enjoy',
        'comfort',
        'convenient',
      ],
      financial: [
        'money',
        'cost',
        'price',
        'salary',
        'pay',
        'compensation',
        'bonus',
        'benefit',
        'save',
        'savings',
        'afford',
        'expensive',
        'cheap',
        'budget',
      ],
      relationships: [
        'people',
        'friends',
        'family',
        'community',
        'social',
        'team',
        'together',
        'connection',
        'network',
        'support',
        'belong',
      ],
      impact: [
        'help',
        'make a difference',
        'contribute',
        'purpose',
        'meaning',
        'important',
        'matter',
        'change',
        'impact',
        'legacy',
        'mission',
      ],
    }

    const priority = decision.answers.q1
    const keywords = q1Keywords[priority] || []

    let priorityMatches = 0
    option.pros.forEach((pro) => {
      const proLower = pro.toLowerCase()
      if (keywords.some((kw) => proLower.includes(kw))) {
        priorityMatches++
      }
    })

    if (priorityMatches > 0) {
      score += priorityMatches * 2.5
      const priorityLabels = {
        growth: 'growth & opportunity',
        stability: 'stability & security',
        lifestyle: 'lifestyle & freedom',
        financial: 'financial value',
        relationships: 'relationships & community',
        impact: 'impact & purpose',
      }
      reasons.push(`Aligns with your priority: ${priorityLabels[priority]}`)
    }

    // Weight based on Question 2: Change tolerance
    const changeLevel = decision.answers.q2
    const changeKeywords = {
      high: [
        'new',
        'innovative',
        'adventure',
        'exciting',
        'unique',
        'different',
        'bold',
        'fresh',
      ],
      low: [
        'established',
        'traditional',
        'familiar',
        'proven',
        'reliable',
        'safe',
        'standard',
      ],
      medium: ['balanced', 'moderate', 'growing', 'developing', 'evolving'],
    }

    const changeWords = changeKeywords[changeLevel] || []
    let changeMatches = 0
    option.pros.forEach((pro) => {
      const proLower = pro.toLowerCase()
      if (changeWords.some((kw) => proLower.includes(kw))) {
        changeMatches++
      }
    })

    if (changeMatches > 0) {
      score += changeMatches * 1.5
      const changeLevelLabel = {
        high: 'openness to change',
        low: 'preference for stability',
        medium: 'balanced approach',
      }
      reasons.push(`Matches your ${changeLevelLabel[changeLevel]}`)
    }

    // Weight based on Question 3: Decision style
    const decisionStyle = decision.answers.q3
    if (decisionStyle === 'practical') {
      // Boost options with more concrete, specific pros
      const specificWords = [
        'save',
        'cost',
        'increase',
        'decrease',
        'faster',
        'closer',
        'larger',
        'better',
      ]
      let practicalMatches = 0
      option.pros.forEach((pro) => {
        const proLower = pro.toLowerCase()
        if (specificWords.some((kw) => proLower.includes(kw)) || /\d/.test(pro)) {
          practicalMatches++
        }
      })
      if (practicalMatches > 0) {
        score += practicalMatches * 1
        reasons.push('Has concrete, practical benefits')
      }
    } else if (decisionStyle === 'intuitive') {
      // Boost options with emotional/feeling words
      const emotionalWords = [
        'feel',
        'love',
        'excited',
        'happy',
        'enjoy',
        'passion',
        'fulfilling',
      ]
      let emotionalMatches = 0
      option.pros.forEach((pro) => {
        const proLower = pro.toLowerCase()
        if (emotionalWords.some((kw) => proLower.includes(kw))) {
          emotionalMatches++
        }
      })
      if (emotionalMatches > 0) {
        score += emotionalMatches * 1
        reasons.push('Resonates emotionally')
      }
    } else if (decisionStyle === 'balanced') {
      // Give slight boost to options with both types
      if (prosCount > 2 && consCount > 0) {
        score += 0.5
        reasons.push('Well-rounded perspective')
      }
    }

    // Weight based on Question 4: Timeline
    const timeline = decision.answers.q4
    const timelineBoost = {
      immediate: prosCount > 0 ? 1.5 : 0,
      medium: prosCount + consCount > 0 ? 1 : 0,
      longterm: prosCount > consCount ? 2 : 0,
    }

    score += timelineBoost[timeline] || 0

    return {
      optionIndex: index,
      score: score,
      reasons: reasons,
    }
  })

  // Find winner
  scores.sort((a, b) => b.score - a.score)
  const winner = scores[0]
  const winnerOption = decision.options[winner.optionIndex]

  return {
    winner: winnerOption,
    winnerIndex: winner.optionIndex,
    scores: scores,
    reasons: winner.reasons,
  }
}
