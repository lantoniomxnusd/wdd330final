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


    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);

    return card;
}

export function shuffle(array){
    for(let i = array.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
        }
    return array;
}


export async function generateImageCard(item, getGif){
    let gifUrl;
    let finalUrl;

    try{
        gifUrl = await getGif (item.word);
    }catch (err){
        console.warn(`Gif didn't fetch the "${item.word}"`, err);
        }

    if (gifUrl && gifUrl.startsWith('http')){
        finalUrl = gifUrl;
    }else{
        finalUrl = item.image;
    }

    return {
        type: 'image',
        content: finalUrl,
        word: item.word
    }
}

export function generateTextCard (item){
    return {
        type:'text',
        content: item.word, 
        word: item.word
    };
}