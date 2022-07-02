// Count
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");

// buttons
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const gameContent = document.querySelector(".game-content");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Imagens que irão compor o jogo
const items = [
  { name: "batman", image: "img/batman.png" },
  { name: "wonder", image: "img/wonder.png" },
  { name: "black", image: "img/black.png" },
  { name: "wolverine", image: "img/wolverine.png" },
  { name: "cap", image: "img/cap.png" },
  { name: "thanos", image: "img/thanos.png" },
  { name: "deadpool", image: "img/deadpool.png" },
  { name: "spiderman", image: "img/spiderman.png" },
  { name: "doctor", image: "img/doctor.png" },
  { name: "iron", image: "img/iron.png" },
  { name: "hulk", image: "img/hulk.png" },
  { name: "hawk", image: "img/hawk.png" },
];

let seconds = 0, minutes = 0;
let movesCount = 0, winCount = 0;

// Determinando o tempo
const timeGenerator = () => {

  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

// Contador de movimentos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Card turns:</span>${movesCount}`;
};

// Randomizando os cards do jogo
const randomCards = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Matriz composta pelos cards
const matrixGenerator = (cardValues, size = 4) => {
  gameContent.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContent.innerHTML += `
     <div class="card-content" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  gameContent.style.gridTemplateColumns = `repeat(${size},auto)`;

  // Direcionando o conteudo do game, para que exista cartas parecidas
  cards = document.querySelectorAll(".card-content");
  cards.forEach((card) => {

    // Verificando se após ser clicado é uma carta igual
    card.addEventListener("click", () => {
      if (!card.classList.contains("found")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          
          // Caso as cartas forem iguais
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("found");
            secondCard.classList.add("found");
            firstCard = false;
            winCount += 1;

            // Demonstrando o resultado do jogo
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2> You win! </h2>
            <h4>Card turns: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 700);
          }
        }
      }
    });
  });
};

// Após clicar no botão start 
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Card turns:</span> ${movesCount}`;
  initializer();
});

// Após clicar no botão pare
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

// Ao inicializar o jogo
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = randomCards();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

