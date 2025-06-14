import { createCard, shuffle } from "./cards.mjs";

let allWords = [];

async function loadData(){
  const res = await fetch('levels/ourworld-master.json');
  allWords = await res.json();
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

  const cards = shuffle ([...imageCards, ...textCards]);

  const board = document.getElementById('gameBoard');
  board.innerHTML = '';

  cards.forEach((cardData, index) => {
    const cardElement = createCard(cardData, index);
    board.appendChild(cardElement);
  })
}

document.getElementById('startGame').addEventListener('click', setupGame);

loadData();
