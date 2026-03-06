//its me Golonka himself with some fixes again lmao I hope it works now I rewrited it like 3 times; Update : 4 times

const cards = document.querySelectorAll(".profile-card");

cards.forEach(card => {
    const btn = card.querySelector(".profile-expand-btn");
    const content = card.querySelector(".profile-card-expanded");

    btn.addEventListener("click", () => {
        const isExpanded = card.classList.contains("expanded");

        if (isExpanded) {
            content.style.maxHeight = null;
            card.classList.remove("expanded");
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            card.classList.add("expanded");
        }
    });
});
