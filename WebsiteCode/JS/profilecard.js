/* ================================
   PROFILECARD.JS - Expandable Card
   ================================ */

const profileCard = document.querySelector('.profile-card');
const expandBtn = document.querySelector('.profile-expand-btn');

if (expandBtn && profileCard) {
    expandBtn.addEventListener('click', function () {
        profileCard.classList.toggle('expanded');
    });

    console.log('Profile card initialized');
}