const gameTypeScreen = document.getElementById("gameTypeScreen");
const gamePlayScreen = document.getElementById("gamePlayScreen");

const gameTitle = document.getElementById("gameTitle");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedback = document.getElementById("feedback");
const backToGameTypeBtn = document.getElementById("backToGameTypeBtn");
const clickSound = document.getElementById("clickSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

const MAX_LEVELS = 10; // demo levels count

let currentGameType = null;
let currentLevel = 1;
let currentQuestion = null;

const gameData = {
  oddEven: {
    title: "Odd or Even",
    generateQuestion(level) {
      const num = Math.floor(Math.random() * (level * 5)) + 1;
      return {
        question: `Is ${num} Odd or Even?`,
        options: ["Odd", "Even"],
        answer: num % 2 === 0 ? "Even" : "Odd"
      };
    }
  },
  plusMinus: {
    title: "Plus or Minus",
    generateQuestion(level) {
      const a = Math.floor(Math.random() * level) + 1;
      const b = Math.floor(Math.random() * level) + 1;
      const add = Math.random() < 0.5;
      if (add) {
        return {
          question: `What is ${a} + ${b}?`,
          options: [a + b - 1, a + b, a + b + 1],
          answer: a + b
        };
      } else {
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        return {
          question: `What is ${max} - ${min}?`,
          options: [max - min, max - min + 1, max - min - 1],
          answer: max - min
        };
      }
    }
  },
  comparison: {
    title: "Comparison",
    generateQuestion(level) {
      const a = Math.floor(Math.random() * (level * 5)) + 1;
      const b = Math.floor(Math.random() * (level * 5)) + 1;
      return {
        question: `Which number is bigger? ${a} or ${b}?`,
        options: [a, b],
        answer: a > b ? a : b
      };
    }
  },
  sequence: {
    title: "Sequence",
    generateQuestion(level) {
      const start = Math.floor(Math.random() * (level * 3)) + 1;
      const step = 1;
      const missingIndex = 2;
      const sequence = [];
      for(let i=0; i<5; i++){
        sequence.push(start + i*step);
      }
      const displaySequence = sequence.map((num,i) => i === missingIndex ? "__" : num).join(", ");
      const answer = sequence[missingIndex];
      const options = [answer - 1, answer, answer + 1];
      return {
        question: `What number comes next? ${displaySequence}`,
        options,
        answer
      };
    }
  },
  counting: {
    title: "Counting Objects",
    generateQuestion(level) {
      const count = Math.floor(Math.random() * (level * 3)) + 1;
      const objs = "🔵".repeat(count);
      const options = [count - 1, count, count + 1].filter(n => n > 0);
      return {
        question: `How many blue circles? ${objs}`,
        options,
        answer: count
      };
    }
  },
  biggerNumber: {
    title: "Bigger Number",
    generateQuestion(level) {
      const nums = [];
      for(let i=0; i<3; i++) {
        nums.push(Math.floor(Math.random() * (level * 5)) + 1);
      }
      const answer = Math.max(...nums);
      return {
        question: `Click the biggest number`,
        options: nums,
        answer
      };
    }
  }
};

// Expand/Collapse levels inside a game type box
document.querySelectorAll(".game-type-box").forEach(box => {
  const levelContainer = box.querySelector(".level-buttons");
  
  // Create level buttons once
  for(let i=1; i<=MAX_LEVELS; i++) {
  const lvlBtn = document.createElement("button");
  lvlBtn.textContent = i;
  lvlBtn.onclick = (e) => {
    e.stopPropagation();
    clickSound.play().catch(() => {}); // Play click sound
    startGamePlay(box.dataset.type, i);
  };
  levelContainer.appendChild(lvlBtn);
}
  
  // Toggle expand/collapse on box click
  box.addEventListener("click", () => {
    const isExpanded = box.classList.contains("expanded");
    // Close all expanded boxes
    document.querySelectorAll(".game-type-box.expanded").forEach(b => b.classList.remove("expanded"));
    if (!isExpanded) {
      box.classList.add("expanded");
    }
  });
});

function startGamePlay(gameType, level) {
  currentGameType = gameType;
  currentLevel = level;

  gameTypeScreen.classList.remove("active");
  gamePlayScreen.classList.add("active");

  gameTitle.textContent = `${gameData[gameType].title} - Level ${level}`;
  loadQuestion();
  feedback.textContent = "";
}

function loadQuestion() {
  const qData = gameData[currentGameType].generateQuestion(currentLevel);
  currentQuestion = qData;

  questionText.textContent = qData.question;
  optionsContainer.innerHTML = "";

  qData.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if(selected === currentQuestion.answer) {
    correctSound.play().catch(() => {});
    feedback.style.color = "green";
    feedback.textContent = "✅ Correct!";
    setTimeout(() => {
      loadQuestion();
      feedback.textContent = "";
    }, 1500);
  } else {
    wrongSound.play().catch(() => {});
    feedback.style.color = "red";
    feedback.textContent = "❌ Try Again!";
  }
}

// Back to main screen button
backToGameTypeBtn.onclick = () => {
  gamePlayScreen.classList.remove("active");
  gameTypeScreen.classList.add("active");
};
