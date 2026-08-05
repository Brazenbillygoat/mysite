(() => {
  const visual = document.querySelector(".ocean-visual");
  const stage = visual ? visual.querySelector(".ocean-visual__stage") : null;

  if (!visual || !stage) {
    return;
  }

  // One-shot screenshot entrance. Kept as its own concern: it gates on a separate query
  // and never depends on the particle field or vice versa.
  const entranceQuery = window.matchMedia(
    "(min-width: 70rem) and (prefers-reduced-motion: no-preference)"
  );

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

  // Decorative observation-particle field. 18 deterministic hollow particles; no randomness,
  // so the arrangement is stable across loads. Coords are normalized (0-1) stage fractions
  // and size in CSS px. The layer is generated only when the eligibility query matches.
  const particles = [
    { x: 0.1, y: 0.14, size: 14 },
    { x: 0.24, y: 0.08, size: 10 },
    { x: 0.38, y: 0.22, size: 22 },
    { x: 0.52, y: 0.1, size: 12 },
    { x: 0.66, y: 0.18, size: 18 },
    { x: 0.8, y: 0.12, size: 9 },
    { x: 0.9, y: 0.26, size: 16 },
    { x: 0.14, y: 0.36, size: 20 },
    { x: 0.3, y: 0.46, size: 11 },
    { x: 0.46, y: 0.38, size: 24 },
    { x: 0.6, y: 0.5, size: 14 },
    { x: 0.74, y: 0.4, size: 10 },
    { x: 0.88, y: 0.54, size: 19 },
    { x: 0.2, y: 0.64, size: 13 },
    { x: 0.36, y: 0.74, size: 21 },
    { x: 0.5, y: 0.66, size: 9 },
    { x: 0.64, y: 0.82, size: 16 },
    { x: 0.82, y: 0.72, size: 12 },
  ];

  const influenceRadius = 120; // CSS px
  const maxDisplacement = 44; // CSS px

  const particleQuery = window.matchMedia(
    "(min-width: 70rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );

  let particleState = null; // populated on init, cleared on teardown

  const createField = () => {
    if (particleState) {
      return; // idempotent: a second init while the field exists does nothing
    }

    const layer = document.createElement("div");
    layer.className = "ocean-visual__particles";
    layer.setAttribute("aria-hidden", "true");

    const fragment = document.createDocumentFragment();
    const homes = [];

    particles.forEach((particle, index) => {
      const span = document.createElement("span");
      span.className = "ocean-visual__particle";
      span.style.left = `${particle.x * 100}%`;
      span.style.top = `${particle.y * 100}%`;
      span.style.width = `${particle.size}px`;
      span.style.height = `${particle.size}px`;
      span.style.marginLeft = `${-particle.size / 2}px`;
      span.style.marginTop = `${-particle.size / 2}px`;
      fragment.appendChild(span);
      // Stable per-particle fallback direction for the zero-distance case (golden angle).
      homes.push({
        x: particle.x,
        y: particle.y,
        angle: (index * 137.5 * Math.PI) / 180,
        node: span,
      });
    });

    layer.appendChild(fragment);
    stage.appendChild(layer);
    visual.classList.add("ocean-visual--particles-ready");

    let pendingFrame = null;
    let pointerClient = null; // latest pointer in client coords, or null when outside the stage

    const update = () => {
      pendingFrame = null;

      if (!pointerClient) {
        return;
      }

      // One layout read per frame; normalized homes resolve to px against the current rect,
      // so resizing within the wide breakpoint stays correct without a resize listener.
      const rect = stage.getBoundingClientRect();
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
          // Pointer sits on the home center; use the stable fallback so the particle does not
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

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);

    particleState = {
      layer,
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

  const destroyField = () => {
    if (!particleState) {
      return;
    }

    stage.removeEventListener("pointermove", particleState.onPointerMove);
    stage.removeEventListener("pointerleave", particleState.onPointerLeave);
    particleState.cancelFrame();
    particleState.layer.remove();
    visual.classList.remove("ocean-visual--particles-ready");
    particleState = null;
  };

  const syncField = () => {
    if (particleQuery.matches) {
      createField();
    } else {
      destroyField();
    }
  };

  syncField();
  particleQuery.addEventListener("change", syncField);
})();
