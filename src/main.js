// ============================================================================
// OLAOLUWA.JS - Native JavaScript Controller for Academic Portfolio & Planner
// ============================================================================

function startApp() {
  initClock();
  initNavigation();
  initCanvasReveal();
  initAcademicPlanner();
  initContactForm();
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

// ============================================================================
// 4. ACADEMIC PLANNER WORKLOAD ENGINE (Local Storage Persistence)
// ============================================================================
function initAcademicPlanner() {
  const form = document.getElementById("add-task-form");
  const listContainer = document.getElementById("schedulers-list");
  const counterActive = document.getElementById("counter-active");
  const counterCompleted = document.getElementById("counter-completed");

  if (!form || !listContainer) return;

  // Initialize tasks
  let tasks = [];
  const stored = localStorage.getItem("academic_tasks_db");
  
  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch (e) {
      tasks = getDefaultTasks();
    }
  } else {
    tasks = getDefaultTasks();
  }

  function getDefaultTasks() {
    return [
      {
        id: "task-1",
        title: "COS 106 Syllabus Overview",
        category: "Lecture",
        priority: "Medium",
        dueDate: "2026-07-05",
        completed: true,
      },
      {
        id: "task-2",
        title: "Database Schema Prototype",
        category: "Lab",
        priority: "Low",
        dueDate: "2026-07-12",
        completed: false,
      },
      {
        id: "task-3",
        title: "Term Project System Submission",
        category: "Project",
        priority: "High",
        dueDate: "2026-07-20",
        completed: false,
      },
    ];
  }

  function persistTasks() {
    localStorage.setItem("academic_tasks_db", JSON.stringify(tasks));
  }

  // Toggle Task Completed
  function toggleTask(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    persistTasks();
    renderTasks();
  }

  // Delete Task item
  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    persistTasks();
    renderTasks();
  }

  // Render tasks list dynamically in HTML DOM
  function renderTasks() {
    // Clear dynamic portion
    listContainer.innerHTML = "";

    const activeCount = tasks.filter((t) => !t.completed).length;
    const completedCount = tasks.filter((t) => t.completed).length;

    if (counterActive) counterActive.textContent = activeCount.toString();
    if (counterCompleted) counterCompleted.textContent = completedCount.toString();

    if (tasks.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-schedulers-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          <p>No active academic tasks registered. Use the scheduler panel on the left to add upcoming events.</p>
        </div>
      `;
      return;
    }

    // Sort tasks: high priority first, then medium, then low. Active tasks before completed.
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    sortedTasks.forEach((task) => {
      const card = document.createElement("div");
      card.className = `scheduler-item-card ${task.completed ? "completed" : ""}`;

      // Build task HTML nodes
      card.innerHTML = `
        <div class="scheduler-item-content">
          <!-- Touch target button wrapper -->
          <button class="touch-target-button toggle-check-btn ${task.completed ? "active" : ""}" aria-label="Toggle completed state">
            <span class="checkbox-visual">
              <svg style="display: ${task.completed ? "block" : "none"}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17l-5-5"/></svg>
            </span>
          </button>
          
          <div class="scheduler-text-block">
            <span class="scheduler-item-title">${escapeHTML(task.title)}</span>
            <div class="scheduler-item-meta-badges">
              <span class="scheduler-meta-cat">${task.category}</span>
              <span class="scheduler-meta-priority ${task.priority.toLowerCase()}">${task.priority} Priority</span>
              <span>• Due: ${task.dueDate}</span>
            </div>
          </div>
        </div>

        <!-- Touch target delete wrapper -->
        <button class="touch-target-button btn-delete-task" aria-label="Delete task">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      `;

      // Event listener on checkbox
      const checkBtn = card.querySelector(".toggle-check-btn");
      checkBtn?.addEventListener("click", () => toggleTask(task.id));

      // Event listener on delete button
      const deleteBtn = card.querySelector(".btn-delete-task");
      deleteBtn?.addEventListener("click", () => deleteTask(task.id));

      listContainer.appendChild(card);
    });
  }

  // Handle Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("task-title-input");
    const catSelect = document.getElementById("task-category-select");
    const prioSelect = document.getElementById("task-priority-select");
    const dateInput = document.getElementById("task-date-input");

    if (!titleInput.value.trim() || !dateInput.value) return;

    const newTask = {
      id: "task-" + Date.now(),
      title: titleInput.value.trim(),
      category: catSelect.value,
      priority: prioSelect.value,
      dueDate: dateInput.value,
      completed: false,
    };

    tasks.push(newTask);
    persistTasks();
    renderTasks();

    // Reset inputs
    titleInput.value = "";
    dateInput.value = "";
  });

  // Initial render
  renderTasks();
}

// Helper to escape HTML and block injection
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 5. SECURE CONTACT PORT VALIDATION & GATEWAY
// ============================================================================
function initContactForm() {
  const form = document.getElementById("contact-form");
  const errAlert = document.getElementById("contact-error-alert");
  const errList = document.getElementById("contact-error-list");
  const successAlert = document.getElementById("contact-success-alert");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const phoneInput = document.getElementById("contact-phone");
    const messageInput = document.getElementById("contact-message");

    const errors = [];

    // Validation 1: Name Check
    if (!nameInput.value.trim()) {
      errors.push("Sender identifier name cannot be empty.");
    }

    // Validation 2: Email Pattern Check
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      errors.push("E-Mail reference is required.");
    } else if (!emailRegex.test(emailVal)) {
      errors.push("Provided e-mail address does not match standard patterns.");
    }

    // Validation 3: Phone Length Check
    const phoneVal = phoneInput.value.trim();
    if (phoneVal && phoneVal.replace(/[^0-9]/g, "").length < 5) {
      errors.push("Phone reference must contain at least 5 numeric digits.");
    }

    // Validation 4: Message Length Check
    const messageVal = messageInput.value.trim();
    if (!messageVal) {
      errors.push("Payload message content cannot be empty.");
    } else if (messageVal.length < 10) {
      errors.push("Message length must exceed 10 characters to establish handshake.");
    }

    // Toggle banners based on validation outcome
    if (errors.length > 0) {
      if (successAlert) successAlert.style.display = "none";
      if (errList) {
        errList.innerHTML = errors.map((err) => `<li>${escapeHTML(err)}</li>`).join("");
      }
      if (errAlert) errAlert.style.display = "flex";
    } else {
      if (errAlert) errAlert.style.display = "none";
      if (successAlert) successAlert.style.display = "flex";

      // Fire a standard browser notice safely inside iframe environments
      try {
        alert("Payload transmitted via secure simulated SSL handshake to Bankole Olaoluwa!");
      } catch (e) {
        console.log("Handshake alert suppressed: ", e);
      }

      // Clear fields
      nameInput.value = "";
      emailInput.value = "";
      phoneInput.value = "";
      messageInput.value = "";
    }
  });
}
