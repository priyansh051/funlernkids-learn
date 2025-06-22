// script.js

// Sound functions
function playCorrectSound() {
  const correct = document.getElementById("correctSound");
  if (correct) correct.play();
}

function playWrongSound() {
  const wrong = document.getElementById("wrongSound");
  if (wrong) wrong.play();
}

// Main game types click handler
const boxes = document.querySelectorAll(".game-type-box");
const gameArea = document.getElementById("gamePlayArea");
const backBtn = document.getElementById("backToTypesBtn");
const grid = document.getElementById("gameTypesGrid");
const gameContainer = document.getElementById("gameContainer");

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    const type = box.getAttribute("data-type");
    grid.style.display = "none";
    gameArea.style.display = "block";
    startGame(type);
  });
});

backBtn.addEventListener("click", () => {
  grid.style.display = "grid";
  gameArea.style.display = "none";
  gameContainer.innerHTML = "";
});

function startGame(type) {
  if (type === "missingLetter") missingLetterGame();
  else gameContainer.innerHTML = `<p style="font-size: 1.2rem;">Game: ${type.replace(/([A-Z])/g, ' $1')}</p><p>Coming Soon!</p>`;
}

// MISSING LETTER GAME WITH LEVELS, STARS, PROGRESS BAR
let currentLevel = 1;
let score = 0;
const maxLevel = 10;
const questionsPerLevel = 10;
let currentCorrectChar = '';
let usedWordsThisLevel = [];
let unlockedLevel = window.userGameProgress?.unlockedLevel || 1;

const wordLevels = {
  1: ["CAT", "DOG", "EGG", "ANT", "EYE", "COW", "PIG", "OWL", "RAT", "HEN",],
  2: ["APPLE", "BALL", "GOAT", "FISH", "LION", "BIRD", "DUCK", "BEAR", "FROG", "WOLF"],
  3: ["MONKEY", "DONKEY", "GIRAFFE", "ELEPHANT", "RABBIT", "TIGER", "ZEBRA", "HORSE", "SNAKE", "MOUSE"],
  4: ["CROCODILE", "ALLIGATOR", "HIPPOPOTAMUS", "KANGAROO", "DOLPHIN", "CHEETAH", "PORCUPINE", "BUFFALO", "PELICAN", "OSTRICH"],
  5: ["PENGUIN", "ARMADILLO", "CHAMELEON", "ANTELOPE", "WALRUS", "WOODPECKER", "FLAMINGO", "MEERKAT", "OTTER", "BEETLE"],
  6: ["RHINOCEROS", "CATERPILLAR", "BUTTERFLY", "CORMORANT", "PRAIRIEDOG", "HEDGEHOG", "SQUIRREL", "OPOSSUM", "CHIMPANZEE", "WOMBAT"],
  7: ["ORNITHOLOGY", "MICROBIOLOGY", "PSYCHOLOGY", "ARCHAEOLOGY", "ENTOMOLOGY", "PALEONTOLOGY", "HYDROLOGY", "ZOOLOGY", "TOXICOLOGY", "MYCOLOGY"],
  8: ["PHILOSOPHICAL", "METAMORPHOSIS", "PSYCHOTHERAPY", "NEUROSCIENCE", "BIOCHEMISTRY", "ASTRONOMY", "GEOPHYSICS", "IMMUNOLOGY", "ANATOMICAL", "GENETICIST"],
  9: ["HIPPOCAMPUS", "SUPERCALIFRAGILISTIC", "PSYCHOPHYSIOLOGY", "MICROECONOMICS", "NEUROTRANSMITTER", "PARALLELOGRAM", "MISUNDERSTANDING", "COUNTERCLOCKWISE", "HYPOTHALAMUS", "CONSCIOUSNESS"],
  10:["ELECTROENCEPHALOGRAPHY", "THERMODYNAMICS", "HYDROELECTRICITY", "PHOTOLUMINESCENCE", "QUANTUMMECHANICS", "MAGNETOHYDRODYNAMICS", "PSYCHONEUROIMMUNOLOGY", "BIOLUMINESCENCE", "PARASITOLOGY", "CRYPTOGRAPHY"]
};

function missingLetterGame() {
  score = 0;
  currentLevel = 1;
  usedWordsThisLevel = [];
  showLevelSelection();
}

function showLevelSelection() {
  let html = `<h2>Select a Level</h2><div class="level-grid">`;
  for (let i = 1; i <= maxLevel; i++) {
    const locked = i > unlockedLevel;
    html += `<div class="level-box ${locked ? 'locked' : ''}" data-level="${i}" title="${locked ? 'Locked. Pass previous level to unlock.' : 'Play Level ' + i}">
      ${locked ? '🔒' : '⭐ Level ' + i}
    </div>`;
  }
  html += `</div>`;
  gameContainer.innerHTML = html;

  document.querySelectorAll(".level-box").forEach((box) => {
    box.addEventListener("click", () => {
      const level = parseInt(box.getAttribute("data-level"));
      if (level > unlockedLevel) {
        alert("You must pass the previous level to unlock this one.");
        return;
      }
      currentLevel = level;
      score = 0;
      usedWordsThisLevel = [];
      askQuestion();
    });
  });
}

function askQuestion() {
  const words = wordLevels[currentLevel] || wordLevels[1];
  const availableWords = words.filter(w => !usedWordsThisLevel.includes(w));
  if (availableWords.length === 0) usedWordsThisLevel = [];

  const word = availableWords[Math.floor(Math.random() * availableWords.length)];
  usedWordsThisLevel.push(word);

  const missingIndex = Math.floor(Math.random() * word.length);
  currentCorrectChar = word[missingIndex];
  const displayed = word.substring(0, missingIndex) + "_" + word.substring(missingIndex + 1);

  gameContainer.innerHTML = `
    <h2>Missing Letter - Level ${currentLevel}</h2>
    <div class="progress-wrapper">
      <div class="progress-bar" id="progressBar"></div>
    </div>
    <p>Question ${usedWordsThisLevel.length} of ${questionsPerLevel}</p>
    <p>Score to pass: ${questionsPerLevel}. Current score: ${score}</p>
    <p style="font-size: 2rem; letter-spacing: 8px;">${displayed}</p>
    <input type="text" id="guessInput" maxlength="1" style="padding: 10px; font-size: 1.5rem; text-transform: uppercase;" autofocus>
    <button id="submitBtn" style="padding: 10px 20px; font-size: 1rem; margin-left: 10px;">Submit</button>
    <p id="feedback" style="font-size: 1.2rem; margin-top: 15px;"></p>
  `;

  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('feedback');
  const input = document.getElementById('guessInput');
  const progressBar = document.getElementById('progressBar');

  submitBtn.addEventListener('click', () => {
    const userGuess = input.value.toUpperCase();
    if (!userGuess) {
      feedback.textContent = 'Please enter a letter.';
      feedback.style.color = 'red';
      return;
    }

    if (userGuess === currentCorrectChar) {
      score++;
      feedback.textContent = `✅ Correct! Score: ${score}`;
      feedback.style.color = 'green';
      playCorrectSound();
    } else {
      feedback.textContent = `❌ Wrong! The correct letter was '${currentCorrectChar}'. Score: ${score}`;
      feedback.style.color = 'red';
      playWrongSound();
    }

    if (progressBar) {
      const percent = (score / questionsPerLevel) * 100;
      progressBar.style.width = `${percent}%`;
    }

    input.disabled = true;
    submitBtn.disabled = true;

    setTimeout(() => {
      if (usedWordsThisLevel.length >= questionsPerLevel) {
        if (score >= questionsPerLevel) {
          alert(`🎉 Great job! You passed Level ${currentLevel}`);
          unlockedLevel = Math.max(unlockedLevel, currentLevel + 1);
          window.userGameProgress.unlockedLevel = unlockedLevel;
          window.userGameProgress.score = score;
        } else {
          alert(`😕 You scored ${score}/10. Please try again to pass Level ${currentLevel}`);
        }
        showLevelSelection();
      } else {
        askQuestion();
      }
    }, 1500);
  });
}
