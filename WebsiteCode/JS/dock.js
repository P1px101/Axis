/* ================================
   DOCK.JS - Navigation & Indicator
   ================================ */

const navBtns = document.querySelectorAll('.nav-btn');
const navIndicator = document.querySelector('.nav-indicator');
const navLinks = document.querySelector('.nav-links');

// Position the indicator on a button
function moveIndicator(button) {
    const btnRect = button.getBoundingClientRect();
    const navRect = navLinks.getBoundingClientRect();
    
    const left = btnRect.left - navRect.left;
    const width = btnRect.width;
    
    navIndicator.style.left = left + 'px';
    navIndicator.style.width = width + 'px';
}

// Initialize indicator position
function initIndicator() {
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        navIndicator.style.transition = 'none';
        moveIndicator(activeBtn);
        setTimeout(() => {
            navIndicator.style.transition = 'all 0.4s cubic-bezier(0.68, -0.15, 0.32, 1.15)';
        }, 50);
    }
}

// Handle navigation clicks
navBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        navBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Move indicator
        moveIndicator(this);
        
        // Get section ID from href attribute (removes the #)
        const href = this.getAttribute('href');
        const sectionId = href.replace('#', '');
        const section = document.getElementById(sectionId);
        
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active button on scroll
function updateActiveOnScroll() {
    const sections = document.querySelectorAll('#home, #releases');
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const sectionId = section.getAttribute('id');
            
            navBtns.forEach(btn => {
                const btnHref = btn.getAttribute('href');
                btn.classList.remove('active');
                if (btnHref === '#' + sectionId) {
                    btn.classList.add('active');
                    moveIndicator(btn);
                }
            });
        }
    });
}

// Event listeners
window.addEventListener('scroll', updateActiveOnScroll);
window.addEventListener('load', initIndicator);
window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) moveIndicator(activeBtn);
});

console.log('Dock navigation initialized');