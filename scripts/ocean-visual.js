(() => {
  const visual = document.querySelector(".ocean-visual");
  const stage = visual ? visual.querySelector(".ocean-visual__stage") : null;

  if (!visual || !stage) {
    return;
  }

  // One-shot screenshot entrance. Kept as its own concern: it gates on a separate query
  // and never depends on the ambient rail or vice versa.
  const entranceQuery = window.matchMedia(
    "(min-width: 70rem) and (prefers-reduced-motion: no-preference)"
  );

  let pingsPlayed = false; // set once the entrance settles so rebuilds never re-trigger pings

  if (entranceQuery.matches && typeof IntersectionObserver !== "undefined") {
    visual.classList.add("ocean-visual--motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          requestAnimationFrame(() => {
            visual.classList.add("is-settled");
            pingsPlayed = true;
          });

          observer.unobserve(stage);
          observer.disconnect();
          return;
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(stage);
  }

  // Decorative ambient rail: 7 deterministic hollow bubbles and 2 one-shot sonar pings in a
  // dedicated negative-space rail beside the caption. No randomness, so the arrangement is
  // stable across loads. The rail is generated only when the eligibility query matches and
  // tears down cleanly when it stops matching. Coords are normalized (0-1) rail fractions;
  // size is in CSS px.
  const bubbles = [
    { x: 0.18, y: 0.22, size: 16, opacity: 0.42 },
    { x: 0.42, y: 0.15, size: 10, opacity: 0.28 },
    { x: 0.72, y: 0.3, size: 22, opacity: 0.46 },
    { x: 0.25, y: 0.58, size: 12, opacity: 0.24 },
    { x: 0.55, y: 0.5, size: 18, opacity: 0.38 },
    { x: 0.82, y: 0.68, size: 9, opacity: 0.22 },
    { x: 0.38, y: 0.75, size: 26, opacity: 0.48 },
  ];

  const pings = [
    { x: 0.3, y: 0.38, delay: 1.1 },
    { x: 0.68, y: 0.65, delay: 1.8 },
  ];

  const influenceRadius = 80; // CSS px; smaller than the old stage field to suit the rail
  const maxDisplacement = 24; // CSS px; restrained within the smaller rail

  const ambientQuery = window.matchMedia(
    "(min-width: 70rem) and (prefers-reduced-motion: no-preference)"
  );

  const interactionQuery = window.matchMedia(
    "(min-width: 70rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );

  let ambientState = null; // populated on createAmbient, cleared on destroyAmbient
  let interactionState = null; // populated on enableInteraction, cleared on disableInteraction

  const createAmbient = () => {
    if (ambientState) {
      return; // idempotent: a second init while the rail exists does nothing
    }

    const rail = document.createElement("div");
    rail.className = "ocean-visual__ambient";
    rail.setAttribute("aria-hidden", "true");

    const layer = document.createElement("div");
    layer.className = "ocean-visual__particles";
    layer.setAttribute("aria-hidden", "true");

    const fragment = document.createDocumentFragment();
    const homes = [];

    bubbles.forEach((bubble, index) => {
      const span = document.createElement("span");
      span.className = "ocean-visual__particle";
      span.style.left = `${bubble.x * 100}%`;
      span.style.top = `${bubble.y * 100}%`;
      span.style.width = `${bubble.size}px`;
      span.style.height = `${bubble.size}px`;
      span.style.marginLeft = `${-bubble.size / 2}px`;
      span.style.marginTop = `${-bubble.size / 2}px`;
      span.style.setProperty("--particle-opacity", bubble.opacity);
      fragment.appendChild(span);
      // Stable per-particle fallback direction for the zero-distance case (golden angle).
      homes.push({
        x: bubble.x,
        y: bubble.y,
        angle: (index * 137.5 * Math.PI) / 180,
        node: span,
      });
    });

    layer.appendChild(fragment);
    rail.appendChild(layer);

    // One-shot sonar pings: only generated before the entrance has settled, so a reactive
    // rail rebuild never replays them.
    if (!pingsPlayed) {
      const pingFragment = document.createDocumentFragment();

      pings.forEach((ping) => {
        const span = document.createElement("span");
        span.className = "ocean-visual__ping";
        span.style.left = `${ping.x * 100}%`;
        span.style.top = `${ping.y * 100}%`;
        span.style.setProperty("--ping-delay", `${ping.delay}s`);
        pingFragment.appendChild(span);
      });

      rail.appendChild(pingFragment);
    }

    visual.appendChild(rail); // direct child of .ocean-visual, after the caption
    visual.classList.add("ocean-visual--ambient-ready");

    ambientState = { rail, layer, homes };
  };

  const destroyAmbient = () => {
    if (!ambientState) {
      return;
    }

    disableInteraction();

    ambientState.rail.remove();
    visual.classList.remove("ocean-visual--ambient-ready");
    ambientState = null;
  };

  const enableInteraction = () => {
    if (!ambientState || interactionState) {
      return; // no rail to listen on, or already listening
    }

    const { rail, layer, homes } = ambientState;
    rail.style.pointerEvents = "auto"; // rail captures pointer events; children stay none

    let pendingFrame = null;
    let pointerClient = null; // latest pointer in client coords, or null when outside the rail

    const update = () => {
      pendingFrame = null;

      if (!pointerClient) {
        return;
      }

      // One layout read per frame; normalized homes resolve to px against the current rail
      // rect, so resizing within the wide breakpoint stays correct without a resize listener.
      const rect = rail.getBoundingClientRect();
      const px = pointerClient.x - rect.left;
      const py = pointerClient.y - rect.top;

      for (const home of homes) {
        const homeX = home.x * rect.width;
        const homeY = home.y * rect.height;
        const dx = homeX - px;
        const dy = homeY - py;
        const distance = Math.hypot(dx, dy);

        let offsetX = 0;
        let offsetY = 0;

        if (distance < 0.5) {
          // Pointer sits on the home center; use the stable fallback so the bubble does not
          // jump in an arbitrary shared direction.
          offsetX = Math.cos(home.angle) * maxDisplacement;
          offsetY = Math.sin(home.angle) * maxDisplacement;
        } else if (distance < influenceRadius) {
          const influence = 1 - distance / influenceRadius;
          const displacement = maxDisplacement * influence * influence;
          offsetX = (dx / distance) * displacement;
          offsetY = (dy / distance) * displacement;
        }

        home.node.style.setProperty("--particle-x", `${offsetX}px`);
        home.node.style.setProperty("--particle-y", `${offsetY}px`);
      }
    };

    const onPointerMove = (event) => {
      pointerClient = { x: event.clientX, y: event.clientY };
      layer.classList.remove("is-returning"); // restore the shorter interactive timing
      if (pendingFrame === null) {
        pendingFrame = requestAnimationFrame(update);
      }
    };

    const onPointerLeave = () => {
      pointerClient = null;

      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = null;
      }

      layer.classList.add("is-returning"); // calmer 650ms eased return

      for (const home of homes) {
        home.node.style.setProperty("--particle-x", "0px");
        home.node.style.setProperty("--particle-y", "0px");
      }
    };

    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerleave", onPointerLeave);

    interactionState = {
      onPointerMove,
      onPointerLeave,
      cancelFrame: () => {
        if (pendingFrame !== null) {
          cancelAnimationFrame(pendingFrame);
          pendingFrame = null;
        }
      },
    };
  };

  const disableInteraction = () => {
    if (!interactionState) {
      return;
    }

    const { rail, layer, homes } = ambientState || {};

    if (rail) {
      rail.removeEventListener("pointermove", interactionState.onPointerMove);
      rail.removeEventListener("pointerleave", interactionState.onPointerLeave);
      rail.style.pointerEvents = "none";
    }

    interactionState.cancelFrame();

    if (layer) {
      layer.classList.add("is-returning");
    }

    if (homes) {
      for (const home of homes) {
        home.node.style.setProperty("--particle-x", "0px");
        home.node.style.setProperty("--particle-y", "0px");
      }
    }

    interactionState = null;
  };

  const syncInteraction = () => {
    if (ambientState && interactionQuery.matches) {
      enableInteraction();
    } else {
      disableInteraction();
    }
  };

  const syncAmbient = () => {
    if (ambientQuery.matches && typeof IntersectionObserver !== "undefined") {
      createAmbient();
      syncInteraction();
    } else {
      destroyAmbient();
    }
  };

  syncAmbient();
  ambientQuery.addEventListener("change", syncAmbient);
  interactionQuery.addEventListener("change", syncInteraction);
})();
