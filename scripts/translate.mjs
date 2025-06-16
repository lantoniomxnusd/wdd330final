const API_KEY = "c4595e8f-324c-4cf9-bf3d-f5cfd146b2a5";

export const defaultTexts = {
  instructions: "Welcome to the Card Match Game! This game is sectioned by Category and Our World. Use Our world for homework assignments. Use Category for random practice.",
  mode: "Mode: ",
  choose: "Choose: ",
  tries: "Tries: ",
  startGame: "Start Game",
  languageLabel: "Instruction Language: "
};

export async function translateText(text, targetLang) {
  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
        api_key: API_KEY
      }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
}


export async function applyTranslation(lang){
    const elements = {
    instructionsText: 'instructions',
    modeLabel: 'mode',
    chooseLabel: 'choose',
    languageLabel: 'languageLabel',
    startGame: 'startGame',
    // triesLabel: 'triesLabel',
  };

    for (const [id,key] of Object.entries(elements)){
    const el = document.getElementById(id);
    if (!el) continue;
    
    if(lang === 'en'){
      el.textContent = defaultTexts[key];
    } else {
      const translated = await translateText(defaultTexts[key], lang);

      if (translated && translated.translatedText){
        el.textContent = translated.translatedText;
      }else {
      el.textContent = defaultTexts[key];
      }
    }
  }
}

