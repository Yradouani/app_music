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