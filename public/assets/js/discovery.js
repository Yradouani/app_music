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

for(let i = 0; i < genreButton.length; i++) {
    genreButton[i].addEventListener("click", () => fn_loadGenre(i));
}

searchIcon.addEventListener("click", () => fn_search());

function fn_top100() {
    // au chargement de la page charge le top 100 avec l'api
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b824698b76mshc29d02afeecec35p15959cjsn24db764eeaad',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    getTopTracks()

    function getTopTracks() {
    fetch('https://deezerdevs-deezer.p.rapidapi.com/playlist/1109890291', options)
        .then(response => response.json())
        .then(response => displayTopTracks(response))
        .catch(err => console.error(err));
}
    

function displayTopTracks(response){
    console.log(response);
    if(response.error){
        getTopTracks();
    }else{
        trackId = response.tracks.data[0].id ;
    for(let i = 0; i < 100; i++) {
            tableauTop += `<tr class='track-container' id="${ response.tracks.data[i].id }" onclick=changeMusicInPlayer(this)>
                                <td style="width:6%">
                                    <img id="albumCover" src="${ response.tracks.data[i].album.cover_big }" alt="albumImg">
                                </td>
                                <td style="width:1%">
                                    ${ i + 1 }.
                                </td>
                                <td style="width:36%">
                                    ${ response.tracks.data[i].title }
                                </td>
                                <td>
                                    <i id="heart" class="fa-regular fa-heart"></i>
                                </td>
                                <td>
                                    <i id="plus" class="fa-solid fa-plus"></i>
                                </td>
                                <td>
                                    ${ response.tracks.data[i].artist.name }
                                </td>
                                <td>
                                    ${ response.tracks.data[i].album.title }
                                </td>
                            </tr>`;
    }
    allTracks.innerHTML = tableauTop;
}
}
}

fn_top100();


function fn_loadGenre(i) {
    titleTab.innerHTML = "Top " + genreButton[i].innerHTML;
    idGenre = genreButton[i].getAttribute("name");

    // console.log("hello");
    console.log(idGenre);

    allTracks.innerHTML = "";
    tableauTop = "";

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b824698b76mshc29d02afeecec35p15959cjsn24db764eeaad',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    getTrackByGenre(idGenre)
function getTrackByGenre(idGenre) {
    fetch('https://deezerdevs-deezer.p.rapidapi.com/playlist/' + idGenre, options)
        .then(response => response.json())
        .then(response => displayTrackByGenre(response, idGenre))
        .catch(err => console.error(err));

}
  
        function displayTrackByGenre(response, idGenre) {
            if(response.error){
                getTrackByGenre(idGenre)
            }{
                for(let i = 0; i < 50; i++) {
                    tableauTop += `  <tr class='track-container' id="${ response.tracks.data[i].id }" onclick=changeMusicInPlayer(this)>
                                        <td style="width:6%">
                                            <img id="albumCover" src="${ response.tracks.data[i].album.cover_big }" alt="albumImg">
                                        </td>
                                        <td style="width:1%">
                                            ${ i + 1 }.
                                        </td>
                                        <td style="width:36%">
                                            ${ response.tracks.data[i].title }
                                        </td>
                                        <td>
                                            <i id="heart" class="fa-regular fa-heart"></i>
                                        </td>
                                        <td>
                                            <i id="plus" class="fa-solid fa-plus"></i>
                                        </td>
                                        <td>
                                            ${ response.tracks.data[i].artist.name }
                                        </td>
                                        <td>
                                            ${ response.tracks.data[i].album.title }
                                        </td>
                                    </tr>`;
            }
            allTracks.innerHTML = tableauTop;
            }
            
        }
}

function changeMusicInPlayer(track){
    trackId = track.id;
    getTrack(trackId)

    sound.stop();
    startStopBtn.innerHTML = "<i class='fa-solid fa-play'></i>"; 
    elapsed = 0;
    inputPlayer.value = elapsed; 
    clearInterval(intervalId);
}


function fn_search() {
    titleTab.style.display = "none";
    divGenre.style.display = "none";
    divSwiper.style.display = "none";
    divSearch.style.marginBottom = "40px";

    console.log(search.value);

    allTracks.innerHTML = "";
    tableauTop = "";

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b824698b76mshc29d02afeecec35p15959cjsn24db764eeaad',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    getSearchResult(search);

    function getSearchResult(search){
        fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=' + search.value, options)
            .then(response => response.json())
            .then(response => displaySearchResult(response, search))
            .catch(err => console.error(err));
    }

    function displaySearchResult(response, search) {
        if(response.error){
            getSearchResult(search)
        }else{
            for(let i = 0; i < 25; i++) {
                tableauTop += `  <tr class='track-container' id="${ response.tracks.data[i].id }">
                                    <td style="width:6%">
                                        <img id="albumCover" src="${ response.data[i].album.cover_big }" alt="albumImg">
                                    </td>
                                    <td style="width:1%">
                                        ${ i + 1 }.
                                    </td>
                                    <td style="width:36%">
                                        ${ response.data[i].title }
                                    </td>
                                    <td>
                                        <i id="heart" class="fa-regular fa-heart"></i>
                                    </td>
                                    <td>
                                        <i id="plus" class="fa-solid fa-plus"></i>
                                    </td>
                                    <td>
                                        ${ response.data[i].artist.name }
                                    </td>
                                    <td>
                                        ${ response.data[i].album.title }
                                    </td>
                                </tr>`;
        }
        allTracks.innerHTML = tableauTop;
    }
}

}
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'b824698b76mshc29d02afeecec35p15959cjsn24db764eeaad',
// 		'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
// 	}
// };

// fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem', options)
// 	.then(response => response.json())
// 	.then(response => {
//         for(let i = 0; i < 1 ;i++) {
//             console.log(response.data);
//         }
//     })
// 	.catch(err => console.error(err));