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

function fillSwiper(response, tableLength, tracks) {

    // swiperWrapper.innerHTML = "";
    swiper.removeAllSlides()

    for (let i = 0; i < tableLength; i++) {
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
        tableauTop += `<tr class='track-container' id="${(tracks) ? response.tracks.data[i].id : response.data[i].id}" onclick=changeMusicInPlayer(this,event)>
                            <td class="img-td">
                                <img id="albumCover" src="${(tracks) ? response.tracks.data[i].album.cover_big : response.data[i].album.cover_big}" alt="albumImg">
                            </td>
                            <td class="rank-td">
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
                            <td>
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

function changeMusicInPlayer(track, e){
    trackId = track.id;
    console.log(e.target);

    if (e.target == track.querySelector('label') || e.target == track.querySelector('input')) {
        console.log('error');
        
  }else{
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




// <tr class='track-container' id="${ response.tracks.data[i].id }" onclick=changeMusicInPlayer(this, event)>
//                             <td class="img-td">
//                                 <img id="albumCover" src="${ response.tracks.data[i].album.cover_big }" alt="albumImg">
//                             </td>
//                             <td class='rank-td'>
//                                 ${ i + 1 }.
//                             </td>
//                             <td class="title-td">
//                                 <div>
//                                     <span>${ response.tracks.data[i].title }</span></br>
//                                     <span class='artist-mobile'> ${ response.tracks.data[i].artist.name }</span>
//                                 </div>
//                             </td>
//                             <td class="heart-td">
//                                 <i id="heart" class="fa-regular fa-heart"></i>
//                             </td>
//                             <td class="plus-td">
//                                 <i id="plus" class="fa-solid fa-plus"></i>
//                             </td>
//                             <td class="artist-td">
//                                 ${ response.tracks.data[i].artist.name }
//                             </td>
//                             <td class="album-td">
//                                 ${ response.tracks.data[i].album.title }
//                             </td>
//                         </tr>




// ---------
