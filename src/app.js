// POPUP VIDEOS
$(document).ready(function () {
  $(".popup").magnificPopup({
    type: "iframe",
  });
});

// SUBTITLE
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

// DOM REFERENCES

const parallaxScene = document.querySelector(".top-container");
const parallaxLayers = document.querySelectorAll(".scene-layer[data-x-start]");
const sunCharacter = document.querySelector(".sun-character");
const sunPupils = document.querySelectorAll(".sun-pupil");
const finalSkierRest = document.querySelector(".final-skier-rest");
const cabinCharacter = document.querySelector(".cabin-character");
const skier = document.querySelector(".mountain-skier");
const pathMarkersLayer = document.querySelector(".path-markers");
const suppliesCabin = document.querySelector(".supplies-cabin");
const cabinUnlocksLayer = document.querySelector(".cabin-unlocks");
const routeMarkers = [...document.querySelectorAll(".route-marker")];
const liftTopTerminal = document.querySelector(".lift-terminal-top");
const liftCar = document.querySelector(".lift-car");
const liftCableSegments = [...document.querySelectorAll("[data-lift-cable-segment]")];
const liftBottomTerminal = document.querySelector(".lift-terminal-bottom");
const forestMist = document.querySelector(".forest-mist");
const forestLine = document.querySelector(".forest-line");
const profileCavern = document.querySelector(".profile-cavern");
const profileRooms = [...document.querySelectorAll(".profile-room[data-room]")];
const profileHelloRoom = document.querySelector(".profile-room-hello");

// STATE AND CONSTANTS

const sunGazeRadius = 220;
const pupilMaxOffset = 3;

const skierStates = {
  hidden: "hidden",
  ready: "ready",
  running: "running",
  crashed: "crashed",
  finished: "finished",
  complete: "complete",
};

const progressionState = {
  cabinState: "sleeping",
  cabinLevel: 0,
  skierState: skierStates.hidden,
};

const cabinStates = ["sleeping", "smoking", "lit", "activated"];

// Time-based route duration keeps skier control separate from scenery scroll.
const skierRunDuration = 1800;
const defaultCrashChance = 0.22;

let skierRun = {
  animationFrameId: null,
  startedAt: 0,
  progress: 0,
  hasCrash: false,
  crashProgress: null,
  routeId: "easyMountainRoute",
};

const liftReturnDelay = 4000;
const liftReturnDuration = 4000;

let liftReturn = {
  timeoutId: null,
  animationFrameId: null,
  startedAt: 0,
};

let sunAwakened = false;
let latestMousePosition = null;

let forestBack = null;
let forestMid = null;
let forestFront = null;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactMountainViewport = window.matchMedia("(max-width: 1000px)");

let parallaxTicking = false;

const profileCartTargets = {
  hello: {
    row: "top",
    side: "left",
    x: "25%",
    y: "30%",
    // Room-specific parking stops happen after the normal rail arrival.
    // They reverse before leaving, so each room can tuck the cart into its own scene.
    parkedStops: [{ x: "25%", y: "22%" }],
  },
  recent: { row: "top", side: "right", x: "76%", y: "30%" },
  story: { row: "bottom", side: "left", x: "24%", y: "72%", hideCartWhenParked: true },
  work: { row: "bottom", side: "right", x: "76%", y: "72%", hideCartWhenParked: true },
};

const profileLiftRows = {
  top: "38%",
  bottom: "80%",
};

const profileCartShaftX = "50%";
const profileCartMoveDelay = 850;

let profileCartState = {
  room: null,
  row: "top",
  side: "center",
  isMoving: false,
  pendingRoom: null,
};

// SHARED HELPERS

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

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const setActiveProfileRoom = (roomId) => {
  if (profileCavern) {
    profileCavern.classList.toggle("has-active-room", Boolean(roomId));
  }

  profileRooms.forEach((room) => {
    room.classList.toggle("is-active", room.dataset.room === roomId);
  });
};

const setProfileCartPosition = (target) => {
  if (!profileCavern || !target) return;

  profileCavern.style.setProperty("--cart-x", target.x);
  profileCavern.style.setProperty("--cart-y", target.y);
};

const setProfileCartDirection = (side) => {
  if (!profileCavern) return;

  profileCavern.style.setProperty("--cart-direction", side === "left" ? -1 : 1);
};

const setProfileLiftRow = (row) => {
  if (!profileCavern || !profileLiftRows[row]) return;

  profileCavern.style.setProperty("--profile-lift-y", profileLiftRows[row]);
};

const setProfileCartHidden = (isHidden) => {
  if (!profileCavern) return;

  profileCavern.classList.toggle("is-profile-cart-hidden", isHidden);
};

const moveProfileCartThroughStops = async (stops, delay = profileCartMoveDelay * 0.55) => {
  for (const stop of stops) {
    setProfileCartPosition(stop);
    await wait(delay);
  }
};

const getProfileCartParkedStops = (roomId) => profileCartTargets[roomId]?.parkedStops || [];
const getProfileCartFinalStop = (roomId) => {
  const parkedStops = getProfileCartParkedStops(roomId);

  return parkedStops[parkedStops.length - 1] || profileCartTargets[roomId];
};

const exitProfileCartParking = async () => {
  if (!profileCartState.room) return;

  const currentTarget = profileCartTargets[profileCartState.room];
  const parkedStops = getProfileCartParkedStops(profileCartState.room);
  if (!currentTarget || !parkedStops.length) return;

  // The cart is sitting at the last parked stop. Walk backward through any intermediate
  // parking stops, then return to the room's rail stop before heading for the shaft.
  await moveProfileCartThroughStops([...parkedStops].slice(0, -1).reverse());
  setProfileCartPosition(currentTarget);
  await wait(profileCartMoveDelay * 0.55);
};

const revealHelloRoom = () => {
  // One-way reveal: once the cart has entered Hello, only a page refresh resets it.
  if (!profileHelloRoom) return;

  profileHelloRoom.classList.add("has-entered-hello");
};

const moveProfileCartToRoom = async (roomId) => {
  const target = profileCartTargets[roomId];
  if (!profileCavern || !target) return;

  if (profileCartState.isMoving) {
    profileCartState.pendingRoom = roomId;
    return;
  }

  if (profileCartState.room === roomId) {
    setActiveProfileRoom(roomId);
    return;
  }

  profileCartState.isMoving = true;
  setProfileCartHidden(false);
  profileCavern.classList.add("is-profile-cart-moving");
  setActiveProfileRoom(null);

  if (reduceMotion.matches) {
    setProfileCartDirection(target.side);
    setProfileLiftRow(target.row);
    setProfileCartPosition(getProfileCartFinalStop(roomId));
  } else {
    await exitProfileCartParking();

    // Phase 1: move horizontally from the current room into the central shaft.
    // If the cart starts in the shaft, there is no room-to-shaft move yet.
    if (profileCartState.room) {
      setProfileLiftRow(profileCartState.row);
      setProfileCartDirection(profileCartState.side === "left" ? "right" : "left");
      setProfileCartPosition({
        x: profileCartShaftX,
        y: profileCartTargets[profileCartState.room].y,
      });
      await wait(profileCartMoveDelay);
    }

    // Phase 2: ride the lift between rail rows when the destination is on another row.
    if (profileCartState.row !== target.row) {
      setProfileLiftRow(target.row);
      setProfileCartPosition({ x: profileCartShaftX, y: target.y });
      await wait(profileCartMoveDelay);
    }

    // Phase 3: leave the shaft and roll toward the destination room.
    setProfileCartDirection(target.side);
    setProfileCartPosition(target);
    await wait(profileCartMoveDelay);
    await moveProfileCartThroughStops(getProfileCartParkedStops(roomId));
  }

  profileCartState = {
    ...profileCartState,
    room: roomId,
    row: target.row,
    side: target.side,
    isMoving: false,
  };

  profileCavern.classList.remove("is-profile-cart-moving");
  setActiveProfileRoom(roomId);
  setProfileCartHidden(Boolean(target.hideCartWhenParked));

  if (roomId === "hello") {
    revealHelloRoom();
  }

  if (profileCartState.pendingRoom && profileCartState.pendingRoom !== roomId) {
    const pendingRoom = profileCartState.pendingRoom;
    profileCartState.pendingRoom = null;
    moveProfileCartToRoom(pendingRoom);
  } else {
    profileCartState.pendingRoom = null;
  }
};

const initProfileCart = () => {
  if (!profileCavern || !profileRooms.length) return;

  // Start parked in the shaft. Later this can become the forest-floor entry/lift drop.
  setProfileCartDirection("right");
  setProfileLiftRow(profileCartState.row);
  setProfileCartPosition({ x: profileCartShaftX, y: profileCartTargets.hello.y });
  setActiveProfileRoom(null);

  profileRooms.forEach((room) => {
    const roomId = room.dataset.room;

    room.addEventListener("mouseenter", () => moveProfileCartToRoom(roomId));
    room.addEventListener("focus", () => moveProfileCartToRoom(roomId));
  });
};

// Converts path progress into a position and facing angle.
const getPathPoint = (path, progress) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const segmentCount = path.length - 1;
  const rawSegment = clampedProgress * segmentCount;
  const segmentIndex = Math.min(Math.floor(rawSegment), segmentCount - 1);
  const segmentProgress = rawSegment - segmentIndex;

  const start = path[segmentIndex];
  const end = path[segmentIndex + 1];
  const xDiff = end.x - start.x;
  const yDiff = end.y - start.y;

  const direction = xDiff >= 0 ? 1 : -1;

  return {
    x: lerp(start.x, end.x, segmentProgress),
    y: lerp(start.y, end.y, segmentProgress),
    angle: Math.min(Math.abs(yDiff / xDiff) * 45, 90) * direction,
  };
};

const getActiveSkierRoute = () => skierRoutes[skierRun.routeId] || skierRoutes.easyMountainRoute;

const getRouteJumpOffset = (route, progress) => {
  if (!route.jump) return 0;

  const { start, end, height } = route.jump;
  if (progress < start || progress > end) return 0;

  const jumpProgress = (progress - start) / (end - start);

  // Keep the skier moving along the route while this visual arc lifts them above it.
  return -height * Math.sin(jumpProgress * Math.PI);
};

const setSkierPathPosition = (pathPoint, jumpOffset = 0) => {
  if (!skier) return;

  skier.style.left = `${pathPoint.x}%`;
  skier.style.top = `${pathPoint.y}%`;
  skier.style.transform = `translateY(${jumpOffset}px) rotate(${pathPoint.angle}deg)`;
};

// Lift animation samples the drawn SVG cable instead of duplicating cable coordinates in JS.
const getLiftCablePoint = (progress) => {
  if (!liftCableSegments.length) return null;

  // The SVG cable is authored top-to-bottom, but the return lift travels bottom-to-top.
  const reversedSegments = [...liftCableSegments].reverse();

  // Let the browser measure the real curved SVG paths so JS does not duplicate cable geometry.
  const segmentLengths = reversedSegments.map((segment) => segment.getTotalLength());
  const totalLength = segmentLengths.reduce((total, length) => total + length, 0);

  // Progress is a 0-1 value across the whole multi-segment cable.
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const targetLength = totalLength * clampedProgress;

  let lengthSoFar = 0;

  for (let index = 0; index < reversedSegments.length; index += 1) {
    const segment = reversedSegments[index];
    const segmentLength = segmentLengths[index];

    if (targetLength <= lengthSoFar + segmentLength) {
      const localLength = targetLength - lengthSoFar;

      // Each individual path still runs top-to-bottom, so sample backward within it.
      return segment.getPointAtLength(segmentLength - localLength);
    }

    lengthSoFar += segmentLength;
  }

  // Fallback to the top of the final segment if rounding slips past the loop.
  return reversedSegments[reversedSegments.length - 1].getPointAtLength(0);
};

// The sampled SVG point becomes the wheel anchor; CSS draws the chair below it.
const updateLiftCarPosition = (progress) => {
  if (!liftCar) return;

  const point = getLiftCablePoint(progress);
  if (!point) return;

  liftCar.style.left = `${point.x}%`;
  liftCar.style.top = `${point.y}%`;
};

const getCabinStateIndex = () => cabinStates.indexOf(progressionState.cabinState);

const isCompactMountainViewport = () => compactMountainViewport.matches;

// SUN / SKY

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
  // The sun only tracks the skier while a run is active or crashed on-screen.
  if (
    !skier ||
    progressionState.skierState === skierStates.hidden ||
    progressionState.skierState === skierStates.complete
  ) {
    return null;
  }

  const skierBounds = skier.getBoundingClientRect();

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
  const skierTarget = getSkierGazeTarget();

  // Skier motion is the main scene cue; mouse gaze only wins when there is no visible skier target.
  if (skierTarget) return skierTarget;

  // Without a skier target, nearby mouse movement keeps the awakened sun interactive.
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

// MOUNTAIN DATA

const skierRoutes = {
  easyMountainRoute: {
    crashChance: 0.12,
    path: [
      { x: 42, y: 24 },
      { x: 52, y: 37 },
      { x: 44, y: 43 },
      { x: 56, y: 48 },
      { x: 69, y: 55 },
      { x: 76, y: 65 },
    ],
    jump: { start: 0.52, end: 0.68, height: 30 },
  },
  intermediateMountainRoute: {
    crashChance: defaultCrashChance,
    path: [
      { x: 45, y: 24 },
      { x: 39, y: 34 },
      { x: 45, y: 44 },
      { x: 57, y: 49 },
      { x: 65, y: 42 },
      { x: 73, y: 56 },
      { x: 79, y: 65 },
    ],
    // Visual-only jump: path progress continues while the skier briefly pops above it.
    jump: { start: 0.42, end: 0.68, height: 170 },
  },
};

const cabinUnlocks = [
  {
    level: 1,
    name: "Campfire",
    className: "cabin-unlock-campfire",
    cabin: { x: 41, y: 25 },
    supply: { x: 80, y: 65 },
    svg: `
      <svg viewBox="0 0 40 36" aria-hidden="true">
        <path d="M8 30 L32 30" stroke="#3f2414" stroke-width="4" stroke-linecap="round" />
        <path d="M13 31 L28 23" stroke="#5b351c" stroke-width="4" stroke-linecap="round" />
        <path d="M27 31 L12 23" stroke="#5b351c" stroke-width="4" stroke-linecap="round" />
        <path d="M20 7 C14 15 17 20 20 24 C24 19 27 15 20 7 Z" fill="#e94b24" />
        <path d="M21 14 C18 18 19 22 21 25 C24 21 25 18 21 14 Z" fill="#ffd36f" />
      </svg>
    `,
  },
  {
    level: 2,
    name: "Clothesline",
    className: "cabin-unlock-clothesline",
    cabin: { x: 43, y: 23 },
    supply: { x: 80, y: 60 },
    svg: `
      <svg viewBox="0 0 80 40" aria-hidden="true">
        <path d="M8 8 V36 M72 8 V36" stroke="#4b2c16" stroke-width="4" stroke-linecap="round" />
        <path d="M10 12 C28 18 52 18 70 12" stroke="#2b1a10" stroke-width="2" fill="none" />
        <path d="M24 15 H38 V30 H24 Z" fill="#d94935" />
        <path d="M44 16 H57 V29 H44 Z" fill="#f1d58a" />
      </svg>
    `,
  },
  {
    level: 3,
    name: "Fish Drying Rack",
    className: "cabin-unlock-fish-rack",
    cabin: { x: 41, y: 24 },
    supply: { x: 80, y: 64 },
    svg: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 40 L24 8 L38 40 M15 22 H33" stroke="#4b2c16" stroke-width="4" fill="none" stroke-linecap="round" />
        <path d="M18 25 C23 20 30 21 34 25 C30 29 23 30 18 25 Z" fill="#9aa6a1" />
        <path d="M16 25 L11 21 L11 29 Z" fill="#78847f" />
      </svg>
    `,
  },
  {
    level: 4,
    name: "Wood Pile",
    className: "cabin-unlock-wood-pile",
    cabin: { x: 48, y: 26 },
    supply: { x: 81, y: 62 },
    svg: `
      <svg viewBox="0 0 56 28" aria-hidden="true">
        <path d="M8 20 H34 M16 13 H46 M25 21 H50" stroke="#6f3f20" stroke-width="8" stroke-linecap="round" />
        <circle cx="8" cy="20" r="4" fill="#c89554" />
        <circle cx="16" cy="13" r="4" fill="#c89554" />
        <circle cx="25" cy="21" r="4" fill="#c89554" />
      </svg>
    `,
  },
  {
    level: 5,
    name: "Hot Spring",
    className: "cabin-unlock-hot-spring",
    cabin: { x: 41, y: 28 },
    supply: { x: 79, y: 60 },
    svg: `
      <svg viewBox="0 0 64 44" aria-hidden="true">
        <ellipse cx="32" cy="28" rx="24" ry="10" fill="#6fb6bd" />
        <ellipse cx="32" cy="27" rx="18" ry="6" fill="#b9edf0" />
        <path d="M23 15 C18 10 28 8 23 3 M34 15 C29 10 39 8 34 3 M45 15 C40 10 50 8 45 3" stroke="#dbe7df" stroke-width="3" fill="none" stroke-linecap="round" />
      </svg>
    `,
  },
  {
    level: 6,
    name: "Sauna",
    className: "cabin-unlock-sauna",
    cabin: { x: 44, y: 21 },
    supply: { x: 79.5, y: 60 },
    svg: `
      <svg viewBox="0 0 60 54" aria-hidden="true">
        <path d="M10 24 L30 8 L50 24 V46 H10 Z" fill="#7a4828" />
        <path d="M10 24 L30 8 L50 24" fill="none" stroke="#3f2414" stroke-width="5" stroke-linejoin="round" />
        <path d="M25 32 H36 V46 H25 Z" fill="#2b1a10" />
      </svg>
    `,
  },
  {
    level: 7,
    name: "Guest Cabin",
    className: "cabin-unlock-guest-cabin",
    cabin: { x: 61.5, y: 28 },
    supply: { x: 79.5, y: 60 },
    svg: `
      <svg viewBox="0 0 70 56" aria-hidden="true">
        <path d="M8 25 L35 7 L62 25 Z" fill="#3f2414" />
        <path d="M16 24 H54 V48 H16 Z" fill="#6f3f20" />
        <path d="M31 34 H40 V48 H31 Z" fill="#2b1a10" />
        <path d="M20 31 H29 V39 H20 Z M43 31 H52 V39 H43 Z" fill="#ffd36f" />
      </svg>
    `,
  },
];

const maxCabinLevel = Math.max(...cabinUnlocks.map((unlock) => unlock.level));

// MOUNTAIN RENDERING

const pathMarkerDedupeDistance = 2;

const getPointDistance = (firstPoint, secondPoint) => {
  const xDistance = firstPoint.x - secondPoint.x;
  const yDistance = firstPoint.y - secondPoint.y;

  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
};

const renderPathMarkers = () => {
  if (!pathMarkersLayer) return;

  pathMarkersLayer.textContent = "";

  const markerNodes = [];

  Object.entries(skierRoutes).forEach(([routeId, route]) => {
    route.path.forEach((node, index) => {
      if (index === 0) return;

      const existingMarker = markerNodes.find((markerNode) => {
        // Only dedupe across different routes; same-route points stay explicit.
        return (
          !markerNode.routeIds.includes(routeId) &&
          getPointDistance(markerNode, node) < pathMarkerDedupeDistance
        );
      });

      if (existingMarker) {
        existingMarker.routeIds.push(routeId);
        existingMarker.element.dataset.routeIds = existingMarker.routeIds.join(" ");
        return;
      }

      const marker = document.createElement("span");
      marker.className = "path-marker";
      marker.dataset.routeIds = routeId;
      marker.innerHTML = `<span class="path-marker-cap"></span>`;
      marker.style.left = `${node.x}%`;
      marker.style.top = `${node.y}%`;

      markerNodes.push({
        ...node,
        routeIds: [routeId],
        element: marker,
      });

      pathMarkersLayer.append(marker);
    });
  });
};

const setActivePathMarkers = (routeId) => {
  if (!pathMarkersLayer) return;

  pathMarkersLayer.querySelectorAll(".path-marker").forEach((marker) => {
    const routeIds = marker.dataset.routeIds?.split(" ") || [];

    // Shared deduped markers light up for either route they belong to.
    marker.classList.toggle("is-active-route", routeIds.includes(routeId));
  });
};

const renderCabinUnlocks = () => {
  if (!cabinUnlocksLayer) return;

  cabinUnlocksLayer.textContent = "";

  cabinUnlocks.forEach((unlock) => {
    const isUnlocked = unlock.level <= progressionState.cabinLevel;
    const slot = isUnlocked ? unlock.cabin : unlock.supply;

    const item = document.createElement("span");
    item.className = `cabin-unlock ${unlock.className}`;
    item.classList.toggle("is-supply", !isUnlocked);
    item.style.left = `${slot.x}%`;
    item.style.top = `${slot.y}%`;
    item.innerHTML = unlock.svg.trim();

    cabinUnlocksLayer.append(item);
  });
};

const setCabinLevel = (nextLevel) => {
  progressionState.cabinLevel = Math.max(0, nextLevel);
  renderCabinUnlocks();
};

const completeCabinProgression = () => {
  setSkierState(skierStates.complete);

  if (finalSkierRest) {
    const campfireUnlock = cabinUnlocks.find((unlock) => unlock.level === 1);

    if (campfireUnlock) {
      finalSkierRest.style.left = `${campfireUnlock.cabin.x + 1.2}%`;
      finalSkierRest.style.top = `${campfireUnlock.cabin.y}%`;
    }

    finalSkierRest.classList.add("is-visible");
  }
};

// SKIER RUN STATE

// Stop any in-progress skier animation before starting, resetting, crashing, or finishing a run.
const cancelSkierAnimation = () => {
  if (!skierRun.animationFrameId) return;

  window.cancelAnimationFrame(skierRun.animationFrameId);
  skierRun.animationFrameId = null;
};

const cancelLiftReturn = () => {
  if (liftReturn.timeoutId) {
    window.clearTimeout(liftReturn.timeoutId);
    liftReturn.timeoutId = null;
  }

  if (liftReturn.animationFrameId) {
    window.cancelAnimationFrame(liftReturn.animationFrameId);
    liftReturn.animationFrameId = null;
  }

  if (liftCar) {
    liftCar.classList.remove("is-visible");
  }
};

const updateLiftReturn = (frameTime = performance.now()) => {
  if (!liftCar) return;

  const elapsed = frameTime - liftReturn.startedAt;
  const progress = Math.min(elapsed / liftReturnDuration, 1);

  updateLiftCarPosition(progress);

  if (progress >= 1) {
    liftReturn.animationFrameId = null;
    liftCar.classList.remove("is-visible");
    stageSkierAtRouteStart();
    return;
  }

  liftReturn.animationFrameId = window.requestAnimationFrame(updateLiftReturn);
};

const hideSkierForLift = () => {
  if (!skier) return;

  skier.classList.add("is-hidden");
  skier.setAttribute("aria-hidden", "true");
};

// Crash recovery cue stays on only during the short wait before the lift picks up the skier.
const setRecoveryCueVisible = (isVisible) => {
  if (!suppliesCabin) return;

  suppliesCabin.classList.toggle("is-recovery-needed", isVisible);
};

const scheduleLiftReturn = () => {
  if (!liftCar || !liftCableSegments.length) return;

  cancelLiftReturn();

  liftReturn.timeoutId = window.setTimeout(() => {
    liftReturn.timeoutId = null;
    liftReturn.startedAt = performance.now();

    updateLiftCarPosition(0);
    setRecoveryCueVisible(false);
    hideSkierForLift();
    liftCar.classList.add("is-visible");
    updateLiftReturn(liftReturn.startedAt);
  }, liftReturnDelay);
};

// Keep every route marker tied to the same skier state.
const setRouteMarkersEnabled = (isEnabled) => {
  routeMarkers.forEach((routeMarker) => {
    routeMarker.disabled = !isEnabled;
  });
};

const setSkierState = (nextState) => {
  if (!skier) return;

  progressionState.skierState = nextState;

  skier.classList.toggle(
    "is-hidden",
    nextState === skierStates.hidden || nextState === skierStates.complete
  );
  skier.classList.toggle("is-skiing", nextState === skierStates.running);
  skier.classList.toggle("is-fallen", nextState === skierStates.crashed);

  // Ready and finished are different game states, but both look like an idle skier.
  skier.classList.toggle(
    "is-resting",
    nextState === skierStates.ready || nextState === skierStates.finished
  );

  skier.setAttribute(
    "aria-hidden",
    nextState === skierStates.hidden || nextState === skierStates.complete ? "true" : "false"
  );
};

const stageSkierAtRouteStart = () => {
  if (!skier) return;
  if (progressionState.skierState === skierStates.running) return;
  cancelLiftReturn();
  setRecoveryCueVisible(false);

  // Reset all run/lift animation state before placing the skier back at the route start.
  skierRun = {
    animationFrameId: null,
    startedAt: 0,
    progress: 0,
    hasCrash: false,
    crashProgress: null,
    routeId: "easyMountainRoute",
  };

  // Activation reveals the skier at the first route point without starting the run.
  const startPoint = getPathPoint(skierRoutes.easyMountainRoute.path, 0);

  setActivePathMarkers(null);
  setSkierPathPosition(startPoint);
  setSkierState(skierStates.ready);
  setRouteMarkersEnabled(true);
};

const launchSkierRun = (routeId = "easyMountainRoute") => {
  if (!skier) return;
  // The run only starts when the skier is already staged at the top.
  if (progressionState.skierState !== skierStates.ready) return;

  const route = skierRoutes[routeId] || skierRoutes.easyMountainRoute;

  // New run clears the sun's crash reaction because the skier is back on course.
  if (sunCharacter) {
    sunCharacter.classList.remove("is-oof");
  }

  // Light up the active path
  setActivePathMarkers(routeId);
  cancelSkierAnimation();
  // All route choices are unavailable while the skier is already on one.
  setRouteMarkersEnabled(false);

  const routeCrashChance = route.crashChance ?? defaultCrashChance;

  skierRun = {
    animationFrameId: null,
    startedAt: performance.now(),
    progress: 0,
    hasCrash: Math.random() < routeCrashChance,
    crashProgress: null,
    routeId,
  };

  // Crash is decided once per run so animation stays deterministic.
  if (skierRun.hasCrash) {
    skierRun.crashProgress = 0.35 + Math.random() * 0.45;
  }

  setSkierState(skierStates.running);
  setSkierPathPosition(getPathPoint(route.path, 0));
  updateSkierRun(skierRun.startedAt);
};

const finishSkierRun = () => {
  // Successful runs grow the cabin area one level at a time.
  setCabinLevel(progressionState.cabinLevel + 1);

  if (progressionState.cabinLevel >= maxCabinLevel) {
    completeCabinProgression();
    return;
  }

  const finishPoint = getPathPoint(getActiveSkierRoute().path, 1);

  setSkierPathPosition(finishPoint);
  skier.style.transform = "rotate(0deg)";
  setSkierState(skierStates.finished);
  scheduleLiftReturn();
};

const crashSkierRun = () => {
  // Crashes cost one cabin level instead of wiping all progression.
  setCabinLevel(progressionState.cabinLevel - 1);
  setSkierState(skierStates.crashed);
  setRecoveryCueVisible(true);
  scheduleLiftReturn();

  if (sunCharacter) {
    sunCharacter.classList.add("is-oof");

    window.setTimeout(() => {
      sunCharacter.classList.remove("is-oof");
    }, 10000);
  }
};

const updateSkierRun = (frameTime = performance.now()) => {
  if (!skier || progressionState.skierState !== skierStates.running) return;

  // Progress is based on elapsed animation time, not page scroll.
  const elapsed = frameTime - skierRun.startedAt;
  const runProgress = Math.min(elapsed / skierRunDuration, 1);

  // If this run has a crash, lock the skier at that point.
  if (skierRun.hasCrash && skierRun.crashProgress && runProgress >= skierRun.crashProgress) {
    skierRun.progress = skierRun.crashProgress;
    const activeRoute = getActiveSkierRoute();
    const crashPoint = getPathPoint(activeRoute.path, skierRun.progress);
    const jumpOffset = getRouteJumpOffset(activeRoute, skierRun.progress);

    setSkierPathPosition(crashPoint, jumpOffset);

    crashSkierRun();
    return;
  }

  skierRun.progress = runProgress;
  const activeRoute = getActiveSkierRoute();
  const pathPoint = getPathPoint(activeRoute.path, skierRun.progress);
  const jumpOffset = getRouteJumpOffset(activeRoute, skierRun.progress);

  setSkierPathPosition(pathPoint, jumpOffset);

  if (skierRun.progress >= 1) {
    finishSkierRun();
    return;
  }

  // Continue the run on the browser's next paint frame.
  skierRun.animationFrameId = window.requestAnimationFrame(updateSkierRun);
};

// CABIN INTERACTIONS
const applyCabinState = () => {
  if (!cabinCharacter) return;

  // Classes are cumulative: activated cabins keep the smoke and light treatment.
  const cabinStateIndex = getCabinStateIndex();

  cabinCharacter.classList.toggle("is-smoking", cabinStateIndex >= 1);
  cabinCharacter.classList.toggle("is-lit", cabinStateIndex >= 2);
  cabinCharacter.classList.toggle("is-activated", cabinStateIndex >= 3);
};

const disableCabinInteraction = () => {
  if (!cabinCharacter) return;

  // The cabin only wakes the first skier. After that, lift/route controls own the loop.
  cabinCharacter.removeEventListener("click", advanceCabin);
  cabinCharacter.removeEventListener("keydown", handleCabinKeydown);
  cabinCharacter.removeAttribute("role");
  cabinCharacter.removeAttribute("tabindex");
  cabinCharacter.classList.add("is-disabled");
};

const advanceCabin = () => {
  if (isCompactMountainViewport()) return;

  const cabinStateIndex = getCabinStateIndex();

  if (cabinStateIndex < cabinStates.length - 1) {
    // First clicks wake the cabin one visual state at a time.
    progressionState.cabinState = cabinStates[cabinStateIndex + 1];
    applyCabinState();

    // Activation unlocks the route marker; the player chooses when to launch the skier.
    if (progressionState.cabinState === "activated") {
      setRouteMarkersEnabled(true);
      stageSkierAtRouteStart();
      disableCabinInteraction();
    }

    return;
  }

  // After activation, cabin clicks no longer launch runs; route markers own that interaction.
  setRouteMarkersEnabled(true);
};

const handleCabinKeydown = (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  advanceCabin();
};

const handleRouteClick = (event) => {
  if (isCompactMountainViewport()) return;

  const routeMarker = event.currentTarget;
  if (!routeMarker || routeMarker.disabled) return;

  // The clicked marker owns route selection; run/reset/lift behavior stays shared.
  launchSkierRun(routeMarker.dataset.routeId);
};

const handleLiftTerminalClick = () => {
  if (isCompactMountainViewport()) return;

  // Lift terminals are the temporary reset: finished/crashed skiers go back to the top.
  if (
    progressionState.skierState !== skierStates.finished &&
    progressionState.skierState !== skierStates.crashed
  ) {
    return;
  }

  stageSkierAtRouteStart();
};

// FOREST GENERATION

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

// PARALLAX BOOTSTRAP

const updateParallaxLayers = () => {
  const progress = getScrollProgress();
  updateSky(progress);

  parallaxLayers.forEach((layer) => {
    const xStart = getCssLength(layer.dataset.xStart);
    const xEnd = getCssLength(layer.dataset.xEnd);
    const yStart = getCssLength(layer.dataset.yStart);
    const yEnd = getCssLength(layer.dataset.yEnd);
    const scaleStart = Number(layer.dataset.scaleStart || 1);
    const scaleEnd = Number(layer.dataset.scaleEnd || 1);

    const xOffset = xStart + (xEnd - xStart) * progress;
    const yOffset = yStart + (yEnd - yStart) * progress;
    const scale = scaleStart + (scaleEnd - scaleStart) * progress;

    layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`;
  });

  if (forestBack) {
    forestBack.style.transform = `translateY(${-progress * 12}px) scaleX(${1 + progress * 0.4}) scaleY(${1 + progress * 1.8})`;
  }

  if (forestMid) {
    forestMid.style.transform = `translateY(${-progress * 22}px) scaleX(${1 + progress * 0.6}) scaleY(${1 + progress * 2})`;
  }

  if (forestFront) {
    forestFront.style.transform = `translateY(${-progress * 36}px) scaleX(${1 + progress * 0.8}) scaleY(${1 + progress * 2.8})`;
  }

  if (forestMist) {
    forestMist.style.setProperty("--mist-opacity", Math.max((progress - 0.35) / 0.45, 1));
    forestMist.style.setProperty("--mist-y", `${60 - progress * 190}px`);
  }

  updateSunPupils();

  parallaxTicking = false;
};

createForest();
initProfileCart();

const requestParallaxUpdate = () => {
  if (reduceMotion.matches || parallaxTicking) return;

  parallaxTicking = true;
  window.requestAnimationFrame(updateParallaxLayers);
};

if (parallaxScene && parallaxLayers.length) {
  // Set the correct positions on page load before the user scrolls.
  updateParallaxLayers();
  renderPathMarkers();
  renderCabinUnlocks();

  if (cabinCharacter) {
    // Cabin clicks progress the wake-up sequence; route markers launch skier runs after activation.
    cabinCharacter.addEventListener("click", advanceCabin);
    cabinCharacter.addEventListener("keydown", handleCabinKeydown);
  }

  routeMarkers.forEach((routeMarker) => {
    routeMarker.addEventListener("click", handleRouteClick);
  });

  if (liftTopTerminal) {
    liftTopTerminal.addEventListener("click", handleLiftTerminalClick);
  }

  if (liftBottomTerminal) {
    liftBottomTerminal.addEventListener("click", handleLiftTerminalClick);
  }

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
