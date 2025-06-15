const sounds = {
    correct: new Audio('audio/success.mp3'),
    incorrect: new Audio('audio/fail.mp3'),
    fireworks: new Audio('audio/fireworks.mp3'),
    victory: new Audio('audio/victory.mp3')
};

function playSound(sound){
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

export function playCorrectSound(){
    playSound(sounds.correct);
}

export function playIncorrectSound(){
    playSound(sounds.incorrect);
}

export function playFireworks(){
    playSound(sounds.fireworks);
}

export function playVictory(){
    playSound(sounds.victory);
}