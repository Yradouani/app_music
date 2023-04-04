const nav = document.querySelector('#mobile-nav');
menuBurger(window.innerWidth);

window.onresize = () => {
    menuBurger(window.innerWidth);
}

function menuBurger(screenWidth) {
    if (screenWidth > 768) {
        nav.style.display = "initial";
    } else {
        mobile();
    }
}

function mobile() {
    nav.style.display = 'none';
    const openBtn = document.querySelector('button.menu-burger');
    const closeBtn = document.querySelector('.menu-title button i');

    openBtn.onclick = () => {
        toggler(100, 0, 'initial', 300, 0)
    };

    // Le menu se ferme au clique à l'exterieur du menu
    document.addEventListener("mouseup", (event) => {
        if (!nav.contains(event.target)) {
            toggler(0, 100, 'none', 0, 300);
        }
    })

    closeBtn.onclick = () => {
        isOpen = false;
        toggler(0, 100, 'none', 0, 300)
    };

    function toggler(start, end, display, animateTo, displayTo) {

        const animation = [
            { transform: `translate(${start}%)` },
            { transform: `translate(${end}%)` },
        ];

        const timing = {
            duration: 300,
            iterations: 1,
        };

        setTimeout(() => {
            nav.animate(animation, timing);
        }, animateTo);

        setTimeout(() => {
            nav.style.transform = `translate(0%)`;
        }, displayTo);

        setTimeout(() => {
            nav.style.display = display;
        }, 300);
    }
}
