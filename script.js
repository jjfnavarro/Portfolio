/* ==========================================================================
   JUSTIN NAVARRO - PORTFOLIO INTERACTIVE SCRIPT
   Features: Theme Switcher, Live Davao Clock, Command Palette (Ctrl+K),
   Spotlight Cards, Project Filters, Slideshow, Lightbox, Copy Toast, Progress
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const navigation = document.querySelector("[data-nav]");
  const navLinks = navigation?.querySelectorAll("a");
  const yearElement = document.querySelector("[data-year]");
  const scrollProgressBar = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");
  const localTimeEl = document.getElementById("local-time");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const toast = document.getElementById("toast");
  const toastMsg = toast?.querySelector(".toast-message");

  // ==========================================
  // 1. AUTO YEAR UPDATE
  // ==========================================
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // ==========================================
  // 2. LIVE DAVAO CITY CLOCK (UTC+8 / Asia/Manila)
  // ==========================================
  const updateLocalTime = () => {
    if (!localTimeEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      localTimeEl.textContent = formatted;
    } catch (e) {
      localTimeEl.textContent = "UTC+8";
    }
  };
  updateLocalTime();
  setInterval(updateLocalTime, 1000);

  // ==========================================
  // 3. THEME TOGGLE (Cosmic Dark / Vanilla Light)
  // ==========================================
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (e) {}
    
    // Update theme-color meta tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === "light" ? "#f7f9f0" : "#23212c";
    }
  };

  themeToggleBtn?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    showToast(nextTheme === "dark" ? "Theme set to Cosmic Dark" : "Theme set to Vanilla Light");
  });

  // ==========================================
  // 4. HEADER & SCROLL PROGRESS & BACK TO TOP
  // ==========================================
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Header scrolled state
    header?.classList.toggle("is-scrolled", scrollY > 20);

    // Reading progress bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // Back to top visibility
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("is-visible", scrollY > 400);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ==========================================
  // 5. MOBILE MENU
  // ==========================================
  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    navigation?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks?.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });

  // ==========================================
  // 6. SPOTLIGHT EFFECT ON CARDS
  // ==========================================
  const spotlightCards = document.querySelectorAll(".spotlight-card");
  spotlightCards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // ==========================================
  // 7. TOAST NOTIFICATIONS & COPY ACTIONS
  // ==========================================
  let toastTimer = null;
  const showToast = (message = "Copied to clipboard!") => {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    
    toast.classList.add("is-active");
    toast.setAttribute("aria-hidden", "false");
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-active");
      toast.setAttribute("aria-hidden", "true");
    }, 2800);
  };

  const copyButtons = document.querySelectorAll("[data-copy], .copy-email-action, .copy-badge-button");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute("data-copy") || "navarrojustin2026@gmail.com";
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied ${textToCopy} to clipboard!`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`Copied ${textToCopy} to clipboard!`);
      }
    });
  });

  // ==========================================
  // 8. INTERACTIVE WORK / PROJECT CATEGORY FILTERS
  // ==========================================
  const filterTabs = document.querySelectorAll(".filter-tab");
  const projectCards = document.querySelectorAll("#project-container .project-card, #project-container .project");
  const projectGroups = document.querySelectorAll("#project-container .project-group");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.getAttribute("data-filter") || "all";

      // Update active state on tabs
      filterTabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });

      // Filter project cards
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category") || "";
        const isMatch = filter === "all" || category.includes(filter);

        if (isMatch) {
          card.classList.remove("is-hidden");
          card.style.opacity = "";
          card.style.transform = "";
          card.style.transition = "";

          // Ensure active slide in any slideshow is visible
          const activeSlide = card.querySelector(".slide.is-active");
          if (activeSlide) {
            activeSlide.style.visibility = "visible";
            activeSlide.style.opacity = "1";
          }
        } else {
          card.classList.add("is-hidden");
        }
      });

      // Update visibility of groups
      projectGroups.forEach((group) => {
        const visibleCount = group.querySelectorAll(".project-card:not(.is-hidden), .project:not(.is-hidden)").length;
        group.classList.toggle("is-hidden", visibleCount === 0);
      });
    });
  });

  // Check URL query parameter for deep linking e.g. ?filter=production
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get("filter");
    if (initialFilter) {
      const targetTab = document.querySelector(`.filter-tab[data-filter="${initialFilter}"]`);
      if (targetTab) targetTab.click();
    }
  } catch (e) {}



  // ==========================================
  // 10. SCREENSHOT SLIDESHOWS
  // ==========================================
  const slideshows = document.querySelectorAll("[data-slideshow]");
  slideshows.forEach((slideshow) => {
    const slides = Array.from(slideshow.querySelectorAll("[data-slide]"));
    const previousButton = slideshow.querySelector("[data-slide-prev]");
    const nextButton = slideshow.querySelector("[data-slide-next]");
    const dotsContainer = slideshow.querySelector("[data-slide-dots]");

    if (slides.length <= 1) {
      slideshow.querySelector(".slideshow-controls")?.remove();
      slides[0]?.classList.add("is-active");
      return;
    }

    let activeIndex = Math.max(
      0,
      slides.findIndex((slide) => slide.classList.contains("is-active"))
    );

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slide-dot";
      dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer?.append(dot);
      return dot;
    });

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    previousButton?.addEventListener("click", () => showSlide(activeIndex - 1));
    nextButton?.addEventListener("click", () => showSlide(activeIndex + 1));
    showSlide(activeIndex);
  });

  // ==========================================
  // 11. IMAGE LIGHTBOX
  // ==========================================
  const slideshowImages = document.querySelectorAll("[data-slideshow] img, .project-visual img");
  if (slideshowImages.length) {
    const lightbox = document.createElement("dialog");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-label", "Project screenshot preview");
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close screenshot preview">&times;</button>
      <figure>
        <img alt="" />
        <figcaption></figcaption>
      </figure>
    `;
    document.body.append(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("figcaption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    const closeLightbox = () => {
      if (lightbox.open) lightbox.close();
    };

    slideshowImages.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `View larger: ${image.alt}`);
      image.title = "Click to view larger";

      const openImage = () => {
        if (!lightboxImage || !lightboxCaption) return;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.alt;
        lightbox.showModal();
        closeButton?.focus();
      };

      image.addEventListener("click", openImage);
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openImage();
        }
      });
    });

    closeButton?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  // ==========================================
  // 12. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealItems = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const checkImmediateVisibility = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= vh + 150) {
        item.classList.add("is-visible");
      }
    });
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    document.body.classList.add("reveal-init");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "150px 0px 200px 0px" }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });

    checkImmediateVisibility();
    setTimeout(checkImmediateVisibility, 150);
  }

  // Safety fallback: ensure nothing stays hidden
  setTimeout(() => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }, 1200);
});
