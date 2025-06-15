const API_KEY = "c4595e8f-324c-4cf9-bf3d-f5cfd146b2a5";

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