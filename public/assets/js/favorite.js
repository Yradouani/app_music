

function changeMusicInPlayer(track, e){
    trackId = track.id;
    console.log(e.target);

    if (e.target == track.querySelector('label') || e.target == track.querySelector('input')|| e.target == track.querySelector('.add_playlist')) {
        console.log('like');
        
  }else{
    getTrack(trackId)

    sound.stop();
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>"; 
    elapsed = 0;
    inputPlayer.value = elapsed; 
    clearInterval(intervalId);
  }
}