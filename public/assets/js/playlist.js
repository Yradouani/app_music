let track = document.querySelectorAll('.track');
let allPlaylists = document.querySelector('#playlist-container');
let addPlaylistBtn = document.querySelector('.add_playlist_image');
let modal = document.querySelector("#modal")
let id = []

for (let i = 0; i < track.length; i++) {
    id.push(track[i].id)
    track[i].addEventListener("click", () => {
        window.location.href = `playlists/${id[i]}`;
    })
}

/*------------------add playlist-----------------------*/
let bgDark = document.querySelector("#bg-dark");

addPlaylistBtn.addEventListener("click", () => {
    modal.style.display = "block";
    bgDark.style.display = "block";
})
document.onmouseup = (e) => {
    console.log(e.target)
    if (!modal.contains(e.target)) {
        modal.style.display = 'none';
        bgDark.style.display = "none";
    }
}