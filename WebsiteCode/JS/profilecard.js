// ⭐⭐⭐⭐ FIXED: One card opens WITHOUT affecting the other ⭐⭐⭐⭐
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.profile-card');

    cards.forEach(card => {
        const btn        = card.querySelector('.profile-expand-btn');
        const content    = card.querySelector('.profile-card-expanded');

        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // <— CRITICAL: stops event from bubbling

            // Toggle ONLY this card
            const isExpanded = card.classList.contains('expanded');

            if (isExpanded) {
                // COLLAPSE
                card.classList.remove('expanded');
                content.style.maxHeight = '0px';
                content.style.opacity   = '0';
            } else {
                // EXPAND
                card.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity   = '1';
            }
        });

        /* Optional: clicking the header (avatar+name) also toggles */
        card.querySelector('.profile-card-main').addEventListener('click', () => {
            btn.click(); // re-use button click handler
        });
    });
});