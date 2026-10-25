document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. DYNAMIC NAVIGATION
     ========================================================================== */
  const navContainer = document.getElementById("nav-container");

  if (navContainer) {
    const isSubpage = window.location.pathname.includes("/pages/");
    const homeLink = isSubpage ? "../index.html" : "index.html";
    const aboutLink = isSubpage ? "about.html" : "pages/about.html";
    const servicesLink = isSubpage ? "services.html" : "pages/services.html";
    const contactLink = isSubpage ? "contact.html" : "pages/contact.html";

    navContainer.innerHTML = `
      <nav class="navbar">
        <button class="nav-toggle" id="menuToggle" aria-expanded="false" aria-label="Toggle navigation">
          <span class="logo">gwilḵ'a</span>
          <span class="toggle-icon">▼</span>
        </button>
        <div class="nav-menu-wrapper" id="menuWrapper">
          <ul class="nav-links">
            <li><a href="${homeLink}">haẃ</a></li>
            <li><a href="${aboutLink}">adaawaḵdi</a></li>
            <li><a href="${servicesLink}">bukw</a></li>
            <li><a href="${contactLink}">gwińe'eskw</a></li>
          </ul>
        </div>
      </nav>
    `;

    const menuToggle = document.getElementById("menuToggle");
    const menuWrapper = document.getElementById("menuWrapper");
    const navLinks = document.querySelectorAll(".nav-links a");

    // Highlight active link based on current path
    navLinks.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active-link");
      }
    });

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menuWrapper.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.classList.toggle("active");
    });

    window.addEventListener("click", () => {
      if (menuWrapper.classList.contains("open")) {
        menuWrapper.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.classList.remove("active");
      }
    });
  }

  /* ==========================================================================
     2. MOOD / FEELINGS WIDGET (index.html)
     ========================================================================== */
  const moodButtons = document.querySelectorAll(".mood-btn");
  const faceStage = document.getElementById("faceStage");
  const moodLabel = document.getElementById("moodLabel");

  if (moodButtons.length > 0 && faceStage && moodLabel) {
    const moods = {
      happy: { face: "😄", label: "lukwil aam! (Very Good)", anim: "anim-bounce" },
      sad:   { face: "🥺", label: "agwii miilugwin! (dance it out)", anim: "anim-rain" },
      mad:   { face: "😡", label: "ksinaahlxkw (breathe)", anim: "anim-shake" },
      tired: { face: "😴", label: "hahlais ńiiý ẃii sa. (I worked all day.)", anim: "anim-float" }
    };

    moodButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        moodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedMood = moods[btn.dataset.mood];
        if (selectedMood) {
          faceStage.className = `face-stage ${selectedMood.anim}`;
          faceStage.textContent = selectedMood.face;
          moodLabel.textContent = selectedMood.label;
        }
      });
    });
  }

  /* ==========================================================================
     3. CONTACT FORM & MODAL (contact.html)
     ========================================================================== */
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const thankYouModal = document.getElementById("thankYouModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (closeModalBtn && thankYouModal) {
    closeModalBtn.addEventListener("click", () => thankYouModal.close());

    // Close when clicking overlay backdrop outside the modal dialog box
    thankYouModal.addEventListener("click", (e) => {
      const rect = thankYouModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        thankYouModal.close();
      }
    });
  }

  if (contactForm && submitBtn) {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyG4HIYATwF4YgP5yW5hq_RpKNKou_zjFp6FUN6G9Ka2Jq2xKLnFZdqpLgQ7Aym5H8b1w/exec";

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>Sending...</span>";

      fetch(SCRIPT_URL, {
        method: "POST",
        body: new FormData(contactForm)
      })
      .then(res => res.json())
      .then(() => {
        contactForm.reset();
        if (thankYouModal) thankYouModal.showModal();
      })
      .catch(() => {
        alert("There was an error submitting. Please try again.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  }

  /* ==========================================================================
     4. CATALOG VIEWER LOGIC (services.html)
     ========================================================================== */
  const catalogPages = [...document.querySelectorAll(".catalog-page")];

  if (catalogPages.length > 0) {
    const jumps = [...document.querySelectorAll(".jump")];
    const panel = document.getElementById("contents-panel");
    const toggle = document.getElementById("contents-toggle");
    const back = document.getElementById("back");
    const next = document.getElementById("next");
    const progress = document.getElementById("progress");
    const home = document.getElementById("home");
    let current = 0;

    function closeContents() {
      if (!panel) return;
      panel.hidden = true;
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }

    function showPage(index) {
      if (index < 0 || index >= catalogPages.length) return;
      if (index !== current) {
        catalogPages[current].hidden = true;
        current = index;
        catalogPages[current].hidden = false;
      }

      if (back) back.disabled = current === 0;
      if (next) next.disabled = current === catalogPages.length - 1;
      if (progress) progress.textContent = `Page ${current + 1} of ${catalogPages.length}`;

      jumps.forEach((btn, i) => {
        if (i === current) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      });

      closeContents();
      window.scrollTo(0, 0);
      catalogPages[current].focus({ preventScroll: true });
    }

    if (jumps.length > 0) jumps[0].setAttribute("aria-current", "page");
    if (home) home.addEventListener("click", () => showPage(0));
    if (back) back.addEventListener("click", () => showPage(current - 1));
    if (next) next.addEventListener("click", () => showPage(current + 1));

    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        toggle.setAttribute("aria-expanded", String(!panel.hidden));
      });
    }

    jumps.forEach(button => {
      button.addEventListener("click", () => showPage(Number(button.dataset.page)));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel && !panel.hidden) {
        closeContents();
        if (toggle) toggle.focus();
      }
    });

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
})
async function updateViewCount() {
  const counterElement = document.getElementById('view-count');
  if (!counterElement) return;

  try {
    // Namespace: unique identifier (e.g. your domain or username)
    // Key: the specific page or identifier
    const response = await fetch('https://script.google.com/macros/s/AKfycbwbCWHJpMPKoV1rtRu3yfLWbWbpm9ja9U7uBfhUuiI8-RHt9KuBjMguxOM_2mys9EhxfA/exec');
    const data = await response.json();
    counterElement.textContent = data.value.toLocaleString();
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    counterElement.textContent = '—';
  }
}

document.addEventListener('DOMContentLoaded', updateViewCount);
