// ============================================================================
// Portfolio interaction controller
// ============================================================================

function startApp() {
  initClock();
  initNavigation();
  initCanvasReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}

// ============================================================================
// 1. DIGITAL UTC CLOCK AND METRIC TIMESTAMPS
// ============================================================================
function initClock() {
  const headerClock = document.getElementById("header-clock-time");
  const contactClock = document.getElementById("contact-form-utc");

  function updateClock() {
    const now = new Date();
    // Convert to standard UTC ISO string like YYYY-MM-DD HH:MM:SS UTC
    const utcStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    
    if (headerClock) {
      headerClock.textContent = utcStr.split(" ")[1] + " UTC";
    }
    if (contactClock) {
      contactClock.textContent = "UTC METRIC: " + utcStr;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// ============================================================================
// 2. TABS INTERACTION & ROUTER & MOBILE NAVIGATION DROP-DOWN
// ============================================================================
function initNavigation() {
  const desktopButtons = document.querySelectorAll(".nav-button");
  const mobileButtons = document.querySelectorAll(".mobile-nav-button");
  const footerButtons = document.querySelectorAll(".footer-link-item");
  const inlineLinks = document.querySelectorAll("[data-tab-link]");
  
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuTrigger = document.getElementById("mobile-menu-trigger");
  const hamburgerIcon = document.getElementById("menu-icon-hamburger");
  const closeIcon = document.getElementById("menu-icon-close");

  const tabSections = document.querySelectorAll(".tab-content");

  // Router logic: switches tabs and updates navigation button active classes
  function switchTab(targetTabId) {
    // Scroll window to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update active section
    tabSections.forEach((section) => {
      if (section.id === `tab-${targetTabId}`) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Update desktop buttons active classes
    desktopButtons.forEach((btn) => {
      const tabAttr = btn.getAttribute("data-tab");
      if (tabAttr === targetTabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update mobile buttons active classes
    mobileButtons.forEach((btn) => {
      const tabAttr = btn.getAttribute("data-tab");
      if (tabAttr === targetTabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Close mobile menu if open
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      toggleMobileMenu();
    }
  }

  // Toggle mobile menu navigation dropdown
  function toggleMobileMenu() {
    if (!mobileMenu || !hamburgerIcon || !closeIcon) return;
    const isOpen = mobileMenu.classList.contains("open");
    
    if (isOpen) {
      mobileMenu.classList.remove("open");
      hamburgerIcon.style.display = "block";
      closeIcon.style.display = "none";
    } else {
      mobileMenu.classList.add("open");
      hamburgerIcon.style.display = "none";
      closeIcon.style.display = "block";
    }
  }

  // Attach event listeners to desktop links
  desktopButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      if (tabId) switchTab(tabId);
    });
  });

  // Attach event listeners to mobile dropdown links
  mobileButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      if (tabId) switchTab(tabId);
    });
  });

  // Attach event listeners to footer links
  footerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab-footer");
      if (tabId) switchTab(tabId);
    });
  });

  // Attach inline link buttons (e.g. from narrative to Portfolio/CV)
  inlineLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tabId = link.getAttribute("data-tab-link");
      if (tabId) switchTab(tabId);
    });
  });

  // Toggle mobile trigger click
  if (mobileMenuTrigger) {
    mobileMenuTrigger.addEventListener("click", toggleMobileMenu);
  }

  // Support direct links from standalone pages such as Articles.
  // Example: /?tab=contact opens the Contact section immediately.
  const requestedTab = new URLSearchParams(window.location.search).get("tab");
  if (requestedTab && document.getElementById(`tab-${requestedTab}`)) {
    switchTab(requestedTab);
  }
}

// ============================================================================
// 3. INTERACTIVE PORTRAIT LENS REVEAL METABALLS LOGIC
// ============================================================================
function initCanvasReveal() {
  const container = document.getElementById("canvas-reveal-root");
  const canvas = document.getElementById("interactive-reveal-canvas");
  if (!container || !canvas) return;

  const mainCtx = canvas.getContext("2d");
  if (!mainCtx) return;

  // Mask scale for rapid metaball layout calculations
  const MASK_SCALE = 0.15;
  const maskCanvas = document.createElement("canvas");
  const maskCtx = maskCanvas.getContext("2d");

  // Load smiling overlay image in memory
  const imgOverlay = new Image();
  imgOverlay.crossOrigin = "anonymous";
  imgOverlay.src = "https://lh3.googleusercontent.com/d/1R5Yodqa0utrQ2LgkoHNMP_1nLbXzC_8i";

  // Initializing 7 blobs with physics constants to trail and blend organically
  const blobs = [
    { x: 0, y: 0, vx: 0, vy: 0, radius: 105, stiffness: 0.10, damping: 0.78, lagFactor: 1.0 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 90,  stiffness: 0.08, damping: 0.82, lagFactor: 1.4 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 80,  stiffness: 0.11, damping: 0.74, lagFactor: 1.9 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 95,  stiffness: 0.06, damping: 0.86, lagFactor: 2.3 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 75,  stiffness: 0.09, damping: 0.80, lagFactor: 2.8 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 65,  stiffness: 0.05, damping: 0.88, lagFactor: 3.3 },
    { x: 0, y: 0, vx: 0, vy: 0, radius: 60,  stiffness: 0.07, damping: 0.83, lagFactor: 3.6 },
  ];

  let targetX = 0;
  let targetY = 0;
  let targetScale = 0;
  let currentScale = 0;
  let hasInteracted = false;

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  function updateTarget(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    targetX = clientX - rect.left;
    targetY = clientY - rect.top;

    if (!hasInteracted) {
      // Snap blobs on first entry to avoid sliding across screen
      blobs.forEach((b) => {
        b.x = targetX;
        b.y = targetY;
        b.vx = 0;
        b.vy = 0;
      });
      hasInteracted = true;
    }
    targetScale = 1.0;
  }

  function handleReset() {
    targetScale = 0.0;
  }

  // Event handlers
  if (!isTouchDevice) {
    container.addEventListener("mousemove", (e) => {
      updateTarget(e.clientX, e.clientY);
    });
    container.addEventListener("mouseleave", handleReset);
  } else {
    container.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches[0]) {
        updateTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        updateTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener("touchend", handleReset);
  }

  // Live render frames loop
  function render() {
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width > 0 && height > 0) {
      // Handle canvas resize dynamically
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const maskWidth = Math.floor(width * MASK_SCALE);
      const maskHeight = Math.floor(height * MASK_SCALE);

      if (maskCanvas.width !== maskWidth || maskCanvas.height !== maskHeight) {
        maskCanvas.width = maskWidth;
        maskCanvas.height = maskHeight;
      }

      // Smoothly scale up or collapse blobs depending on active state
      currentScale += (targetScale - currentScale) * 0.08;

      // Apply spring physics
      blobs.forEach((b) => {
        const ax = ((targetX - b.x) * b.stiffness) / b.lagFactor;
        const ay = ((targetY - b.y) * b.stiffness) / b.lagFactor;
        b.vx = (b.vx + ax) * b.damping;
        b.vy = (b.vy + ay) * b.damping;
        b.x += b.vx;
        b.y += b.vy;
      });

      // Inter-blob repulsion for gorgeous organic lava-lamp blending
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const bA = blobs[i];
          const bB = blobs[j];
          const dx = bB.x - bA.x;
          const dy = bB.y - bA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const sizeA = bA.radius * currentScale;
          const sizeB = bB.radius * currentScale;
          const minDist = (sizeA + sizeB) * 0.4;

          if (dist < minDist) {
            if (dist > 0.01) {
              const overlap = minDist - dist;
              const force = overlap * 0.08;
              const pushX = (dx / dist) * force;
              const pushY = (dy / dist) * force;

              bA.vx -= pushX;
              bA.vy -= pushY;
              bB.vx += pushX;
              bB.vy += pushY;
            } else {
              const angle = Math.random() * Math.PI * 2;
              const force = 1.0;
              bA.vx -= Math.cos(angle) * force;
              bA.vy -= Math.sin(angle) * force;
              bB.vx += Math.cos(angle) * force;
              bB.vy += Math.sin(angle) * force;
            }
          }
        }
      }

      // Render masked image on main canvas if scale is active
      if (currentScale > 0.005 && maskCtx && maskWidth > 0 && maskHeight > 0) {
        const activeBlobs = blobs.map((b) => {
          const r = b.radius * currentScale;
          return {
            x: b.x,
            y: b.y,
            rSq: r * r,
          };
        });

        const imgData = maskCtx.createImageData(maskWidth, maskHeight);
        const data = imgData.data;

        for (let y = 0; y < maskHeight; y++) {
          const mainY = y / MASK_SCALE;
          for (let x = 0; x < maskWidth; x++) {
            const mainX = x / MASK_SCALE;

            let sum = 0;
            for (let i = 0; i < activeBlobs.length; i++) {
              const ab = activeBlobs[i];
              const dx = mainX - ab.x;
              const dy = mainY - ab.y;
              const d2 = dx * dx + dy * dy;

              if (d2 > 0.1) {
                sum += ab.rSq / d2;
              }
            }

            // Smoothstep on threshold 1.0
            const t = (sum - 0.75) / 0.50;
            const clamped = Math.max(0, Math.min(1, t));
            const alpha = clamped * clamped * (3 - 2 * clamped);

            const idx = (y * maskWidth + x) * 4;
            data[idx] = 255;
            data[idx + 1] = 255;
            data[idx + 2] = 255;
            data[idx + 3] = Math.floor(alpha * 255);
          }
        }
        maskCtx.putImageData(imgData, 0, 0);

        mainCtx.clearRect(0, 0, width, height);

        if (imgOverlay.complete && imgOverlay.naturalWidth > 0) {
          const imgRatio = imgOverlay.naturalWidth / imgOverlay.naturalHeight;
          const containerRatio = width / height;
          let drawX = 0;
          let drawY = 0;
          let drawWidth = width;
          let drawHeight = height;

          if (containerRatio > imgRatio) {
            drawHeight = width / imgRatio;
            drawY = (height - drawHeight) / 2;
          } else {
            drawWidth = height * imgRatio;
            drawX = (width - drawWidth) / 2;
          }

          mainCtx.drawImage(imgOverlay, drawX, drawY, drawWidth, drawHeight);

          // Mask with offscreen canvas metaballs
          mainCtx.globalCompositeOperation = "destination-in";
          mainCtx.drawImage(maskCanvas, 0, 0, width, height);
          mainCtx.globalCompositeOperation = "source-over";
        }
      } else {
        mainCtx.clearRect(0, 0, width, height);
      }
    }

    requestAnimationFrame(render);
  }

  // Start loop once image is loaded or immediately
  requestAnimationFrame(render);
}
