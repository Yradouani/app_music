const spinnerFav = document.querySelector('.spinner');
const backdropFav = document.querySelector('.spinner-backdrop')
spinnerFav.style.display = 'none';
backdropFav.style.display = 'none';


function changeMusicInPlayer(track, e){
    trackId = track.id;

    if (e.target == track.querySelector('label') || e.target == track.querySelector('input')|| e.target == track.querySelector('.add_playlist')) {
        console.log('like');
  }else{
    const tracksArr = document.querySelectorAll('.track-container');
        tracksArr.forEach(track => {
            track.classList.remove('selected-track')
        })
        
        track.classList.add('selected-track');
    getTrack(trackId)

    sound.stop();
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>"; 
    elapsed = 0;
    inputPlayer.value = elapsed; 
    clearInterval(intervalId);
  }
}

/***********Bouton Écouter************/
function listenMusic() {
  const tracksArr = document.querySelectorAll('.track-container')
  const idTrackArr = [];  

  tracksArr.forEach(track => {
      idTrackArr.push(track.id) 
      track.classList.remove('selected-track')
  })
  trackId = idTrackArr[Math.floor(Math.random() * idTrackArr.length)]; 
  
  tracksArr.forEach(track => {
      if(track.id == trackId){
          track.classList.add('selected-track')
      }
  })
      sound.stop();
      startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
      elapsed = 0;
      inputPlayer.value = elapsed;
      clearInterval(intervalId);
      console.log(trackId)
      getTrack(trackId)
}