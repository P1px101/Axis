/* ================================
   PROFILECARD.JS - Expandable Card with some changes by Golonka
   ================================ */

const cards = document.querySelectorAll(".profile-card");

cards.forEach(card => {
    const btn = card.querySelector(".profile-expand-btn");

    btn.addEventListener("click", () => {
        card.classList.toggle("expanded");
    });
});
