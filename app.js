// Data structure
let decision = {
  name: "",
  options: [],
  answers: {},
  result: null,
};

let optionCount = 2;

// Load saved decision on page load
window.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
});

// Add additional option input
function addOption() {
  optionCount++;
  const container = document.getElementById("additional-options");
  const div = document.createElement("div");
  div.className = "form-group";
  div.innerHTML = `
                <label for="option${optionCount}">Option ${optionCount}</label>
                <input type="text" id="option${optionCount}" placeholder="e.g., Option ${optionCount}">
            `;
  container.appendChild(div);
}

// Navigation functions
function goToStep(step) {
  // Hide all sections
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));

  // Show target section
  document.getElementById(`step-${step}`).classList.add("active");

  // Update progress bar
  updateProgressBar(step);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgressBar(currentStep) {
  document.querySelectorAll(".progress-step").forEach((step) => {
    const stepNum = parseInt(step.dataset.step);
    step.classList.remove("active", "completed");

    if (stepNum < currentStep) {
      step.classList.add("completed");
    } else if (stepNum === currentStep) {
      step.classList.add("active");
    }
  });
}

function goToStep2() {
  // Collect decision name and options
  const decisionName = document
    .getElementById("decision-name")
    .value.trim();
  if (!decisionName) {
    alert("Please enter a decision name");
    return;
  }

  // Collect all options
  const options = [];
  for (let i = 1; i <= optionCount; i++) {
    const optionInput = document.getElementById(`option${i}`);
    if (optionInput) {
      const value = optionInput.value.trim();
      if (value) {
        options.push({
          name: value,
          pros: [],
          cons: [],
        });
      }
    }
  }

  if (options.length < 2) {
    alert("Please enter at least 2 options to compare");
    return;
  }

  decision.name = decisionName;
  decision.options = options;

  renderProsCons();
  goToStep(2);
  saveToStorage();
}

function renderProsCons() {
  const container = document.getElementById("options-container");
  container.innerHTML = "";

  decision.options.forEach((option, index) => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.innerHTML = `
                    <h3>${option.name}</h3>
                    
                    <div class="pros-cons">
                        <h4>✓ Pros</h4>
                        <div id="pros-${index}"></div>
                        <button class="add-item-btn" onclick="addProCon(${index}, 'pros')">+ Add Pro</button>
                    </div>
                    
                    <div class="pros-cons">
                        <h4>✗ Cons</h4>
                        <div id="cons-${index}"></div>
                        <button class="add-item-btn" onclick="addProCon(${index}, 'cons')">+ Add Con</button>
                    </div>
                `;
    container.appendChild(card);

    // Render existing pros and cons
    renderProConList(index, "pros");
    renderProConList(index, "cons");
  });
}

function renderProConList(optionIndex, type) {
  const container = document.getElementById(`${type}-${optionIndex}`);
  const items = decision.options[optionIndex][type];

  container.innerHTML = items
    .map(
      (item, itemIndex) => `
                <div class="list-item">
                    <input type="text" value="${item}" 
                           onchange="updateProCon(${optionIndex}, '${type}', ${itemIndex}, this.value)"
                           placeholder="Enter ${type === "pros" ? "advantage" : "disadvantage"}">
                    <button class="remove-btn" onclick="removeProCon(${optionIndex}, '${type}', ${itemIndex})">×</button>
                </div>
            `,
    )
    .join("");
}

function addProCon(optionIndex, type) {
  decision.options[optionIndex][type].push("");
  renderProConList(optionIndex, type);
  saveToStorage();
}

function updateProCon(optionIndex, type, itemIndex, value) {
  decision.options[optionIndex][type][itemIndex] = value;
  saveToStorage();
}

function removeProCon(optionIndex, type, itemIndex) {
  decision.options[optionIndex][type].splice(itemIndex, 1);
  renderProConList(optionIndex, type);
  saveToStorage();
}

function goToStep3() {
  // Validate that at least one option has pros or cons
  const hasContent = decision.options.some(
    (opt) =>
      opt.pros.some((p) => p.trim()) || opt.cons.some((c) => c.trim()),
  );

  if (!hasContent) {
    alert("Please add at least some pros or cons before continuing");
    return;
  }

  goToStep(3);
}

function updateRadioSelection(radio) {
  // Update visual selection
  const parent = radio.closest(".radio-group");
  parent.querySelectorAll(".radio-option").forEach((opt) => {
    opt.classList.remove("selected");
  });
  radio.closest(".radio-option").classList.add("selected");

  // Save answer
  decision.answers[radio.name] = radio.value;
  saveToStorage();
}

function calculateAndShowResult() {
  // Validate all questions answered
  if (
    !decision.answers.q1 ||
    !decision.answers.q2 ||
    !decision.answers.q3 ||
    !decision.answers.q4
  ) {
    alert("Please answer all 4 questions before continuing");
    return;
  }

  const result = calculateDecision();
  decision.result = result;

  displayResult(result);
  goToStep(4);
  saveToStorage();
}

function calculateDecision() {
  const scores = decision.options.map((option, index) => {
    let score = 0;
    const reasons = [];

    // Base score: count of pros minus cons
    const prosCount = option.pros.filter((p) => p.trim()).length;
    const consCount = option.cons.filter((c) => c.trim()).length;
    score = prosCount - consCount;

    // Weight based on Question 1: What's most important
    const q1Keywords = {
      growth: [
        "learn",
        "grow",
        "challenge",
        "new",
        "opportunity",
        "develop",
        "experience",
        "skill",
        "advance",
        "expand",
        "improve",
      ],
      stability: [
        "stable",
        "secure",
        "safe",
        "establish",
        "reliable",
        "proven",
        "consistent",
        "predictable",
        "steady",
        "certain",
      ],
      lifestyle: [
        "flexible",
        "balance",
        "time",
        "freedom",
        "autonomy",
        "independent",
        "personal",
        "leisure",
        "enjoy",
        "comfort",
        "convenient",
      ],
      financial: [
        "money",
        "cost",
        "price",
        "salary",
        "pay",
        "compensation",
        "bonus",
        "benefit",
        "save",
        "savings",
        "afford",
        "expensive",
        "cheap",
        "budget",
      ],
      relationships: [
        "people",
        "friends",
        "family",
        "community",
        "social",
        "team",
        "together",
        "connection",
        "network",
        "support",
        "belong",
      ],
      impact: [
        "help",
        "make a difference",
        "contribute",
        "purpose",
        "meaning",
        "important",
        "matter",
        "change",
        "impact",
        "legacy",
        "mission",
      ],
    };

    const priority = decision.answers.q1;
    const keywords = q1Keywords[priority] || [];

    let priorityMatches = 0;
    option.pros.forEach((pro) => {
      const proLower = pro.toLowerCase();
      if (keywords.some((kw) => proLower.includes(kw))) {
        priorityMatches++;
      }
    });

    if (priorityMatches > 0) {
      score += priorityMatches * 2.5;
      const priorityLabels = {
        growth: "growth & opportunity",
        stability: "stability & security",
        lifestyle: "lifestyle & freedom",
        financial: "financial value",
        relationships: "relationships & community",
        impact: "impact & purpose",
      };
      reasons.push(`Aligns with your priority: ${priorityLabels[priority]}`);
    }

    // Weight based on Question 2: Change tolerance
    const changeLevel = decision.answers.q2;
    const changeKeywords = {
      high: [
        "new",
        "innovative",
        "adventure",
        "exciting",
        "unique",
        "different",
        "bold",
        "fresh",
      ],
      low: [
        "established",
        "traditional",
        "familiar",
        "proven",
        "reliable",
        "safe",
        "standard",
      ],
      medium: [
        "balanced",
        "moderate",
        "growing",
        "developing",
        "evolving",
      ],
    };

    const changeWords = changeKeywords[changeLevel] || [];
    let changeMatches = 0;
    option.pros.forEach((pro) => {
      const proLower = pro.toLowerCase();
      if (changeWords.some((kw) => proLower.includes(kw))) {
        changeMatches++;
      }
    });

    if (changeMatches > 0) {
      score += changeMatches * 1.5;
      const changeLevelLabel = {
        high: "openness to change",
        low: "preference for stability",
        medium: "balanced approach",
      };
      reasons.push(`Matches your ${changeLevelLabel[changeLevel]}`);
    }

    // Weight based on Question 3: Decision style
    const decisionStyle = decision.answers.q3;
    if (decisionStyle === "practical") {
      // Boost options with more concrete, specific pros
      const specificWords = [
        "save",
        "cost",
        "increase",
        "decrease",
        "faster",
        "closer",
        "larger",
        "better",
      ];
      let practicalMatches = 0;
      option.pros.forEach((pro) => {
        const proLower = pro.toLowerCase();
        if (
          specificWords.some((kw) => proLower.includes(kw)) ||
          /\d/.test(pro)
        ) {
          practicalMatches++;
        }
      });
      if (practicalMatches > 0) {
        score += practicalMatches * 1;
        reasons.push("Has concrete, practical benefits");
      }
    } else if (decisionStyle === "intuitive") {
      // Boost options with emotional/feeling words
      const emotionalWords = [
        "feel",
        "love",
        "excited",
        "happy",
        "enjoy",
        "passion",
        "fulfilling",
      ];
      let emotionalMatches = 0;
      option.pros.forEach((pro) => {
        const proLower = pro.toLowerCase();
        if (emotionalWords.some((kw) => proLower.includes(kw))) {
          emotionalMatches++;
        }
      });
      if (emotionalMatches > 0) {
        score += emotionalMatches * 1;
        reasons.push("Resonates emotionally");
      }
    } else if (decisionStyle === "balanced") {
      // Give slight boost to options with both types
      if (prosCount > 2 && consCount > 0) {
        score += 0.5;
        reasons.push("Well-rounded perspective");
      }
    }

    // Weight based on Question 4: Timeline
    const timeline = decision.answers.q4;
    const timelineBoost = {
      immediate: prosCount > 0 ? 1.5 : 0,
      medium: prosCount + consCount > 0 ? 1 : 0,
      longterm: prosCount > consCount ? 2 : 0,
    };

    score += timelineBoost[timeline] || 0;

    return {
      optionIndex: index,
      score: score,
      reasons: reasons,
    };
  });

  // Find winner
  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0];
  const winnerOption = decision.options[winner.optionIndex];

  return {
    winner: winnerOption,
    winnerIndex: winner.optionIndex,
    scores: scores,
    reasons: winner.reasons,
  };
}

function displayResult(result) {
  document.getElementById("winner-name").textContent = result.winner.name;
  document.getElementById("winner-subtitle").textContent =
    `This option best aligns with what matters to you`;

  // Explanation
  const explanation = document.getElementById("explanation-text");
  let explanationHTML = "<p><strong>Here's why:</strong></p>";

  if (result.reasons.length > 0) {
    explanationHTML += '<ul style="margin-left: 20px; line-height: 2;">';
    result.reasons.forEach((reason) => {
      explanationHTML += `<li>${reason}</li>`;
    });
    explanationHTML += "</ul>";
  }

  const prosCount = result.winner.pros.filter((p) => p.trim()).length;
  const consCount = result.winner.cons.filter((c) => c.trim()).length;

  explanationHTML += `<p>This option has <strong>${prosCount} pros</strong> and <strong>${consCount} cons</strong>. `;

  if (prosCount > consCount) {
    explanationHTML +=
      "The advantages clearly outweigh the disadvantages.";
  } else {
    explanationHTML +=
      "While the numbers are close, it aligns better with your stated priorities.";
  }
  explanationHTML += "</p>";

  explanation.innerHTML = explanationHTML;

  // Score comparison
  const scoreContainer = document.getElementById("score-comparison");
  scoreContainer.innerHTML = result.scores
    .map((s) => {
      const opt = decision.options[s.optionIndex];
      return `
                    <div class="score-item">
                        <div class="option-name">${opt.name}</div>
                        <div class="score">${s.score.toFixed(1)}</div>
                    </div>
                `;
    })
    .join("");
}

function startOver() {
  if (
    confirm(
      "Are you sure you want to start a new decision? Current data will be cleared.",
    )
  ) {
    decision = {
      name: "",
      options: [],
      answers: {},
      result: null,
    };
    optionCount = 2;

    // Clear inputs
    document.getElementById("decision-name").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("additional-options").innerHTML = "";

    // Clear radio selections
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.checked = false;
      radio.closest(".radio-option")?.classList.remove("selected");
    });

    saveToStorage();
    goToStep(1);
  }
}

// LocalStorage functions
function saveToStorage() {
  try {
    localStorage.setItem("decision", JSON.stringify(decision));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("decision");
    if (saved) {
      decision = JSON.parse(saved);

      // Restore step 1 inputs
      if (decision.name) {
        document.getElementById("decision-name").value = decision.name;
      }

      if (decision.options.length > 0) {
        // Restore options
        decision.options.forEach((opt, i) => {
          if (i < 2) {
            const input = document.getElementById(`option${i + 1}`);
            if (input) input.value = opt.name;
          } else {
            addOption();
            document.getElementById(`option${i + 1}`).value = opt.name;
          }
        });
        optionCount = decision.options.length;
      }

      // Restore radio selections
      Object.keys(decision.answers).forEach((q) => {
        const radio = document.querySelector(
          `input[name="${q}"][value="${decision.answers[q]}"]`,
        );
        if (radio) {
          radio.checked = true;
          radio.closest(".radio-option")?.classList.add("selected");
        }
      });
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }
}
