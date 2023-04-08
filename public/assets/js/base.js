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
// const musicDuration = 217;

// const durationContainer = document.querySelector('#duration-player');
// const elapsedContainer = document.querySelector('#elapsed-player');
// const inputPlayer = document.querySelector("input[type='range'");

// inputPlayer.max = musicDuration;

// let time = 0;
// let elapsed = 0;


// inputPlayer.oninput = () => {
//     elapsedContainer.innerHTML = formatTime(inputPlayer.value);
//     console.log(inputPlayer.value);
// } 
// // setting up duration timer
// const minSecDuration = formatTime(musicDuration);
// durationContainer.innerHTML = minSecDuration;

// // function who change duration format
// function formatTime(secDuration){
//     let min = `${Math.floor(secDuration / 60)}`; 
//     let sec = `${secDuration % 60}`;

//     if(sec.length < 2) sec = `0${sec}`
//     return `${min}:${sec}`;
// }

// // Switch between start and stop
// let isPlayed = true;

// const startStopBtn = document.querySelector('#start-stop');
// startStopBtn.onclick = () => {
//     if (isPlayed === false) {
//         isPlayed = true;
//         startStopBtn.innerHTML = "<i class='fa-solid fa-pause'></i>";   
//         // music on play
//     for (let i = 0; i < musicDuration; i++){
//         inputPlayer.oninput = () => {
//             elapsedContainer.innerHTML = formatTime(inputPlayer.value);
//         } 
//         if(isPlayed === true){
//             time += 1000;
//         setTimeout(() => {
//             elapsed += 1;
//             inputPlayer.value = elapsed; 
//             elapsedContainer.innerHTML = formatTime(inputPlayer.value);
//         }, time);
//         } else{
//             break;
//         }
// };
//     }else {
//         isPlayed = false;
//         startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";    
//     }
// };


const musicDuration = 217;

const durationContainer = document.querySelector('#duration-player');
const elapsedContainer = document.querySelector('#elapsed-player');
const inputPlayer = document.querySelector("input[type='range']");

inputPlayer.max = musicDuration;

let time = 0;
let elapsed = 0;
let intervalId;


inputPlayer.oninput = () => {
    elapsedContainer.innerHTML = formatTime(inputPlayer.value);
    elapsed = parseInt(inputPlayer.value);
    time = elapsed * 1000;

    if (isPlayed) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        elapsed += 1;
        inputPlayer.value = elapsed; 
        elapsedContainer.innerHTML = formatTime(inputPlayer.value);
        // stopwhen music is over
        if (elapsed === musicDuration) {
        //   clearInterval(intervalId);
          isPlayed = false;
          startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
        }
      }, 1000);
    }};

// setting up duration timer
const minSecDuration = formatTime(musicDuration);
durationContainer.innerHTML = minSecDuration;

// function who change duration format
function formatTime(secDuration){
  let min = `${Math.floor(secDuration / 60)}`; 
  let sec = `${secDuration % 60}`;

  if(sec.length < 2) sec = `0${sec}`;
  return `${min}:${sec}`;
}

// Switch between start and stop
let isPlayed = false;

const startStopBtn = document.querySelector('#start-stop');
startStopBtn.onclick = () => {
  if (isPlayed === false) {
    isPlayed = true;
    startStopBtn.innerHTML = "<i class='fa-solid fa-pause'></i>";   

    // Start the player
    intervalId = setInterval(() => {
      elapsed += 1;
      inputPlayer.value = elapsed; 
      elapsedContainer.innerHTML = formatTime(inputPlayer.value);
      if (elapsed === musicDuration) {
        clearInterval(intervalId);
        isPlayed = false;
        startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
      }
    }, 1000);

  } else {
    isPlayed = false;
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>"; 
    clearInterval(intervalId);
  }
};

// inputPlayer.value = 0;
// elapsedContainer.innerHTML = formatTime(inputPlayer.value);

// Start playing on page load
document.addEventListener("DOMContentLoaded", () => {
    startStopBtn.click();
});