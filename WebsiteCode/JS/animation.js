/* ================================
   AXIS TEXT ANIMATION
================================ */

gsap.registerPlugin(ScrollTrigger);

/* ================================
   SPLIT TEXT
================================ */

function splitText(element) {

    const text = element.textContent;
    element.innerHTML = "";

    const chars = [];

    for (let i = 0; i < text.length; i++) {

        const span = document.createElement("span");
        span.classList.add("char");

        if (text[i] === " ") {
            span.innerHTML = "&nbsp;";
        } else {
            span.textContent = text[i];
        }

        element.appendChild(span);
        chars.push(span);
    }

    return chars;
}

/* ================================
   INIT ANIMATIONS
================================ */

function initAnimations() {

    const elements = document.querySelectorAll(".split-text");

    elements.forEach((element) => {

        /* Skip dock elements */
        if (element.closest(".dock")) return;

        const chars = splitText(element);

        gsap.set(chars, {
            opacity: 0,
            y: 60,
            rotateX: -60,
            transformPerspective: 800
        });

        gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.04,

            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                once: true
            }
        });

    });

}

/* ================================
   START
================================ */

document.addEventListener("DOMContentLoaded", initAnimations);