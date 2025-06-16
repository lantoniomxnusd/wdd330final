import { createCard, shuffle, generateImageCard, generateTextCard } from "./cards.mjs";
import { playConfetti, shakeCards, launchFireworks} from "./animation.js";
import { playCorrectSound,playIncorrectSound, playFireworks, playVictory } from "./audio.mjs";
import { applyTranslation, } from "./translate.mjs";
import { getGif} from "./giphy.mjs";

let allWords = [];
let cards = [];
let flippedCards = [];
let matched = [];
let tries = 0;

async function loadData(){
  const res = await fetch('levels/ourworld-master.json');
  allWords = await res.json();
  populateOptions(); 
}

const savedLang = localStorage.getItem('lang') || 'en';
document.getElementById('languageSelect').value = savedLang;
applyTranslation(savedLang)

document.getElementById('languageSelect').addEventListener('change', (e) => {
  const selectedLang = e.target.value;
  localStorage.setItem('lang', selectedLang);
  applyTranslation(selectedLang);
});

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

  const words = filterWords(mode, selected).sort(()=>0.5 -Math.random()).slice(0,8);

  const imageCards = await Promise.all(
    words.map(item => generateImageCard(item, getGif))
  );

  const textCards = words.map(generateTextCard);

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