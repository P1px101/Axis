// ⭐ FIXED: Each card opens/closes independently
// ⭐ FIXED: Social buttons are now clickable
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.profile-card');

    cards.forEach(card => {
        const header  = card.querySelector('.profile-card-main');
        const content = card.querySelector('.profile-card-expanded');

        // Only listen on the header, NOT the button separately
        header.addEventListener('click', (e) => {
            
            // ⭐ Check if click was on a social button or inside one
            const clickedSocial = e.target.closest('.social-btn');
            if (clickedSocial) {
                // Don't toggle card, let the link work normally
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            // Toggle ONLY this card
            const isExpanded = card.classList.contains('expanded');

            if (isExpanded) {
                // COLLAPSE
                card.classList.remove('expanded');
                content.style.maxHeight = '0px';
                content.style.opacity   = '0';
                content.style.padding   = '0 18px';
            } else {
                // EXPAND
                card.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity   = '1';
                content.style.padding   = '12px 18px 16px 18px';
            }
        });
    });
});