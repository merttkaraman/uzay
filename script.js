const numStars = 500;
const numPlanets = 15;
const shootingStarFrequency = 2000;
const planetSpawnInterval = 5000;

let totalPlanets = 0;

document.addEventListener('DOMContentLoaded', () => {
    const ambientMusic = document.getElementById('ambientMusic');
    const musicButton = document.getElementById('musicButton');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeControl = document.querySelector('.volume-control');
    let musicPlaying = false;

    musicButton.addEventListener('click', () => {
        if (musicPlaying) {
            ambientMusic.pause();
            musicButton.src = "mute.png"; 
        } else {
            ambientMusic.play();
            musicButton.src = "sound.png"; 
        }
        musicPlaying = !musicPlaying;
        volumeControl.style.display = musicPlaying ? "flex" : "none";
    });

    volumeSlider.addEventListener('input', () => {
        ambientMusic.volume = volumeSlider.value;
    });
});


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < numStars; i++) {
        createStar();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < numPlanets; i++) {
        createPlanet(null, null, false);
    }
});

setInterval(() => {
    
    if (totalPlanets < 50) { 
        createPlanet(null, null, true); 
    }
}, planetSpawnInterval);


document.addEventListener('DOMContentLoaded', () => {
    createPlanet("earth.png", 80, false);
    createPlanet("moon.png", 50, false);
    createSaturn();
});


setInterval(createShootingStar, shootingStarFrequency);



const milkyWay = document.querySelector('.milky-way');
const milkyWayDirectionX = Math.random() < 0.5 ? -1 : 1;
const milkyWayDirectionY = Math.random() < 0.5 ? -1 : 1;
let milkyWayTranslateX = 0;
let milkyWayTranslateY = 0;


function moveMilkyWay() {
    milkyWayTranslateX += milkyWayDirectionX * 0.005; 
    milkyWayTranslateY += milkyWayDirectionY * 0.0025; 
    milkyWay.style.transform = `translate(${milkyWayTranslateX}%, ${milkyWayTranslateY}%) rotate(${milkyWayTranslateX / 2}deg)`;
}

setInterval(moveMilkyWay, 10);

milkyWay.style.left = `${Math.random() * 100}%`;
milkyWay.style.top = `${Math.random() * 100}%`;

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 2}px`;
    star.style.height = star.style.width;
    star.style.animationDelay = `${Math.random() * 2}s`;
    document.body.appendChild(star);
}

function createPlanet(imageSrc, size, growAnimation = true) {

    const planetImages = ["planet1.png", "planet2.png", "planet3.png", "planet4.png", "planet5.png", "planet6.png", "planet7.png"];

    
    const randomIndex = Math.floor(Math.random() * planetImages.length);
    const planetImage = planetImages[randomIndex];

    const planet = document.createElement('img');
    if(imageSrc){
        planet.src = imageSrc;
    }else{
        planet.src = planetImage; 
    }
    
    planet.classList.add('planet');
    if(size){
        planet.style.width = `${size}px`; 
        planet.style.height = planet.style.width;
    }else{
        planet.style.width = `${Math.random() * 20 + 10}px`;
        planet.style.height = planet.style.width;
    }
    

    const directionX = Math.random() < 0.5 ? -1 : 1;
    const directionY = Math.random() < 0.5 ? -1 : 1;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;

    planet.style.left = `${startX}%`;
    planet.style.top = `${startY}%`;

  
    if (growAnimation) {
        planet.style.opacity = 0;
        planet.style.transform = `scale(0)`; 

        let scale = 0;
        const growInterval = setInterval(() => {
            scale += 0.01; 
            planet.style.opacity = scale; 
            planet.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`; 

            if (scale >= 1) {
                clearInterval(growInterval);
            }
        }, 10);
    }

    let translateX = 0;
    let translateY = 0;
  
    function checkCollision() {
        const milkyWayRect = milkyWay.getBoundingClientRect();
        const planetRect = planet.getBoundingClientRect();
               
        const margin = 50; 
        const adjustedMilkyWayRect = {
            left: milkyWayRect.left + margin,
            right: milkyWayRect.right - margin,
            top: milkyWayRect.top + margin,
            bottom: milkyWayRect.bottom - margin
        };

        if (
            planetRect.left < adjustedMilkyWayRect.right &&
            planetRect.right > adjustedMilkyWayRect.left &&
            planetRect.top < adjustedMilkyWayRect.bottom &&
            planetRect.bottom > adjustedMilkyWayRect.top
        ) {
            
            swallowPlanet(planet);
            clearInterval(planetMovementInterval); 
        }
    }

    function swallowPlanet(planetToSwallow) {
        let scale = 1;
        
        const planetRect = planetToSwallow.getBoundingClientRect();
        const startX = planetRect.left;
        const startY = planetRect.top;
        const milkyWayRect = milkyWay.getBoundingClientRect();
        const endX = milkyWayRect.left + milkyWayRect.width / 2 - planetToSwallow.offsetWidth / 2;
        const endY = milkyWayRect.top + milkyWayRect.height / 2 - planetToSwallow.offsetHeight / 2;

        let currentX = startX;
        let currentY = startY;
        const swallowInterval = setInterval(() => {
            scale -= 0.01;
            
            currentX += (endX - currentX) * 0.05;  
            currentY += (endY - currentY) * 0.05;
            planetToSwallow.style.left = `${currentX}px`;
            planetToSwallow.style.top = `${currentY}px`;
            planetToSwallow.style.transform = `scale(${scale})`;

            if (scale <= 0) {
                clearInterval(swallowInterval);
                planetToSwallow.remove();
            }
        }, 10);
    }

        function explodePlanet() {
            const explosion = document.createElement('div');
            explosion.classList.add('explosion');
    
            const planetRect = planet.getBoundingClientRect();
            const explosionSize = planetRect.width * 1.5; 
    
            explosion.style.left = `${planetRect.left + planetRect.width / 2 - explosionSize / 2}px`;
            explosion.style.top = `${planetRect.top + planetRect.height / 2 - explosionSize / 2}px`;
            explosion.style.width = `${explosionSize}px`;
            explosion.style.height = `${explosionSize}px`;
            document.body.appendChild(explosion);
         
            setTimeout(() => {
                explosion.remove();
            }, 1000);
    
            const explosionSound = document.getElementById('explosionSound');
            explosionSound.currentTime = 0; 
            explosionSound.play();
             
            planet.remove();

            totalPlanets--; 
        }
            
        planet.addEventListener('click', explodePlanet);

    const planetMovementInterval = setInterval(() => {
        translateX += directionX * 0.05;
        translateY += directionY * 0.03;
        planet.style.transform = `translate(${translateX}%, ${translateY}%)`;
        checkCollision();
    }, 10);

    document.body.appendChild(planet);

    totalPlanets++; 
}

function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    shootingStar.style.top = `${Math.random() * 100}%`;
    shootingStar.style.left = `${Math.random() * 100}%`;

    const angle = Math.random() * 360;

    const distance = Math.random() * 100 + 50;

    let currentPosition = 0;

    const rotationAngle = angle - 90;
    shootingStar.style.transform = `translate(0, 0) rotate(${rotationAngle}deg)`;

    const animationInterval = setInterval(() => {
        currentPosition += 2;

        shootingStar.style.transform = `translate(${currentPosition * Math.cos(angle * Math.PI / 180)}vw, ${currentPosition * Math.sin(angle * Math.PI / 180)}vh) rotate(${rotationAngle}deg)`;

        if (currentPosition >= distance) {
            clearInterval(animationInterval);
            shootingStar.remove();
        }
    }, 10);

    document.body.appendChild(shootingStar);
}

function createSaturn() {
    const saturn = document.createElement('img');
    saturn.src = "saturn.png";
    saturn.alt = "Saturn";
    saturn.classList.add('saturn');

    saturn.style.left = `${Math.random() * 100}%`;
    saturn.style.top = `${Math.random() * 100}%`;

    let saturnTranslateY = 0;
    const saturnDirectionY = Math.random() < 0.5 ? -1 : 1;
    const saturnMovementInterval = setInterval(moveSaturn, 10); 

    function moveSaturn() {
        saturnTranslateY += saturnDirectionY * 0.02;
        saturn.style.transform = `translateY(${saturnTranslateY}%)`;
        checkCollision(saturn, saturnMovementInterval); 
    }

    document.body.appendChild(saturn);
}

function checkCollision(planet, movementInterval) { 
    const milkyWayRect = milkyWay.getBoundingClientRect();
    const planetRect = planet.getBoundingClientRect();

    const margin = 50; 
    const adjustedMilkyWayRect = {
        left: milkyWayRect.left + margin,
        right: milkyWayRect.right - margin,
        top: milkyWayRect.top + margin,
        bottom: milkyWayRect.bottom - margin
    };

    if (
        planetRect.left < adjustedMilkyWayRect.right &&
        planetRect.right > adjustedMilkyWayRect.left &&
        planetRect.top < adjustedMilkyWayRect.bottom &&
        planetRect.bottom > adjustedMilkyWayRect.top
    ) {

        swallowPlanet(planet);
        if (planet.classList.contains('planet') || planet.classList.contains('saturn')) { 
            clearInterval(movementInterval); 
        }
    }
}
