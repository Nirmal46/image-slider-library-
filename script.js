
// Select the HTML elements used by the slider.
const track = document.querySelector(".slider-track");
const slides = Array.from(track.querySelectorAll(".slide"));

const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const dotsContainer = document.querySelector(".slider-dots");

const currentText = document.querySelector("#current");
const totalText = document.querySelector("#total");
const copyrightButton = document.querySelector("#copyright-button");

const slideCount = slides.length;

// Index 0 is reserved for the cloned last slide.
let currentIndex = 1;
let isAnimating = false;

// Clone the first and last slides to create infinite looping.
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slideCount - 1].cloneNode(true);

firstClone.setAttribute("aria-hidden", "true");
lastClone.setAttribute("aria-hidden", "true");

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

// Create navigation dots automatically.
const dots = [];

for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Show image ${i + 1}`);

    dot.addEventListener("click", () => {
        goToSlide(i + 1);
    });

    dotsContainer.appendChild(dot);
    dots.push(dot);
}

// Display the total number of images.
totalText.textContent = String(slideCount).padStart(2, "0");

// Calculate the real slide index, excluding the clones.
function getRealIndex() {
    return (currentIndex - 1 + slideCount) % slideCount;
}

// Update the slide position, counter, and active dot.
function updateSlider(animate = true) {
    track.style.transition = animate ? "" : "none";

    track.style.transform =
        `translateX(-${currentIndex * 100}%)`;

    const realIndex = getRealIndex();

    currentText.textContent =
        String(realIndex + 1).padStart(2, "0");

    dots.forEach((dot, index) => {
        const active = index === realIndex;

        dot.classList.toggle("active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
    });
}

// Move to the requested slide.
function goToSlide(index) {
    if (isAnimating) return;

    currentIndex = index;
    isAnimating = true;

    updateSlider(true);
}

// Move to the next image.
function showNext() {
    goToSlide(currentIndex + 1);
}

// Move to the previous image.
function showPrevious() {
    goToSlide(currentIndex - 1);
}

// Connect the buttons to their functions.
nextButton.addEventListener("click", showNext);
previousButton.addEventListener("click", showPrevious);

// Reset the position when a cloned slide is reached.
track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;

    if (currentIndex === slideCount + 1) {
        currentIndex = 1;
        updateSlider(false);
    } else if (currentIndex === 0) {
        currentIndex = slideCount;
        updateSlider(false);
    }

    isAnimating = false;
});

// Allow keyboard navigation with the left and right arrow keys.
const viewport = document.querySelector(".slider-viewport");

viewport.tabIndex = 0;

viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
    }
});

// Keep the slide correctly positioned when resizing the window.
window.addEventListener("resize", () => {
    updateSlider(false);
});

// Update the copyright year automatically.
document.querySelector("#year").textContent =
    new Date().getFullYear();

// Show a copyright notice when the footer button is clicked.
copyrightButton.addEventListener("click", () => {
    alert(
        `Copyright © ${new Date().getFullYear()} Wanderlust. All rights reserved.`
    );
});

// Show the first image when the page loads.
updateSlider(false);
