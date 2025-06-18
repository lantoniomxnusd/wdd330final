
/* global confetti */

let fireworksLaunch = null;

export function playConfetti (){
    confetti({
        particleCount:100, 
        spread:100, 
        startVelocity: 40,
        origin: { y: 0.6},
    });
}

// export function shakeCards(card1, card2){
//     card1.classList.add('shake');
//     card2.classList.add('shake');

//     setTimeout(() => {
//         card1.classList.remove('shake');
//         card2.classList.remove('shake');
//     }, 500);
// }

export function launchFireworks(){
    const container = document.getElementById('fireworks');
    if (!container) return;

    container.classList.remove('hidden');

    stopFireworks();

    fireworksLaunch = new window.Fireworks.Fireworks(container, {
        rocketsPoint: { min: 0, max: 100 },
        hue: { min: 0, max: 360 },
        speed: 3,
        acceleration: 1.1,
        friction: 0.96,
        gravity: 1.5,
        particles: 80,
        trace: 4,
        explosion: 6,
        autoresize: true,
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
        mouse: { click: false, move: false }
    });

    container.classList.remove('hidden');
    fireworksLaunch.start();
}

export function stopFireworks(){
    const container = document.getElementById('fireworks');
    if(fireworksLaunch){
        fireworksLaunch.stop();
        fireworksLaunch = null;
    }  
    if (container){
        container.classList.add('hidden');
    }
}