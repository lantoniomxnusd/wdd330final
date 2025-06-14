import { createCard, shuffle } from "./cards.mjs";

let allWords = [];

async function loadData(){
  const res = await fetch('levels/ourworld-master.json');
  allWords = await res.json();
}

function filterWords(mode,selected){
  if (mode === 'unit'){
    const [level,unit] = selected.match(/\d+/g);
    return allWords.filter(word => word.level === selected && word.unit === unit);
  }else {
    return allWords.filter(word => word.category === selected);
  }
}

const cardElement = createCard({type:'text', content: 'Dog', word: 'dog'}, 0);
document.getElementById('gameBoard').appendChild(cardElement);

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

