console.log('ça marche');
const btn = document.querySelector('.playlist-btn');

let isPlModalOpen = false;
btn.onclick = () => {
    const modal = btn.parentNode.querySelector('.add-on-pl-modal'); 
    if ( isPlModalOpen == false) {
        modal.style.display= 'initial';
    } 
    closeBtn(modal);
} 

function closeBtn(modal){
    document.onmouseup = (e) => {
        if(e.target != modal){
            modal.style.display= 'none';
        }
    }
}

