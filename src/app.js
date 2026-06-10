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

const skier = document.querySelector(".skier");
// Mouse must be this close to the sun before the sun prefers the cursor over the skier.
const sunGazeRadius = 220;

// Keep pupil movement tiny so the face feels subtle instead of frantic.
const pupilMaxOffset = 3;

// Component-local state only. Refreshing the page puts the sun back to sleep.
let sunAwakened = false;
let latestMousePosition = null;

// Cached after JS generates the SVG forest so scroll animation does not query the DOM every frame.
let forestBack = null;
let forestMid = null;
let forestFront = null;

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
      progress: 0.12,
      top: [125, 224, 235],
      middle: [77, 199, 210],
      bottom: [255, 219, 177],
    },
    {
      progress: 0.25,
      top: [255, 194, 150],
      middle: [246, 145, 91],
      bottom: [255, 216, 159],
    },
    {
      progress: 0.48,
      top: [241, 134, 87],
      middle: [222, 98, 73],
      bottom: [181, 132, 156],
    },
    {
      progress: 0.6,
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

const setSunPupilTarget = (target) => {
  if (!sunCharacter || !sunPupils.length) return;

  const sunBounds = sunCharacter.getBoundingClientRect();
  const sunCenterX = sunBounds.left + sunBounds.width / 2;
  const sunCenterY = sunBounds.top + sunBounds.height / 2;

  // Null target means neutral forward-looking eyes.
  const xProgress = target ? (target.x - sunCenterX) / sunBounds.width : 0;
  const yProgress = target ? (target.y - sunCenterY) / sunBounds.height : 0;

  const pupilX = Math.max(Math.min(xProgress * pupilMaxOffset, pupilMaxOffset), -pupilMaxOffset);
  const pupilY = Math.max(Math.min(yProgress * pupilMaxOffset, pupilMaxOffset), -pupilMaxOffset);

  sunPupils.forEach((pupil) => {
    pupil.style.setProperty("--pupil-x", `${pupilX}px`);
    pupil.style.setProperty("--pupil-y", `${pupilY}px`);
  });
};

const getSkierGazeTarget = () => {
  if (!skier) return null;

  const skierBounds = skier.getBoundingClientRect();

  // Aim at the skier's center instead of its top-left corner.
  return {
    x: skierBounds.left + skierBounds.width / 2,
    y: skierBounds.top + skierBounds.height / 2,
  };
};

const getSunGazeTarget = () => {
  if (!sunCharacter || !latestMousePosition) return getSkierGazeTarget();

  const sunBounds = sunCharacter.getBoundingClientRect();
  const sunCenterX = sunBounds.left + sunBounds.width / 2;
  const sunCenterY = sunBounds.top + sunBounds.height / 2;
  const xDistance = latestMousePosition.x - sunCenterX;
  const yDistance = latestMousePosition.y - sunCenterY;
  const mouseDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

  // Nearby mouse wins. Otherwise the sun watches the skier, or relaxes to neutral.
  return mouseDistance <= sunGazeRadius ? latestMousePosition : getSkierGazeTarget();
};

const updateSunPupils = () => {
  if (!sunAwakened) return;

  setSunPupilTarget(getSunGazeTarget());
};

const scheduleSunBlink = () => {
  if (!sunAwakened || !sunCharacter) return;

  // Randomized delay keeps the blink from feeling mechanical.
  const blinkDelay = 2200 + Math.random() * 4200;

  // Assign this timeout to an id if we need to cancel blinking later.
  window.setTimeout(() => {
    sunCharacter.classList.add("is-blinking");

    window.setTimeout(() => {
      sunCharacter.classList.remove("is-blinking");
      scheduleSunBlink();
    }, 130);
  }, blinkDelay);
};

const clickIsInsideSun = (event) => {
  if (!sunCharacter) return false;

  const sunBounds = sunCharacter.getBoundingClientRect();

  return (
    event.clientX >= sunBounds.left &&
    event.clientX <= sunBounds.right &&
    event.clientY >= sunBounds.top &&
    event.clientY <= sunBounds.bottom
  );
};

const handleSunSceneClick = (event) => {
  if (sunAwakened || !clickIsInsideSun(event)) return;

  awakenSun();
};

const updateSunCursor = (event) => {
  if (sunAwakened || !parallaxScene) return;

  parallaxScene.style.cursor = clickIsInsideSun(event) ? "pointer" : "";
};

const awakenSun = () => {
  if (sunAwakened || !sunCharacter) return;

  sunAwakened = true;
  sunCharacter.classList.add("is-awakened");

  // Once awake, the sun is decorative again instead of an actionable button.
  sunCharacter.setAttribute("aria-label", "Awakened sun");
  sunCharacter.removeAttribute("role");
  sunCharacter.removeAttribute("tabindex");

  updateSunPupils();
  scheduleSunBlink();
  if (parallaxScene) parallaxScene.style.cursor = "";
};

const handleSunKeydown = (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  awakenSun();
};

const updateMousePosition = (event) => {
  latestMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };

  updateSunPupils();
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

  if (skier) {
    // Simple scroll-tied motion: implied skiing, not physics.
    const skierX = lerp(42, 58, progress);
    const skierY = lerp(58, 72, progress);

    skier.style.left = `${skierX}%`;
    skier.style.top = `${skierY}%`;
  }

  if (forestBack) {
    forestBack.style.transform = `translateY(${-progress * 12}px) scaleX(${1 + progress * 0.4}) scaleY(${1 + progress * 1.8})`;
  }

  if (forestMid) {
    forestMid.style.transform = `translateY(${-progress * 22}px) scaleX(${1 + progress * 0.6}) scaleY(${1 + progress * 2})`;
  }

  if (forestFront) {
    forestFront.style.transform = `translateY(${-progress * 36}px) scaleX(${1 + progress * 0.8}) scaleY(${1 + progress * 2.8})`;
  }

  // Keeps the sun's gaze correct as scrolling moves the sun/skier around.
  updateSunPupils();

  parallaxTicking = false;
};

// FOREST GENERATION

const forestLine = document.querySelector(".forest-line");

const seededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

const createTreePath = (x, groundY, width, height, lean) => {
  const trunkWidth = width * 0.16;
  const topX = x + lean;
  const left = x - width / 2;
  const right = x + width / 2;

  return `
  M ${x - trunkWidth / 2} ${groundY}
  L ${x + trunkWidth / 2} ${groundY}
  L ${x + trunkWidth / 2} ${groundY - height * 0.2}
    L ${right} ${groundY - height * 0.28}
    L ${x + width * 0.26} ${groundY - height * 0.38}
    L ${right * 0.98 + x * 0.02} ${groundY - height * 0.48}
    L ${x + width * 0.2} ${groundY - height * 0.6}
    L ${x + width * 0.34} ${groundY - height * 0.72}
    L ${topX} ${groundY - height}
    L ${x - width * 0.34} ${groundY - height * 0.72}
    L ${x - width * 0.2} ${groundY - height * 0.6}
    L ${left} ${groundY - height * 0.48}
    L ${x - width * 0.26} ${groundY - height * 0.38}
    L ${left} ${groundY - height * 0.28}
    L ${x - trunkWidth / 2} ${groundY - height * 0.2}
    Z
    `;
};

const createForestLayer = ({
  className,
  color,
  seed,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  spacing,
}) => {
  if (!forestLine) return;

  const random = seededRandom(seed);
  const layer = document.createElement("div");
  layer.className = `forest-layer ${className}`;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1200 320");
  svg.setAttribute("preserveAspectRatio", "none");

  const groundY = 320;
  let x = -40;

  while (x < 1240) {
    const width = minWidth + random() * (maxWidth - minWidth);
    const height = minHeight + random() * (maxHeight - minHeight);
    const lean = (random() - 0.5) * width * 0.25;

    const tree = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tree.setAttribute("d", createTreePath(x, groundY, width, height, lean));
    tree.setAttribute("fill", color);
    svg.appendChild(tree);

    x += spacing * (0.65 + random() * 0.8);
  }

  const ground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  ground.setAttribute("x", "0");
  ground.setAttribute("y", "285");
  ground.setAttribute("width", "1200");
  ground.setAttribute("height", "40");
  ground.setAttribute("fill", color);
  svg.appendChild(ground);

  layer.appendChild(svg);
  forestLine.appendChild(layer);
};

const createForest = () => {
  createForestLayer({
    className: "forest-layer-back",
    color: "#315f3f",
    seed: 11,
    minHeight: 70,
    maxHeight: 150,
    minWidth: 34,
    maxWidth: 70,
    spacing: 38,
  });

  createForestLayer({
    className: "forest-layer-mid",
    color: "#173f2a",
    seed: 29,
    minHeight: 95,
    maxHeight: 210,
    minWidth: 42,
    maxWidth: 92,
    spacing: 46,
  });

  createForestLayer({
    className: "forest-layer-front",
    color: "#082717",
    seed: 47,
    minHeight: 130,
    maxHeight: 285,
    minWidth: 54,
    maxWidth: 118,
    spacing: 58,
  });

  forestBack = document.querySelector(".forest-layer-back");
  forestMid = document.querySelector(".forest-layer-mid");
  forestFront = document.querySelector(".forest-layer-front");
};

createForest();

const requestParallaxUpdate = () => {
  if (reduceMotion.matches || parallaxTicking) return;

  parallaxTicking = true;
  window.requestAnimationFrame(updateParallaxLayers);
};

if (parallaxScene && parallaxLayers.length) {
  // Set the correct positions on page load before the user scrolls.
  updateParallaxLayers();

  if (sunCharacter) {
    parallaxScene.addEventListener("click", handleSunSceneClick);
    sunCharacter.addEventListener("keydown", handleSunKeydown);
  }
  // Scroll drives the movement; resize updates the math when hero height changes.
  window.addEventListener("scroll", requestParallaxUpdate);
  window.addEventListener("resize", requestParallaxUpdate);
  window.addEventListener("mousemove", updateMousePosition);
  window.addEventListener("mousemove", updateSunCursor);
}
