document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-container");
  if (navContainer) {
    const isSubpage = window.location.pathname.includes("/pages/");
    const homeLink = isSubpage ? "../index.html" : "index.html";
    const aboutLink = isSubpage ? "about.html" : "pages/about.html";
    const servicesLink = isSubpage ? "services.html" : "pages/services.html";
    const contactLink = isSubpage ? "contact.html" : "pages/contact.html";

    navContainer.innerHTML = `
      <nav class="navbar" aria-label="Main navigation">
        <button class="nav-toggle" id="menuToggle" type="button" aria-expanded="false" aria-label="Toggle navigation">
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

    navLinks.forEach((link) => {
      if (link.href === window.location.href) {
        link.classList.add("active-link");
      }
    });

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = menuWrapper.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
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

  const moodButtons = document.querySelectorAll(".mood-btn");
  const faceStage = document.getElementById("faceStage");
  const moodLabel = document.getElementById("moodLabel");

  if (moodButtons.length > 0 && faceStage && moodLabel) {
    const moods = {
      happy: { face: "😄", label: "lukwil aam! (Very Good)", anim: "anim-bounce" },
      sad: { face: "🥺", label: "agwii miilugwin! (dance it out)", anim: "anim-rain" },
      mad: { face: "😡", label: "ksinaahlxkw (breathe)", anim: "anim-shake" },
      tired: { face: "😴", label: "hahlais ńiiý ẃii sa. (I worked all day.)", anim: "anim-float" }
    };

    moodButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        moodButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        const selectedMood = moods[btn.dataset.mood];
        if (selectedMood) {
          faceStage.className = `face-stage ${selectedMood.anim}`;
          faceStage.textContent = selectedMood.face;
          moodLabel.textContent = selectedMood.label;
        }
      });
    });
  }

  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const thankYouModal = document.getElementById("thankYouModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (closeModalBtn && thankYouModal) {
    closeModalBtn.addEventListener("click", () => thankYouModal.close());
    thankYouModal.addEventListener("click", (event) => {
      const rect = thankYouModal.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) thankYouModal.close();
    });
  }

  if (contactForm && submitBtn) {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyG4HIYATwF4YgP5yW5hq_RpKNKou_zjFp6FUN6G9Ka2Jq2xKLnFZdqpLgQ7Aym5H8b1w/exec";

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>Sending...</span>";

      fetch(SCRIPT_URL, {
        method: "POST",
        body: new FormData(contactForm),
      })
        .then((response) => response.json())
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

      jumps.forEach((button, i) => {
        if (i === current) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      });

      closeContents();
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    jumps.forEach((button) => {
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
});
fetch("https://script.google.com/macros/s/AKfycbyAeFv2UEH52w3bhqKpmaSCu_Eju8yGGxh-BuOQWrm1fFesIFXMS1MNYP3-dBrDFnUIVg/exec", {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({
    date: "2026-10-26",
    dayOfWeek: "Monday",
    pageUrl: "https://tjb-8008135.github.io/wiinoxprofile.github.io/index.html",
    deviceCategory: "All Devices",
    viewCount: 1350
  })
})

