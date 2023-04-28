let track = document.querySelectorAll('.track');
let allPlaylists = document.querySelector('#playlist-container');
let addPlaylistBtn = document.querySelector('.add_playlist_image');
let modalAddPlaylist = document.querySelector("#modal_add_playlist")
let deleteModal = document.querySelector("#modal_delete");
let deleteButtons = document.querySelectorAll(".delete");
let addPlaylistContainer = document.querySelector('#add_playlist')
let ids = [];

const spinnerPl = document.querySelector('.spinner');
const backdropPl = document.querySelector('.spinner-backdrop')
clearTimeout(timeoutId);

spinnerPl.style.display = 'none';
backdropPl.style.display = 'none';

for (let i = 0; i < track.length; i++) {
    ids.push(track[i].id)
    track[i].addEventListener("click", (e) => {
        if (!deleteButtons[i].contains(e.target))
            window.location.href = `playlists/${ids[i]}`;
        launchSpinner();
    })

}


/*------------------add playlist-----------------------*/
function responsiveAddPlBtn() {
    if (window.innerWidth <= 768) {
        addPlaylistContainer.addEventListener("click", () => {
            modalAddPlaylist.style.display = "block";
            bgDark.style.display = "block";
        })
    } else {
        if (addPlaylistBtn) {
            addPlaylistBtn.addEventListener("click", () => {
                modalAddPlaylist.style.display = "block";
                bgDark.style.display = "block";
            })
        }
    }
}


responsiveAddPlBtn()
window.onresize = () => {
    responsiveAddPlBtn()
}


for (let i = 0; i < deleteButtons.length; i++) {
    let idPlaylist = [];
    for (let i = 0; i < deleteButtons.length; i++) {
        idPlaylist.push(deleteButtons[i].id)
        deleteButtons[i].addEventListener("click", () => {
            deleteModal.style.display = "block";
            bgDark.style.display = "block";
            document.getElementById("playlist_id_input").value = idPlaylist[i];
        })
    }
}

document.onmouseup = (e) => {
    if (!modalAddPlaylist.contains(e.target)) {
        modalAddPlaylist.style.display = "none";
        bgDark.style.display = "none";
    } else if (!deleteModal.contains(e.target)) {
        deleteModal.style.display = "none";
        bgDark.style.display = "none";
    }
}
// -----------------------delete track on playlist---------------------
let trashButtons = document.querySelectorAll('.trash_icon');
let idPlaylistToDelete;
let idTrackToDelete;

for (let i = 0; i < trashButtons.length; i++) {
    trashButtons[i].addEventListener("click", () => {
        let infos = trashButtons[i].id;
        let infosArray = infos.split('|');
        idTrackToDelete = infosArray[0];
        idPlaylistToDelete = infosArray[1];


        const url = '/deleteplaylist';
        const data = {
            idPlaylistToDelete: idPlaylistToDelete,
            idTrackToDelete: idTrackToDelete
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const rowToDelete = document.getElementById(`${idTrackToDelete}`);
            if (rowToDelete) {
                rowToDelete.remove();
            }
        }).catch(error => {
            console.log(error)
        });

    })
}

//-------Music Player------//
function changeMusicInPlayer(track, e) {
    trackId = track.id;
    if (e.target == track.querySelector('label') || e.target == track.querySelector('input') || e.target == track.querySelector('.add_playlist') || e.target == track.querySelector('.trash_icon')) {
    } else {
        const tracksArr = document.querySelectorAll('.track-container');
        tracksArr.forEach(track => {
            track.classList.remove('selected-track')
        })

        track.classList.add('selected-track');


        sound.stop();
        startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
        elapsed = 0;
        inputPlayer.value = elapsed;
        clearInterval(intervalId);

        getTrack(trackId)
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
        if (track.id == trackId) {
            track.classList.add('selected-track')
        }
    })
    sound.stop();
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
    elapsed = 0;
    inputPlayer.value = elapsed;
    clearInterval(intervalId);
    getTrack(trackId)
}

//-----------------favorite-------------//

function updateFavorite(checkbox) {

    if (checkbox.checked) {

        idSplit = checkbox.id.split("-");
        songId = idSplit[1];
        console.log("add " + songId);

        fetch('/addFavorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songId: songId })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

    } else {
        idSplit = checkbox.id.split("-");
        songId = idSplit[1];

        fetch('/deleteFavorite/' + songId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ songId: songId })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    }
}