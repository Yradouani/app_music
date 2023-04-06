let allTracks = document.getElementById("allTracks");
let buttons = document.getElementsByClassName("genreButton");
let tableauTop100 = "";

for(let i = 0; i < 100; i++) {
    tableauTop100 += `  <tr>
                        <td style="width:6%">
                            <img id="albumCover" src="assets/images/albumCover.jpg" alt="albumImg">
                        </td>
                        <td style="width:1%">
                            ${ i }.
                        </td>
                        <td style="width:36%">
                            Flowers
                        </td>
                        <td>
                            <i id="heart" class="fa-regular fa-heart"></i>
                        </td>
                        <td>
                            <i id="plus" class="fa-solid fa-plus"></i>
                        </td>
                        <td>Miley Cyrus</td>
                        <td>Flowers</td>
                        </tr>`;
}

allTracks.innerHTML = tableauTop100;

