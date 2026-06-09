// SETTING UP MY POPUP VIDEOS
$(document).ready(function () {
  $(".popup").magnificPopup({
    type: "iframe",
  });
});

// CHANGING FONT ON LANDING PAGE
let subTitle = document.getElementById("sub-title");

let messageNum = 0;
const changeSubTitle = () => {
  let subTitles = ["passionate.", "systems thinker.", "integration builder.", "software engineer."];
  setTimeout(() => {
    subTitle.style.opacity = 1;
    subTitle.innerText = subTitles[messageNum];
  }, 1000);
  messageNum++;
  if (messageNum > subTitles.length - 1) {
    messageNum = 0;
  }
};

setInterval(() => {
  subTitle.style.opacity = 0;
  changeSubTitle();
}, 4000);

// PARALLAX HERO SCENE

// The hero section controls the scroll range for the parallax effect.
const parallaxScene = document.querySelector(".top-container");

// Every image with this class can move independently using data-y-start/data-y-end.
const parallaxLayers = document.querySelectorAll(".scene-layer");

// The sun character is a special layer for containing the sun's pupils.
const sunCharacter = document.querySelector(".sun-character");

// These are the sun's pupils that will track the user's mouse position with a custom effect.
const sunPupils = document.querySelectorAll(".sun-pupil");

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

// Convert simple CSS length values from data attributes into pixels for transform math.
// Supports rem for readable scene-scale movement, px for exact offsets, and plain numbers as pixels.
const getCssLength = (value, fallback = "0rem") => {
  const rawValue = value || fallback;

  if (rawValue.endsWith("rem")) {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(rawValue) * rootFontSize;
  }

  if (rawValue.endsWith("px")) {
    return parseFloat(rawValue);
  }

  return Number(rawValue || 0);
};

// Means Linear interpolation: returns a value between start and end based on progress from 0 to 1.
const lerp = (start, end, progress) => start + (end - start) * progress;

const lerpColor = (startColor, endColor, progress) => {
  // Calculate each RGB channel separately, then round to whole numbers for CSS.
  return startColor.map((channel, index) => Math.round(lerp(channel, endColor[index], progress)));
};

// Convert an RGB array into a CSS color string.
const rgb = (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

const getSkyColors = (progress) => {
  /*
    These color stops create the day-to-dusk story across the hero scroll.
    Each stop owns a progress point, then we interpolate between neighboring stops.
  */
  const stops = [
    {
      progress: 0,
      top: [101, 217, 240],
      middle: [15, 182, 204],
      bottom: [183, 238, 247],
    },
    {
      progress: 0.3,
      top: [125, 224, 235],
      middle: [77, 199, 210],
      bottom: [255, 219, 177],
    },
    {
      progress: 0.58,
      top: [255, 194, 150],
      middle: [246, 145, 91],
      bottom: [255, 216, 159],
    },
    {
      progress: 0.82,
      top: [241, 134, 87],
      middle: [222, 98, 73],
      bottom: [181, 132, 156],
    },
    {
      progress: 1,
      top: [121, 123, 171],
      middle: [184, 111, 133],
      bottom: [238, 163, 123],
    },
  ];

  // Find the first color stop at or after the current scroll progress.
  const endStop = stops.find((stop) => stop.progress >= progress) || stops[stops.length - 1];
  // Use the stop immediately before it as the start of this blend segment. If we are already at the first stop, start and end are the same.
  const startStop = stops[Math.max(stops.indexOf(endStop) - 1, 0)];
  // Calculate how far we are between the start and end stops, as a 0-1 progress value.
  const stopRange = endStop.progress - startStop.progress || 1;
  // This value drives the interpolation between the two stops for each color channel.
  const stopProgress = (progress - startStop.progress) / stopRange;

  return {
    top: lerpColor(startStop.top, endStop.top, stopProgress),
    middle: lerpColor(startStop.middle, endStop.middle, stopProgress),
    bottom: lerpColor(startStop.bottom, endStop.bottom, stopProgress),
  };
};

const updateSky = (progress) => {
  if (!parallaxScene) return;

  const skyColors = getSkyColors(progress);

  parallaxScene.style.setProperty("--sky-top", rgb(skyColors.top));
  parallaxScene.style.setProperty("--sky-middle", rgb(skyColors.middle));
  parallaxScene.style.setProperty("--sky-bottom", rgb(skyColors.bottom));
};

const updateSunPupils = (event) => {
  if (!sunCharacter || !sunPupils.length) return;

  /*
  Track the mouse from the center of the sun, then clamp movement hard.
  The tiny range keeps the sun playful instead of making it stare like a creep.
  */
  const sunBounds = sunCharacter.getBoundingClientRect();
  const sunCenterX = sunBounds.left + sunBounds.width / 2;
  const sunCenterY = sunBounds.top + sunBounds.height / 2;

  const xProgress = (event.clientX - sunCenterX) / sunBounds.width;
  const yProgress = (event.clientY - sunCenterY) / sunBounds.height;
  const pupilMaxOffset = 3;

  const pupilX = Math.max(Math.min(xProgress * pupilMaxOffset, pupilMaxOffset), -pupilMaxOffset);
  const pupilY = Math.max(Math.min(yProgress * pupilMaxOffset, pupilMaxOffset), -pupilMaxOffset);

  sunPupils.forEach((pupil) => {
    pupil.style.setProperty("--pupil-x", `${pupilX}px`);
    pupil.style.setProperty("--pupil-y", `${pupilY}px`);
  });
};

const updateParallaxLayers = () => {
  const progress = getScrollProgress();
  updateSky(progress);

  parallaxLayers.forEach((layer) => {
    // These values come from the HTML data values.
    const xStart = getCssLength(layer.dataset.xStart);
    const xEnd = getCssLength(layer.dataset.xEnd);
    const yStart = getCssLength(layer.dataset.yStart);
    const yEnd = getCssLength(layer.dataset.yEnd);
    const scaleStart = Number(layer.dataset.scaleStart || 1);
    const scaleEnd = Number(layer.dataset.scaleEnd || 1);

    // Interpolate between start and end based on current scroll progress.
    const xOffset = xStart + (xEnd - xStart) * progress;
    const yOffset = yStart + (yEnd - yStart) * progress;
    const scale = scaleStart + (scaleEnd - scaleStart) * progress;

    // Apply the calculated X/Y offsets with translate3d so movement stays on the compositor path.
    layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`;
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
  window.addEventListener("mousemove", updateSunPupils);
}
