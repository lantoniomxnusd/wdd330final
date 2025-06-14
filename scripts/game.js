import { createCard, shuffle } from "./cards.mjs";

const cardElement = createCard({type:'text', content: 'Dog', word: 'dog'}, 0);
document.getElementById('gameBoard').appendChild(cardElement);

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

