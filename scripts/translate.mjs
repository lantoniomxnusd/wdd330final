export async function translateText(text, targetLang) {
  try {
    const res = await fetch('http://localhost:5001https://libretranslate-apyh.onrender.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    });

    const data = await res.json();
    console.log('Response:', data); // shows error message if any

    if (res.ok) {
      return data.translatedText;
    } else {
      throw new Error(data.error || 'Translation failed');
    }

  } catch (err) {
    console.error('Translation error:', err.message);
    return text; // fallback
  }
}
