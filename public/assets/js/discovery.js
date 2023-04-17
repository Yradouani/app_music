let allTracks = document.getElementById("allTracks");
let genreButton = document.getElementsByClassName("genreButton");
let titleTab = document.getElementById("titleTab");
let divGenre = document.getElementById("divGenre");
let searchIcon = document.getElementById("searchIcon");
let divSwiper = document.getElementById("divSwiper");
let divSearch = document.getElementById("divSearch");
let search = document.getElementById("search");
let newGenreTitle = "";
let tableauTop = "";



fn_top100();

for (let i = 0; i < genreButton.length; i++) {
    genreButton[i].addEventListener("click", () => fn_loadGenre(i));
}

searchIcon.addEventListener("click", () => fn_search());



function getTracks(url, fnName) {

    fetch('https://deezerdevs-deezer.p.rapidapi.com/' + url, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b824698b76mshc29d02afeecec35p15959cjsn24db764eeaad',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    })
        .then(response => response.json())
        .then(response => fnName(response, url, fnName))
        .catch(err => console.error(err));
}



function createTable(response, tableLength, tracks) {

    for (let i = 0; i < tableLength; i++) {
        tableauTop += `<tr class='track-container' id="${(tracks) ? response.tracks.data[i].id : response.data[i].id}" onclick=changeMusicInPlayer(this)>
                            <td style="width:6%">
                                <img id="albumCover" src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt="albumImg">
                            </td>
                            <td style="width:1%">
                                ${i + 1}.
                            </td>
                            <td style="width:36%">
                                ${(tracks) ? response.tracks.data[i].title : response.data[i].title}
                            </td>
                            <td>
                                <i id="heart" class="fa-regular fa-heart"></i>
                            </td>
                            <td>
                                <i id="plus" class="fa-solid fa-plus"></i>
                            </td>
                            <td>
                                ${(tracks) ? response.tracks.data[i].artist.name : response.data[i].artist.name}
                            </td>
                            <td>
                                ${(tracks) ? response.tracks.data[i].album.title : response.data[i].album.title}
                            </td>
                        </tr>`;
    }
    allTracks.innerHTML = tableauTop;
}

function fn_top100() {
    // au chargement de la page charge le top 100 avec l'api

    let url = "playlist/1109890291";
    let fnName = displayTopTracks;

    getTracks(url, fnName);

    function displayTopTracks(response, url, fnName) {
        console.log(response);
        if (response.error) {
            console.log("error" + response);
            getTracks(url, fnName);
        } else {

            let tabLength = 100;
            let tracks = true;

            createTable(response, tabLength, tracks);
        }
    }
}

function fn_loadGenre(i) {
    titleTab.innerHTML = "Top " + genreButton[i].innerHTML;
    idGenre = genreButton[i].getAttribute("name");

    let url = "playlist/" + idGenre;
    let fnName = displayTrackByGenre;

    console.log(url);

    allTracks.innerHTML = "";
    tableauTop = "";

    getTracks(url, fnName);

    function displayTrackByGenre(response, url, fnName) {
        console.log(response);
        if (response.error) {
            getTracks(url, fnName);
        } else {
            let tabLength = 50;
            let tracks = true;

            createTable(response, tabLength, tracks);
        }
    }
}

function fn_search() {
    titleTab.style.display = "none";
    divGenre.style.display = "none";
    divSwiper.style.display = "none";
    divSearch.style.marginBottom = "40px";

    let url = 'search?q=' + search.value;
    let fnName = displaySearchResult;

    console.log(url);

    allTracks.innerHTML = "";
    tableauTop = "";

    getTracks(url, fnName);

    function displaySearchResult(response, url, fnName) {
        if (response.error) {
            getTracks(url, fnName);
        } else {
            let tabLength = 25;
            let tracks = false;

            createTable(response, tabLength, tracks);
        }
    }
}

//-------Music Player------//

function changeMusicInPlayer(track) {
    trackId = track.id;
    getTrack(trackId)

    sound.stop();
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
    elapsed = 0;
    inputPlayer.value = elapsed;
    clearInterval(intervalId);
}