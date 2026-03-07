/* ================================
   ANIMATION.JS - Split Text Animations
   Animates everything EXCEPT the dock
================================ */

gsap.registerPlugin(ScrollTrigger);

// Split text into characters or words
function splitTextIntoElements(element, type = "chars") {

    const text = element.textContent.trim();
    element.innerHTML = "";

    if (type === "chars") {

        for (let i = 0; i < text.length; i++) {

            const char = text[i];
            const span = document.createElement("span");
            span.className = "char";

            if (char === " ") {
                span.innerHTML = "&nbsp;";
            } else {
                span.textContent = char;
            }

            element.appendChild(span);
        }

        return element.querySelectorAll(".char");

    } else if (type === "words") {

        const words = text.split(/\s+/);

        words.forEach((word) => {

            const span = document.createElement("span");
            span.className = "word";
            span.textContent = word;

            element.appendChild(span);

        });

        return element.querySelectorAll(".word");
    }
}


// Initialize split text animations
function initSplitTextAnimations() {

    const splitElements = document.querySelectorAll(".split-text");

    splitElements.forEach((element, index) => {

        /* --------------------------------
           SKIP DOCK ELEMENTS
        -------------------------------- */

        if (element.closest(".dock")) {
            return;
        }

        const animationType = element.dataset.animation || "chars";

        const targets = splitTextIntoElements(element, animationType);

        if (!targets || targets.length === 0) {
            return;
        }

        /* --------------------------------
           INITIAL STATE
        -------------------------------- */

        gsap.set(targets, {
            opacity: 0,
            y: 60,
            rotateX: -50,
            transformPerspective: 600,
            transformOrigin: "center bottom"
        });

        /* --------------------------------
           CHECK IF ELEMENT IS ALREADY
           IN VIEWPORT
        -------------------------------- */

        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView) {

            gsap.to(targets, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1.4,
                ease: "expo.out",
                stagger: 0.05,
                delay: 0.4 + (index * 0.3),
                overwrite: "auto"
            });

        } else {

            gsap.to(targets, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1.4,
                ease: "expo.out",
                stagger: 0.05,

                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    once: true
                }
            });

        }

    });

}


// Initialize when DOM ready
if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", () => {
        requestAnimationFrame(initSplitTextAnimations);
    });

} else {

    requestAnimationFrame(initSplitTextAnimations);

}