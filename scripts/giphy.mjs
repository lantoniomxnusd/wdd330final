const GIPHY_API_KEY    = "3oXq7mjiGGDM1eqvozLLmfsETDBZX1mu";

export async function gif(word) {
    try{
        const res = await fetch(
            `https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY&s=${encodeURIComponent(word)}&weirdness=3`
        );
        const data = await res.json();
        return data.data.images.original.url;
    }catch (err){
        console.log('Giphy error');
        return null;
    }
}