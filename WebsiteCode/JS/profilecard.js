//its me Golonka himself with some fixes again lmao I hope it works now I rewrited it like 3 times; Update : 4 times
const cards = document.querySelectorAll(".profile-card");

cards.forEach(card => {
    const btn = card.querySelector(".profile-expand-btn");
    const content = card.querySelector(".profile-card-expanded");

    btn.addEventListener("click", () => {
        // Jeśli już jest rozwinięta -> zamknij
        if (card.classList.contains("expanded")) {
            content.style.maxHeight = null;
            card.classList.remove("expanded");
        } else {
            // Otwórz tylko tę kartę
            content.style.maxHeight = content.scrollHeight + "px";
            card.classList.add("expanded");
        }
    });
});
