/* ================================
   TEXTANIM.JS - Split Text Animations
   ================================ */

gsap.registerPlugin(ScrollTrigger);

// Split text into characters or words
function splitTextIntoElements(element, type = 'chars') {
    const text = element.textContent.trim();
    element.innerHTML = '';
    
    if (type === 'chars') {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.className = 'char';
            
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            
            element.appendChild(span);
        }
        return element.querySelectorAll('.char');
        
    } else if (type === 'words') {
        const words = text.split(/\s+/);
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            element.appendChild(span);
        });
        return element.querySelectorAll('.word');
    }
}

// Initialize split text animations
function initSplitTextAnimations() {
    const splitElements = document.querySelectorAll('.split-text');
    
    splitElements.forEach((element, index) => {
        const animationType = element.dataset.animation || 'chars';
        const targets = splitTextIntoElements(element, animationType);
        
        // Set initial state
        gsap.set(targets, {
            opacity: 0,
            y: 60,
            rotateX: -50
        });
        
        // Check if element is in viewport
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight;
        
        if (isInView) {
            // Animate immediately
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1.4,
                ease: 'expo.out',
                stagger: 0.05,
                delay: 0.4 + (index * 0.3)
            });
        } else {
            // Animate on scroll
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1.4,
                ease: 'expo.out',
                stagger: 0.05,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    once: true
                }
            });
        }
    });
    
    console.log('Text animations initialized');
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplitTextAnimations);
} else {
    setTimeout(initSplitTextAnimations, 100);
}