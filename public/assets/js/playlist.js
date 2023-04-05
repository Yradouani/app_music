let track = document.querySelectorAll('.track');
let allPlaylists = document.querySelector('#playlist-container');
let id = []

for (let i = 0; i < track.length; i++) {
    id.push(track[i].id)
    track[i].addEventListener("click", () => {
        window.location.href = `playlists/${id[i]}`;
    })
}

console.log(id)