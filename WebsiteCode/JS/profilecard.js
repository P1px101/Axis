document.querySelectorAll(".profile-card").forEach(function (card) {
    var btn = card.querySelector(".profile-expand-btn");
    var content = card.querySelector(".profile-card-expanded");

    if (!btn || !content) return;

    btn.addEventListener("click", function (e) {
        e.stopPropagation();

        var isExpanded = card.classList.contains("expanded");

        if (isExpanded) {
            // collapse this card
            content.style.maxHeight = "0px";
            content.style.paddingTop = "0px";
            content.style.paddingBottom = "0px";
            card.classList.remove("expanded");
        } else {
            // expand this card only
            content.style.paddingTop = "0px";
            content.style.paddingBottom = "18px";
            content.style.maxHeight = content.scrollHeight + 18 + "px";
            card.classList.add("expanded");
        }
    });
});