const allTracks = document.getElementById("allTracks");
const genreButton = document.getElementsByClassName("genreButton");
const titleTab = document.getElementById("titleTab");
const divGenre = document.getElementById("divGenre");
const searchIcon = document.getElementById("searchIcon");
const divSwiper = document.getElementById("divSwiper");
const divSearch = document.getElementById("divSearch");
const search = document.getElementById("search");
const swiperWrapper = document.getElementsByClassName("swiper-wrapper");
let newGenreTitle = "";
let tableauTop = "";

console.log(swiperWrapper);

fn_top100();

for (let i = 0; i < genreButton.length; i++) {
    genreButton[i].addEventListener("click", () => fn_loadGenre(i));
}

search.addEventListener("input", () => fn_search());

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

function fillSwiper(response, tableLength, tracks) {

    // swiperWrapper.innerHTML = "";
    swiper.removeAllSlides()


    for (let i = 0; i < tableLength; i++) {
        // swipperWrapper.innerHTML += `<div class="swiper-slide"><img src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt=""></div>`;
        // swipperWrapper.innerHTML += `<div class="swiper-slide"><img src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt=""></div>`;
        // swiper.appendSlide(`<div class="swiper-slide"><img src="https://place-hold.it/300x300" alt=""></div>`);
        swiper.appendSlide(`<div class="swiper-slide">
                                - ${(tracks) ? response.tracks.data[i].title : response.data[i].title} -
                                <img src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt="">
                            </div>`);
    }

    console.log(swiperWrapper.innerHTML);
}

function createTable(response, tableLength, tracks) {

    for (let i = 0; i < tableLength; i++) {
        tableauTop += `<tr class=${(tracks) ? 'track-container ranked' : 'track-container'} id="${(tracks) ? response.tracks.data[i].id : response.data[i].id}" onclick=changeMusicInPlayer(this,event)>

                            <td class="img-td">
                                <img id="albumCover" src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt="albumImg">
                            </td>
                            <td class="rank-td" style="${(tracks) ? '' : 'display : none'}">
                                ${i + 1}.
                            </td>
                            <td class="title-td">
                                <div>
                                    <span>${(tracks) ? response.tracks.data[i].title : response.data[i].title}</span><br>
                                    <span class='artist-mobile'>${(tracks) ? response.tracks.data[i].artist.name : response.data[i].artist.name}</span>
                                </div>
                            </td>
                            <td class="heart-td">
                                <input name="heart" type="checkbox" id="heart-${(tracks) ? response.tracks.data[i].id : response.data[i].id}"/>
                                <label for="heart-${(tracks) ? response.tracks.data[i].id : response.data[i].id}"></label>                            
                            </td>
                            <td  class="plus-td">
                                <i id="plus" class="fa-solid fa-plus add_playlist"></i>
                            </td>
                            <td class="artist-td">
                                ${(tracks) ? response.tracks.data[i].artist.name : response.data[i].artist.name}
                            </td>
                            <td class="album-td">
                                ${(tracks) ? response.tracks.data[i].album.title : response.data[i].album.title}
                            </td>
                        </tr>`;
    }
    if (tracks) {
        document.querySelector('th.rank-td').remove()
    }
    allTracks.innerHTML = tableauTop;
    addTrackInPlaylist();
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
            fillSwiper(response, tabLength, tracks);
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

            fillSwiper(response, tabLength, tracks);
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
            fillSwiper(response, tabLength, tracks);
        }
    }
}
//-------Music Player------//

function changeMusicInPlayer(track, e) {
    trackId = track.id;
    console.log(e.target);

    if (e.target == track.querySelector('label') || e.target == track.querySelector('input') || e.target == track.querySelector('label') || e.target == track.querySelector('.add_playlist')) {
        console.log('error');

    } else {
        getTrack(trackId)

        sound.stop();
        startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
        elapsed = 0;
        inputPlayer.value = elapsed;
        clearInterval(intervalId);
    }
}
// fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem', options)
// 	.then(response => response.json())
// 	.then(response => {
//         for(let i = 0; i < 1 ;i++) {
//             console.log(response.data);
//         }
//     })
// 	.catch(err => console.error(err));


/*------------------modal add track in playlist-----------------------*/
let bgDark = document.querySelector("#bg-dark");
let modal = document.querySelector("#modal");

function addTrackInPlaylist() {
    let trackContainer = document.querySelectorAll('.track-container')

    let addPlaylistBtn = document.querySelectorAll('.add_playlist');
    for (let i = 0; i < addPlaylistBtn.length; i++) {
        addPlaylistBtn[i].addEventListener("click", () => {
            modal.style.display = "block";
            bgDark.style.display = "block";
            console.log(trackContainer[i])
            let idTrack = trackContainer[i].getAttribute("id");
            console.log(idTrack)
            document.getElementById("track_id_input").value = idTrack;
        })
    }
}

document.onmouseup = (e) => {
    if (!modal.contains(e.target)) {
        modal.style.display = 'none';
        bgDark.style.display = "none";
    }
}

const select = document.getElementById("mySelect");
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

// --------- swapper  ---------------//





var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3,
    spaceBetween: 30,
    coverflowEffect: {
        rotate: 20,
        stretch: 100,
        depth: 50,
        modifier: 1,
        slideShadows: false
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    slidesPerView: 'auto', // afficher autant de slides que possible
    slideWidth: 200, // définir une largeur fixe pour les slides
});

swiper.on('click', function (e) {
    // Récupère l'index de la slide cliquée
    var clickedIndex = swiper.activeIndex;
    console.log('Slide cliquée : ' + clickedIndex);
});