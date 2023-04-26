/*-------------------------------------*/
/*----------LOADING SPINNER------------*/
/*-------------------------------------*/
const spinner = document.querySelector('.spinner');
const backdrop = document.querySelector('.spinner-backdrop')
let timeoutId;

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
trackId = 3135556;
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

    const footer = document.querySelector('footer')
    footer.id = `selected-${data.id}`;

    sound = new Howl({
      src: [data.preview]
    });

    musicDuration = 30;
    playerSettings(musicDuration, sound, data.id);
  }
}

function playerSettings(musicDuration = null, sound = null, id = null) {
  if (sound != null) {
    sound.on('load', () => {
      console.log('La musique a été chargée avec succès !');
    }
    );

    // Gérer les erreurs de chargement du son
    sound.on('loaderror', () => {
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
    let seekTime = parseFloat(inputPlayer.value);
    sound.seek(seekTime)
    // si le lecteur était en marche
    if (isPlayed) {
      if (elapsed == musicDuration) {
        clearInterval(intervalId);

        elapsed = 0
        inputPlayer.value = elapsed;
        isPlayed = false;

        sound.stop();
        startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
      }
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
          elapsed = 0
          inputPlayer.value = elapsed;
          isPlayed = false;
          clearInterval(intervalId);
          sound.stop();
          startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
        }

        if (isPlayed == true) {
          const forward = document.querySelector('#forward')
          const backward = document.querySelector('#backward')
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
      // si la musique a été consommée entièrement
      if (inputPlayer.value == musicDuration) {
        clearInterval(intervalId);
        elapsed = 0
        inputPlayer.value = elapsed;
        // On stop le lecteur
        sound.stop();
        isPlayed = false;
        startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
      } else {
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
          if (inputPlayer.value == musicDuration) {

            clearInterval(intervalId);
            elapsed = 0
            inputPlayer.value = elapsed;
            // On stop le lecteur
            sound.stop();
            isPlayed = false;
            startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
          }

          const forward = document.querySelector('#forward')
          const backward = document.querySelector('#backward')
          if (elapsed <= (musicDuration - 5)) {
            forward.onclick = () => {
              elapsed += 3;
              inputPlayer.value = elapsed;
              elapsedContainer.innerHTML = formatTime(inputPlayer.value);
              let seekTime = parseFloat(inputPlayer.value);
              sound.seek(seekTime)
            }
          }
          if (elapsed >= 3) {
            backward.onclick = () => {
              elapsed -= 3;
              inputPlayer.value = elapsed;
              elapsedContainer.innerHTML = formatTime(inputPlayer.value);

              let seekTime = parseFloat(inputPlayer.value);
              sound.seek(seekTime)

            }


          }
        }, 1000);

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
  inputPlayer.value = 0;
  elapsedContainer.innerHTML = formatTime(inputPlayer.value);
}



//--------------------------------------------//
//--------------------------------------------//
//-------Effet quand la page est visité-------//
//--------------------------------------------//
//--------------------------------------------//

// setTimeout(() => {
switch (location.pathname) {
  case '/discovery':
    let discoveryLink = document.querySelectorAll('.top-links a:nth-child(1)')
    discoveryLink[0].classList.add('selected')
    discoveryLink[1].classList.add('selected')
    break;
  case '/playlists':
    document.querySelector('#mobile-nav .top-links a:nth-child(2)').classList.add('selected')
    document.querySelector('#desktop-nav .top-links a:nth-child(2)').classList.add('selected')
    break;
  case '/addplaylists':
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
// }, 2000);

// -------------------------------Player add in playlist------------------

//------------------Get id Track in player------------------------
let playerBtnAddPlaylist = document.querySelector(".playlist-btn");
let bgDark = document.querySelector("#bg-dark");
let modal = document.querySelector("#modal");

playerBtnAddPlaylist.addEventListener("click", () => {
  modal.style.display = "block";
  bgDark.style.display = "block";
  let footer = document.querySelector(".myfooter");
  let idTrackInPlayer = (footer.id).split('-');
  idTrackInPlayer = idTrackInPlayer[1];
  document.getElementById("track_id_input").value = idTrackInPlayer;


  document.onmouseup = (e) => {
    if (!modal.contains(e.target)) {
      modal.style.display = "none";
      bgDark.style.display = "none";
    }
  }
})


const select = document.getElementById("mySelect");
console.log(select);
if (select) {
  const optionCount = select.getElementsByTagName("option").length;
  select.setAttribute("size", optionCount);
  select.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const options = this.getElementsByTagName("option");
    for (let i = 0; i < options.length; i++) {
      options[i].classList.remove("selected");
    }
    selectedOption.classList.add("selected");
  });

}

/************Barre de nav************/

if (location.pathname.includes('/playlists/')) {
  document.querySelector('#mobile-nav .top-links a:nth-child(2)').classList.add('selected')
  document.querySelector('#desktop-nav .top-links a:nth-child(2)').classList.add('selected')
}

/*******Quand une musique est séléctionné*******/

setTimeout(() => {
  const tracksArr = document.querySelectorAll('.track-container');
  const footer = document.querySelector('footer')
  const footerId = footer.id.split('-')[1];
  tracksArr.forEach(track => {
    track.classList.remove('selected-track');
    if (track.id == footerId) {
      track.classList.add('selected-track');
    }
  });
}, 2000);

/*spinner*/
function launchSpinner() {
  spinner.style.display = 'initial';
  backdrop.style.display = 'initial';
  const animation = [
    { opacity: 0.85 },
    { opacity: 0.65 },
  ];

  const timing = {
    duration: 5000,
    iterations: 1,
    fill: "forwards"
  };
  backdrop.animate(animation, timing);

  timeoutId = setTimeout(() => {
    spinner.style.display = 'none';
    backdrop.style.display = 'none';
  }, 10000);
}


const navLinksArr = document.querySelectorAll('.top-links a')

navLinksArr.forEach(link => {
  link.onclick = () => {

    launchSpinner();
  }


});