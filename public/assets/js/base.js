/*-------------------------------------*/
/*-------------MENU BURGER-------------*/
/*-------------------------------------*/
const nav = document.querySelector('#mobile-nav');

menuBurger(window.innerWidth);


window.onresize = () => {
  menuBurger(window.innerWidth);
}

function menuBurger(screenWidth) {
  if (screenWidth > 768) {
    nav.style.display = "none";
  } else {
    mobile();
  }
}

function mobile() {

    nav.style.display = 'none';
  
    const openBtn = document.querySelector('button.menu-burger');
    const closeBtn = document.querySelector('.menu-title button i');
    const body = document.querySelector('body');





  openBtn.onclick = () => {
    toggler(100, 0, 'initial', 300, 0)
    body.style.height = '100vh'
    body.style.overflow = 'hidden'
  };

  // Le menu se ferme au clique à l'exterieur du menu
  document.onmouseup = (event) => {
    if (!nav.contains(event.target)) {
      toggler(0, 100, 'none', 0, 300);
      body.style.height = 'none';
      body.style.overflow = 'visible';
    }
  }

  closeBtn.onclick = () => {
    isOpen = false;
    toggler(0, 100, 'none', 0, 300)
    body.style.height = 'none';
    body.style.overflow = 'visible';
  };

  function toggler(start, end, display, animateTo, displayTo) {
    const animation = [
      { transform: `translate(${start}%)` },
      { transform: `translate(${end}%)` },
    ];

    const timing = {
      duration: 300,
      iterations: 1,
    };

    setTimeout(() => {
      nav.animate(animation, timing);
    }, animateTo);

    setTimeout(() => {
      nav.style.transform = `translate(0%)`;
    }, displayTo);

    setTimeout(() => {
      nav.style.display = display;
    }, 300);
  }
}


/*-------------------------------------*/
/*------------MUSIC PLAYER-------------*/
/*-------------------------------------*/
let trackId;

if(location.pathname == '/playlists' || location.pathname == '/favorite'){
  trackId = 3135556;
}

getTrack(trackId);

function getTrack(trackId) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b824698b76mshc29d02afeecec35p15959cjsn24db764eeaad',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };

  fetch(`https://deezerdevs-deezer.p.rapidapi.com/track/${trackId}`, options)
    .then(response => response.json())
    .then(response => { playMusic(response) })
}

let musicDuration;
let sound;
let isPlayed = false;
let elapsed = 0;
let intervalId;
let rotateDeg = 0;
const startStopBtn = document.querySelector('#start-stop');
const inputPlayer = document.querySelector("input[type='range']");
playerSettings();

function playMusic(data) {
  if (data.error) {
    getTrack(trackId);
  } else {
    const trackNameContainer = document.querySelector('.top-player .track-artist .track-name');
    const trackArtsistContainer = document.querySelector('.top-player .track-artist .artist');
    trackNameContainer.textContent = data.title;
    trackArtsistContainer.textContent = data.artist.name;

    sound = new Howl({
      src: [data.preview],
    });

    console.log(sound);

    // musicDuration = data.duration;
    musicDuration = 30
    console.log(data.preview);
    playerSettings(musicDuration, sound)
  }
}


function playerSettings(musicDuration = null, sound = null) {
  if (sound != null) {
    sound.on('load', () => {
      console.log('La musique a été chargée avec succès !');
    });

    // Gérer les erreurs de chargement du son
    sound.on('loaderror', (id, error) => {
      console.log(`Erreur de chargement de la musique (${id}): ${error}`);
    });
  }

  const durationContainer = document.querySelector('#duration-player');
  const elapsedContainer = document.querySelector('#elapsed-player');
  const vinyl = document.querySelector('.vinyl img')

  inputPlayer.max = musicDuration;



  // Affichage de la durée de la musique en mm:ss
  const minSecDuration = formatTime(musicDuration);
  durationContainer.innerHTML = minSecDuration;

  // Quand on déplace le curseur du lecteur
  inputPlayer.oninput = () => {
    // on met à jour le temps écoulé
    elapsedContainer.innerHTML = formatTime(inputPlayer.value);
    elapsed = parseInt(inputPlayer.value);


    // si le lecteur était en marche
    if (isPlayed) {
      // il reste en marche
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        elapsed += 1;
        inputPlayer.value = elapsed;
        elapsedContainer.innerHTML = formatTime(inputPlayer.value);
        rotateDeg += 75;
        vinyl.style.transform = `rotate(${rotateDeg}deg)`;
        // si la musique a été consommée entièrement
        if (elapsed === musicDuration) {
          // On stop le lecteur
          isPlayed = false;
          clearInterval(intervalId);
          sound.pause();
          startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
        }
      }, 1000);
    }
  };

  // 


  // On convertit la durée en secondes en m:ss
  function formatTime(secDuration) {
    let min = `${Math.floor(secDuration / 60000)}`;
    let sec = `${secDuration % 60000}`;

    if (sec.length < 2) sec = `0${sec}`;
    return `${min}:${sec}`;
  }


// On simule un clique pour démarrer le lecteur  au chargement de la page
// document.addEventListener("DOMContentLoaded", () => {
    // startStopBtn.click();
// });


  // Au clique du bouton start/stop
  startStopBtn.onclick = () => {
    // si le lecteur était en pause
    if (isPlayed === false) {

      // On change la valeur de isPlayed
      isPlayed = true;
      // On remplace le bouton start par le bouton pause 
      startStopBtn.innerHTML = "<i class='fa-solid fa-pause'></i>";
      sound.play();
      // On démarre le lecteur 
      intervalId = setInterval(() => {
        // toutes les secondes
        // on rajoute 1 seconde au temps écoulé
        // et on fait tourné le vinyl

        elapsed += 1;
        inputPlayer.value = elapsed;
        elapsedContainer.innerHTML = formatTime(inputPlayer.value);
        rotateDeg += 75;
        vinyl.style.transform = `rotate(${rotateDeg}deg)`;

        // si la musique a été consommée entièrement
        if (elapsed === musicDuration) {
          // On stop le lecteur
          sound.stop();
          isPlayed = false;
          clearInterval(intervalId);
          startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
        }

      }, 1000);
      if (elapsed === musicDuration) {
        elapsed = 0;
        inputPlayer.value = elapsed;
        elapsedContainer.innerHTML = formatTime(inputPlayer.value);
      }
    } else {
      // si le lecteur était en marche
      // on met le lecteur en pause
      isPlayed = false;
      sound.pause();
      startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
      clearInterval(intervalId);
    }
  };
  // On simule un clique pour démarrer le lecteur  au chargement de la page
  // document.addEventListener("DOMContentLoaded", () => {
  //     startStopBtn.click();
  // });

  // const tracksTab = document.querySelectorAll('.track-container')
  // tracksTab.forEach(track => {
  //   track.onclick = () => {

  //   };
  // });

  inputPlayer.value = 0;
  elapsedContainer.innerHTML = formatTime(inputPlayer.value);


}



//--------------------------------------------//
//--------------------------------------------//
//-------Effet quand la page est visité-------//
//--------------------------------------------//
//--------------------------------------------//

switch (location.pathname) {
  case '/discovery':
    document.querySelector('#mobile-nav .top-links a:first-child').classList.add('selected')
    document.querySelector('#desktop-nav .top-links a:first-child').classList.add('selected')
    break;
  case '/playlists':
    document.querySelector('#mobile-nav .top-links a:nth-child(2)').classList.add('selected')
    document.querySelector('#desktop-nav .top-links a:nth-child(2)').classList.add('selected')
    break;
  case '/favorite':
    document.querySelector('#mobile-nav .top-links a:nth-child(3)').classList.add('selected')
    document.querySelector('#desktop-nav .top-links a:nth-child(3)').classList.add('selected')
    break;
  case '/admin':
    document.querySelector('#mobile-nav .bottom-links a:first-child').classList.add('selected')
    document.querySelector('#desktop-nav .bottom-links a:first-child').classList.add('selected')
    break;
  default:
    break;
}

if(location.pathname.includes('/playlists/')){
  document.querySelector('#mobile-nav .top-links a:nth-child(2)').classList.add('selected')
  document.querySelector('#desktop-nav .top-links a:nth-child(2)').classList.add('selected')
}