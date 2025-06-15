import { createCard, shuffle } from "./cards.mjs";
import { playConfetti, shakeCards, launchFireworks} from "./animation.js";
import { playCorrectSound,playIncorrectSound, playFireworks, playVictory } from "./audio.mjs";
import { translateText } from "./translate.mjs";

let allWords = [];
let cards = [];
let flippedCards = [];
let matched = [];
let tries = 0;

const defaultTexts = {
  instructions: "Welcome to the Card Match Game! This game is sectioned by Category and Our World. Use Our world for homework assignments. Use Category for random practice.",
  mode: "Mode:",
  choose: "Choose",
  tries: "Tries: "
};

document.getElementById('languageSelect').addEventListener('change', async (e) => {
  const lang = e.target.value;

  const elements = {
    instructionsText: 'instructions',
    modeLabel: 'mode',
    chooseLabel: 'choose',
    // triesLabel: 'triesLabel'
  };

  for (const [id,key] of Object.entries(elements)){
    const el = document.getElementById(id);
    if (!el) continue;
    
    if(lang === 'en'){
      el.textContent = defaultTexts[key];
    } else {
      const translated = await translateText(defaultTexts[key], lang);
      el.textContent = translated.translatedText;
    }
  }
});

async function loadData(){
  const res = await fetch('levels/ourworld-master.json');
  allWords = await res.json();
  populateOptions(); 
}

function filterWords(mode,selected){
  if (mode === 'unit'){
    const [level,unit] = selected.match(/\d+/g);
    return allWords.filter(word => word.level === level && word.unit === unit);
  }else {
    return allWords.filter(word => word.category === selected);
  }
}



async function setupGame(){
  // stopFireworks();
  const mode = document.getElementById('mode').value;
  const selected = document.getElementById('optionSelect').value;

  const words = filterWords(mode, selected);

  const imageCards = words.map(item => ({
    type: 'image', 
    content: item.image,
    word: item.word
  }))

  const textCards = words.map(item => ({
    type: 'text',
    content: item.word,
    word: item.word
  }));

  cards = shuffle ([...imageCards, ...textCards]);

  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  flippedCards = [];
  matched = [];
  tries = 0;
  document.getElementById('tries').textContent = tries;

  cards.forEach((cardData, index) => {
    const cardElement = createCard(cardData, index);
    cardElement.addEventListener('click', () => handleCardClick(cardElement));
    board.appendChild(cardElement);
  })
}

function populateOptions(){
  const mode = document.getElementById('mode').value;
  const optionSelect = document.getElementById('optionSelect');
  optionSelect.innerHTML = '';

    const unique = allWords.reduce((acc, word) => {
      let key;

      if (mode === 'unit') {
        key = `${word.level}-${word.unit}`;
      }else{
        key = word.category;
      }

      if (!acc.includes(key)){
        acc.push(key)
      }

      return acc;
  }, []);

  unique.forEach(value=> {
    const option = document.createElement('option');
    option.value = value;

    if (mode === 'unit'){
      const [level, unit] = value.split('-');
      option.textContent = `Level ${level} Unit ${unit}`;
    } else {
      option.textContent = value [0].toUpperCase() + value.slice(1);
    }

    optionSelect.appendChild(option);
  });
}

function handleCardClick(card){
  if (
    flippedCards.length == 2 ||
    card.classList.contains('flipped') ||
    matched.includes(card.dataset.index)
  ) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length ===2) {
    tries ++;
    document.getElementById('tries').textContent = tries;

    const [card1, card2] = flippedCards;
    const word1 = card1.dataset.word;
    const word2 = card2.dataset.word;

    if (word1 === word2){
      matched.push(card1.dataset.index, card2.dataset.index);
      playConfetti();
      playCorrectSound();
      flippedCards = [];


      if (matched.length === cards.length){
        console.log("Game Complete");
        launchFireworks();
        playVictory();
        playFireworks();
        document.getElementById('playAgainBtn').classList.remove('hidden');
      }
    }else {
        shakeCards(card1, card2);
        playIncorrectSound();
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
      }, 750);
    } 
  }   
}


document.getElementById('mode').addEventListener('change', populateOptions);
document.getElementById('startGame').addEventListener('click', setupGame);

document.getElementById('playAgainBtn').addEventListener('click', () => {
  document.getElementById('playAgainBtn').classList.add('hidden');
  setupGame();
});

loadData();


// document.getElementById('testFireworksBtn').addEventListener('click', () => {
//   launchFireworks();
// });