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

// console.log(swiperWrapper);

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

    if (tracks) {
        for (let i = 0; i < tableLength; i++) {
            // swipperWrapper.innerHTML += `<div class="swiper-slide"><img src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt=""></div>`;
            // swipperWrapper.innerHTML += `<div class="swiper-slide"><img src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt=""></div>`;
            // swiper.appendSlide(`<div class="swiper-slide"><img src="https://place-hold.it/300x300" alt=""></div>`);
            swiper.appendSlide(`<div class="swiper-slide" id="swiper-${response.tracks.data[i].id}" onclick=changeMusicSwiper(this)>
        <span class="track-title">${i + 1} - ${(tracks) ? response.tracks.data[i].title : response.data[i].title}</span>
        <img src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt="">
      </div>`);
        }
    }

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
                                <input name="heart" type="checkbox" id="heart-${(tracks) ? response.tracks.data[i].id : response.data[i].id}" onchange="updateFavorite(this)"/>
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

    if (!tracks && document.querySelector('th.rank-td')) {

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
        // console.log(response);
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

    if (e.target == track.querySelector('label') || e.target == track.querySelector('input')) {
        // console.log('error');

    } else {

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

function changeMusicSwiper(slide) {
    trackId = slide.id.split('-')[1]
    getTrack(trackId)
    sound.stop();
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
    elapsed = 0;
    inputPlayer.value = elapsed;
    clearInterval(intervalId);
}


/*------------------modal add track in playlist-----------------------*/


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
    // console.log(e.target)
    if (!modal.contains(e.target)) {
        modal.style.display = 'none';
        bgDark.style.display = "none";
    }
}

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

swiper.on('slideChange', function () {
    var activeIndex = swiper.activeIndex;
    var slides = swiper.slides;

    for (var i = 0; i < slides.length; i++) {
        var slide = slides[i];
        var image = slide.querySelector('img');

        if (i === activeIndex) {
            image.style.filter = 'brightness(100%)';
            slide.style.opacity = 1;
        } else {
            image.style.filter = 'brightness(50%)';
            slide.style.opacity = 0.5;
        }
    }
});

// --------Favorite------------//

/* <input name="heart" type="checkbox" id="heart-${(tracks) ? response.tracks.data[i].id : response.data[i].id}" onchange="updateFavorite()"/>
<label for="heart-${(tracks) ? response.tracks.data[i].id : response.data[i].id}"></label> */

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
        console.log("del " + songId);

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


// discovery button
// Obtenez tous les boutons de genre
const genreButtons = document.querySelectorAll('.genreButton');

// Parcourez chaque bouton et ajoutez un écouteur d'événement de clic
genreButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Supprimez la classe 'activeButton' de tous les boutons
        genreButtons.forEach(button => button.classList.remove('activeButton'));
        // Ajoutez la classe 'activeButton' au bouton cliqué
        button.classList.add('activeButton');
    });
});
