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
        if(!modal.contains(e.target)){
            modal.style.display= 'none';
        }
    }
}

