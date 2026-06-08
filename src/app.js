
// SETTING UP MY POPUP VIDEOS
$(document).ready(function() {
  $(".popup").magnificPopup({
    type: "iframe"
  })
})

// CHANGING FONT ON LANDING PAGE
let subTitle = document.getElementById("sub-title");

let messageNum = 0;
const changeSubTitle = () => {
  let subTitles = [
    "passionate.",
    "systems thinker.",
    "integration builder.",
    "software engineer."
  ];
  setTimeout(() => {
    subTitle.style.opacity = 1;
    subTitle.innerText = subTitles[messageNum];
  }, 1000);
  messageNum ++;
  if (messageNum > subTitles.length -1) {
    messageNum = 0;
  };
}

setInterval(() => {
  subTitle.style.opacity = 0;
  changeSubTitle();
}, 4000);


// PARALLAX HERO SCENE

// The hero section controls the scroll range for the parallax effect.
const parallaxScene = document.querySelector(".top-container");

// Every image with this class can move independently using data-y-start/data-y-end.
const parallaxLayers = document.querySelectorAll(".scene-layer");

// Respect users who prefer reduced motion. Parallax is decorative, not required.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Prevents us from scheduling multiple animation frames during rapid scroll events.
let parallaxTicking = false;

const getScrollProgress = () => {
  if (!parallaxScene) return 0;

  // Use the hero height as the full parallax range.
  // At top of page: progress is 0.
  // After scrolling one hero-height: progress is 1.
  const sceneHeight = parallaxScene.offsetHeight;
  const progress = window.scrollY / sceneHeight;

  // Clamp progress so layer movement stays between its intended start/end values.
  return Math.min(Math.max(progress, 0), 1);
};

const updateParallaxLayers = () => {
  const progress = getScrollProgress();

  parallaxLayers.forEach((layer) => {
    // These values come from the HTML, e.g. data-y-start="0" data-y-end="70".
    const yStart = Number(layer.dataset.yStart || 0);
    const yEnd = Number(layer.dataset.yEnd || 0);

    // Interpolate between start and end based on current scroll progress.
    // Example: start 0, end 100, progress 0.5 => 50px.
    const yOffset = yStart + (yEnd - yStart) * progress;

    // Use transform instead of top/margin so the browser can animate cheaply.
    layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
  });

  parallaxTicking = false;
};

const requestParallaxUpdate = () => {
  if (reduceMotion.matches || parallaxTicking) return;

  parallaxTicking = true;
  window.requestAnimationFrame(updateParallaxLayers);
};

if (parallaxScene && parallaxLayers.length) {
  // Set the correct positions on page load before the user scrolls.
  updateParallaxLayers();

  // Scroll drives the movement; resize updates the math when hero height changes.
  window.addEventListener("scroll", requestParallaxUpdate);
  window.addEventListener("resize", requestParallaxUpdate);
}