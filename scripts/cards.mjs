export function createCard(cardData, index){
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.word = cardData.word;
    card.dataset.index = index;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('front');

    if (cardData.type =='image'){
        const img = document.createElement('img');
        img.src = cardData.content;
        img.alt = cardData.word;
        front.appendChild(img);
    }else {
        front.textContent = cardData.content;
    }

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = '?';

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
}