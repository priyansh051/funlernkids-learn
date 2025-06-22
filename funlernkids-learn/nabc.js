const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const targetLetterEl = document.getElementById("target-letter");
    const scoreEl = document.getElementById("score");
    const lettersContainer = document.getElementById("letters");

    let score = 0;
    let targetLetter = "A";

    function getRandomLetter() {
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    function updateTarget() {
      targetLetter = getRandomLetter();
      targetLetterEl.textContent = targetLetter;
    }

    function createLetters() {
      lettersContainer.innerHTML = "";
      const randomLetters = [];

      while (randomLetters.length < 12) {
        let letter = getRandomLetter();
        if (!randomLetters.includes(letter)) {
          randomLetters.push(letter);
        }
      }

      if (!randomLetters.includes(targetLetter)) {
        randomLetters[Math.floor(Math.random() * 12)] = targetLetter;
      }

      randomLetters.forEach(letter => {
        const div = document.createElement("div");
        div.classList.add("letter");
        div.textContent = letter;
        div.addEventListener("click", () => {
          if (letter === targetLetter) {
            score++;
            alert("🎉 Correct!");
          } else {
            alert("❌ Try again!");
          }
          scoreEl.textContent = `Score: ${score}`;
          updateTarget();
          createLetters();
        });
        lettersContainer.appendChild(div);
      });
    }

    updateTarget();
    createLetters();

    // Drag Game
    const draggableLetters = document.querySelectorAll('#drag-game .letter');
    const dropTargets = document.querySelectorAll('#drag-game .target');

    draggableLetters.forEach(letter => {
      letter.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', letter.dataset.letter);
        letter.classList.add('dragging');
      });

      letter.addEventListener('dragend', () => {
        letter.classList.remove('dragging');
      });
    });

    dropTargets.forEach(target => {
      target.addEventListener('dragover', e => e.preventDefault());

      target.addEventListener('drop', e => {
        e.preventDefault();
        const dropped = e.dataTransfer.getData('text/plain');
        if (dropped === target.dataset.letter) {
          target.textContent = dropped;
          target.classList.add('correct');
          document.querySelector(`#drag-game .letter[data-letter="${dropped}"]`).remove();
        } else {
          alert("❌ Wrong letter! Try again.");
        }
      });
    });