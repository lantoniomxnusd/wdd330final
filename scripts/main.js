import { createCard, shuffle, generateImageCard, generateTextCard } from "./cards.mjs";
import { playConfetti, launchFireworks} from "./animation.js";
import { playCorrectSound,playIncorrectSound, playFireworks, playVictory } from "./audio.mjs";
import { applyTranslation, } from "./translate.mjs";
import { getGif} from "./giphy.mjs";

let allWords = [];
let cards = [];
let flippedCards = [];
let matched = [];
let tries = 0;


// This function fetches Json vocabulary data from the ourworld-master.json file in levels folder.
async function loadData(){
  const res = await fetch('levels/ourworld-master.json');
  allWords = await res.json();
  populateOptions(); 
}

// This function loads the saved language preference from the local storage
const savedLang = localStorage.getItem('lang') || 'en';
document.getElementById('languageSelect').value = savedLang;
applyTranslation(savedLang)


// This saves the language changes from the user
document.getElementById('languageSelect').addEventListener('change', (e) => {
  const selectedLang = e.target.value;
  localStorage.setItem('lang', selectedLang);
  applyTranslation(selectedLang);
});

// This function filters the words by unit or category
function filterWords(mode,selected){
  if (mode === 'unit'){
    const [level,unit] = selected.match(/\d+/g);
    return allWords.filter(word => word.level === level && word.unit === unit);
  }else {
    return allWords.filter(word => word.category === selected);
  }
}


// This function sets up the games. 
async function setupGame(){
  // stopFireworks();
  const mode = document.getElementById('mode').value;
  const selected = document.getElementById('optionSelect').value;

  const words = filterWords(mode, selected).sort(()=>0.5 -Math.random()).slice(0,6);

// This uses the generateImageCard function to generate an image card
  const imageCards = await Promise.all(
    words.map(item => generateImageCard(item, getGif))
  );

// This does the same but for a text card using generateTextCard
  const textCards = words.map(generateTextCard);

  // this uses the shuffle function to shuffle the cards
  cards = shuffle ([...imageCards, ...textCards]);


  // This resets the game for clean gameboard
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  flippedCards = [];
  matched = [];
  tries = 0;

// This displays the reset tries
  document.getElementById('tries').textContent = tries;

  // this attaches the textcards and the image cars to the board
  cards.forEach((cardData, index) => {
    const cardElement = createCard(cardData, index);
    cardElement.addEventListener('click', () => handleCardClick(cardElement));
    board.appendChild(cardElement);
  })
}

// This function populates the select options for mode and unit/category
function populateOptions(){
  const mode = document.getElementById('mode').value;
  const optionSelect = document.getElementById('optionSelect');
  optionSelect.innerHTML = '';

  // Creae a list of unique values for example "level 1 Unit one " 1-1 or by category
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

  // creates option elements for each unique value (cat/unit)
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


// This handles the flipping of the cards
function handleCardClick(card){
  if (
    flippedCards.length == 2 ||
    card.classList.contains('flipped') ||
    matched.includes(card.dataset.index)
  ) return;

  // creates the flipped class 
  card.classList.add('flipped');
  flippedCards.push(card);

  // when the two cards are flipped they are compared
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

// If all the cards are matched, celebrate and show "play again"
      if (matched.length === cards.length){
        console.log("Game Complete");
        launchFireworks();
        playVictory();
        playFireworks();
        document.getElementById('playAgainBtn').classList.remove('hidden');
      }
      // If they dont match, play playCorrectSound, unflip the 2 cards
    }else {
        // shakeCards(card1, card2);
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

document.getElementById('instructionsCurtain').addEventListener('click', () => {
  const instructions = document.querySelector('.instructions');
  instructions.classList.toggle('hidden');
});

loadData();


// document.getElementById('testFireworksBtn').addEventListener('click', () => {
//   launchFireworks();
// });