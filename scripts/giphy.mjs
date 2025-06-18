const GIPHY_API_KEY    = "3oXq7mjiGGDM1eqvozLLmfsETDBZX1mu";

export async function getGif(word) {
    try{
        const res = await fetch(
            `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${encodeURIComponent(word)}&weirdness=3`
        );
        const data = await res.json();
        return data.data.images.original.url;
    }catch (err){
        console.error('Giphy error', err);
        return null;
    }
}