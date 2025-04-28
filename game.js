const flags = [
  {
    country: "France",
    image: "https://flagcdn.com/w320/fr.png"
  },
  {
    country: "Japan",
    image: "https://flagcdn.com/w320/jp.png"
  },
  {
    country: "Brazil",
    image: "https://flagcdn.com/w320/br.png"
  },
  {
    country: "Germany",
    image: "https://flagcdn.com/w320/de.png"
  },
  {
    country: "Canada",
    image: "https://flagcdn.com/w320/ca.png"
  },
  {
    country: "India",
    image: "https://flagcdn.com/w320/in.png"
  }
];

let currentFlag = null;
let score = 0;
let timerInterval;
let timeLimit = 10; // seconds
let timeLeft = timeLimit;

const flagImage = document.getElementById('flagImage');
const optionsContainer = document.getElementById('optionsContainer');
const resultText = document.getElementById('resultText');
const scoreText = document.getElementById('scoreText');
const nextBtn = document.getElementById('nextBtn');
const timerFill = document.getElementById('timerFill');

function getRandomFlag() {
  const randomIndex = Math.floor(Math.random() * flags.length);
  return flags[randomIndex];
}

function generateOptions(correctCountry, difficulty) {
  const numOptions = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const options = new Set([correctCountry]);
  while (options.size < numOptions) {
    const random = flags[Math.floor(Math.random() * flags.length)].country;
    options.add(random);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

function startTimer() {
  stopTimer();
  timeLeft = timeLimit;
  timerFill.style.width = "100%";

  timerInterval = setInterval(() => {
    timeLeft--;
    const percentage = (timeLeft / timeLimit) * 100;
    timerFill.style.width = `${percentage}%`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function handleTimeout() {
  resultText.textContent = `⏰ Time's up! The correct answer was ${currentFlag.country}`;
  resultText.style.color = "orange";
  scoreText.textContent = `Score: ${score}`;
  nextBtn.style.display = 'inline-block';

  Array.from(optionsContainer.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === currentFlag.country) {
      btn.style.backgroundColor = '#28a745';
    } else {
      btn.style.backgroundColor = '#6c757d';
    }
  });
}

function handleGuess(selectedCountry) {
  stopTimer();
  const correct = selectedCountry === currentFlag.country;
  if (correct) {
    score++;
    resultText.textContent = `🎉 Correct! It's ${currentFlag.country}`;
    resultText.style.color = "green";
  } else {
    resultText.textContent = `❌ Wrong! It was ${currentFlag.country}`;
    resultText.style.color = "red";
  }

  scoreText.textContent = `Score: ${score}`;
  nextBtn.style.display = 'inline-block';

  Array.from(optionsContainer.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === currentFlag.country) {
      btn.style.backgroundColor = '#28a745';
    } else if (btn.textContent === selectedCountry) {
      btn.style.backgroundColor = '#dc3545';
    } else {
      btn.style.backgroundColor = '#6c757d';
    }
  });
}

function renderFlag() {
  const difficulty = document.getElementById('difficulty').value;
  currentFlag = getRandomFlag();
  flagImage.src = currentFlag.image;

  const options = generateOptions(currentFlag.country, difficulty);
  optionsContainer.innerHTML = '';
  options.forEach(country => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = country;
    btn.onclick = () => handleGuess(country);
    optionsContainer.appendChild(btn);
  });

  resultText.textContent = '';
  nextBtn.style.display = 'none';
  startTimer();
}

document.getElementById('difficulty').addEventListener('change', renderFlag);
nextBtn.addEventListener('click', renderFlag);

renderFlag();
