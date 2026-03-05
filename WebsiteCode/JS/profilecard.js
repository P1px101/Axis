/* ================================
   PROFILECARD.JS - Expandable Card
   ================================ */

const profileCard = document.querySelector('.profile-card');
const expandBtn = document.querySelector('.profile-expand-btn');
const profileDesc = document.querySelector('.profile-desc');

function fitTextToCard() {

    if (!profileDesc) return;

    let size = 8; // starting font size (px)
    profileDesc.style.fontSize = size + "px";

    const container = profileDesc.parentElement;

    while (profileDesc.scrollHeight > container.clientHeight && size > 6) {
        size--;
        profileDesc.style.fontSize = size + "px";
    }
}

if (expandBtn && profileCard) {

    expandBtn.addEventListener('click', function() {

        profileCard.classList.toggle('expanded');

        // wait for expand animation to finish before resizing text
        setTimeout(fitTextToCard, 350);

    });

    console.log('Profile card initialized');

}

// also run on load and resize
window.addEventListener("load", fitTextToCard);
window.addEventListener("resize", fitTextToCard);