// creates a single card element for the gameboard.
export function createCard(cardData, index){
    const card = document.createElement('div');
    card.classList.add('card');

    // store the word and the index as data so they can be used later for the matching
    card.dataset.word = cardData.word;
    card.dataset.index = index;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('front');


    // if the card is an image type, then add <img> witht the GIF or fallback image
    if (cardData.type =='image'){
        const img = document.createElement('img');
        img.src = cardData.content;
        img.alt = cardData.word;
        front.appendChild(img);
        // If it is a text card, just add the word as text
    }else {
        front.textContent = cardData.content;
    }

    const back = document.createElement('div');
    back.classList.add('back');

// Create the full card
    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);

    return card;
}

// THis shuffles the array o cards. it randomizes the order fo the cards before displaying them
export function shuffle(array){
    for(let i = array.length -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
        }
    return array;
}

// This function creates an image card using the GIF from the Giphy appendChild. If the GIPHY fails, it uses the image on file to fallback
export async function generateImageCard(item, getGif){
    let gifUrl;
    let finalUrl;

    try{
        // attempt to fetch a gif from giphy using the vocabulary word
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

// this function creates a basic text card
export function generateTextCard (item){
    return {
        type:'text',
        content: item.word, 
        word: item.word
    };
}