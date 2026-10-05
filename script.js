/* ==========================================================================
   JUSTIN NAVARRO - PORTFOLIO INTERACTIVE SCRIPT
   Features: Theme Switcher, Live Davao Clock, Mobile Navigation, Scroll Motion,
   Spotlight Cards, Project Carousels, Screenshots, Lightbox, Copy Toast, Progress
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
  const mobileMenuQuery = window.matchMedia("(max-width: 820px)");
  let menuScrollPosition = 0;

  const setMenuOpen = (isOpen) => {
    const wasOpen = document.body.classList.contains("menu-open");
    if (isOpen && !wasOpen) {
      menuScrollPosition = window.scrollY;
      document.body.style.top = `-${menuScrollPosition}px`;
    }

    menuButton?.setAttribute("aria-expanded", String(isOpen));
    menuButton?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    navigation?.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    if (navigation) navigation.inert = mobileMenuQuery.matches && !isOpen;
    document.querySelector("main")?.toggleAttribute("inert", isOpen);
    document.querySelector(".site-footer")?.toggleAttribute("inert", isOpen);

    if (!isOpen && wasOpen) {
      document.body.style.top = "";
      window.scrollTo({ top: menuScrollPosition, behavior: "instant" });
      handleScroll();
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  navLinks?.forEach((link) => link.addEventListener("click", closeMenu));
  header?.querySelector(".brand")?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (event.key === "Escape") {
      closeMenu();
      menuButton?.focus({ preventScroll: true });
    } else if (event.key === "Tab") {
      const controls = Array.from(header.querySelectorAll("a, button"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (!mobileMenuQuery.matches) closeMenu();
    if (navigation) navigation.inert = mobileMenuQuery.matches && !document.body.classList.contains("menu-open");
  });
  closeMenu();

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
        } else {
          card.classList.add("is-hidden");
        }
      });

      // Update visibility of groups
      projectGroups.forEach((group) => {
        const visibleCount = group.querySelectorAll(".project-card:not(.is-hidden), .project:not(.is-hidden)").length;
        group.classList.toggle("is-hidden", visibleCount === 0);
      });
      document.dispatchEvent(new Event("portfolio:projectfilterchange"));
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
        slide.inert = !isActive;
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

  // Loop original project cards so screenshots and links keep their handlers.
  document.querySelectorAll("#project-container .project-grid").forEach((carousel) => {
    const cards = Array.from(carousel.children);
    const group = carousel.closest(".project-group");
    const label = group.querySelector(".group-kicker").textContent;
    const viewport = document.createElement("div");
    viewport.className = "project-carousel-viewport reveal";
    if (group.dataset.group === "portrait") viewport.dataset.delay = "1";
    const track = document.createElement("div");
    track.className = "project-carousel-track";
    cards.forEach((card) => card.classList.remove("reveal", "is-visible"));
    track.append(...cards);
    viewport.append(track);
    carousel.classList.add("project-carousel");
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-roledescription", "carousel");
    carousel.setAttribute("aria-label", label);
    carousel.append(viewport);
    let isTouching = false;
    let isInView = !("IntersectionObserver" in window);
    let ordered = [];
    let offset = 0;
    let step = 0;
    let cardWidth = 0;
    let viewportWidth = 0;
    let columnCount = 1;
    let frame = null;
    let lastTime = 0;
    let lastAccessibilityUpdate = 0;
    let touchStart;
    let swiped = false;
    let swipeClickTimer;
    let lastCarouselWidth = carousel.clientWidth;

    const updateAccessibility = () => {
      const threshold = Math.min(cardWidth * 0.12, 48);
      const displayed = new Set(ordered.filter((card, index) => {
        const left = index * step - offset;
        return left < viewportWidth - threshold && left + cardWidth > threshold;
      }));
      cards.forEach((card) => {
        const hidden = !displayed.has(card);
        if (card.inert !== hidden) card.inert = hidden;
        if (card.getAttribute("aria-hidden") !== String(hidden)) {
          card.setAttribute("aria-hidden", String(hidden));
        }
      });
    };
    const renderPosition = () => {
      if (step > 0 && ordered.length > columnCount) {
        while (offset >= step) {
          offset -= step;
          const first = ordered.shift();
          ordered.push(first);
          track.append(first);
        }
        while (offset < 0) {
          offset += step;
          const last = ordered.pop();
          ordered.unshift(last);
          track.prepend(last);
        }
      }
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };
    const tick = (time) => {
      // Constant speed, with no waiting between projects or jumps on wraparound.
      const speed = window.innerWidth <= 820 ? 18 : 24;
      if (lastTime) offset += Math.min(time - lastTime, 64) / 1000 * speed;
      lastTime = time;
      renderPosition();
      if (time - lastAccessibilityUpdate >= 150) {
        updateAccessibility();
        lastAccessibilityUpdate = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const syncMotion = () => {
      const shouldMove = isInView && !isTouching && !document.hidden && viewportWidth > 0
        && ordered.length > columnCount && !document.body.classList.contains("menu-open")
        && !document.querySelector(".image-lightbox[open]");
      if (shouldMove && frame === null) {
        lastTime = 0;
        frame = requestAnimationFrame(tick);
      } else if (!shouldMove && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
        lastTime = 0;
      }
    };
    const measure = () => {
      const oldStep = step;
      viewportWidth = viewport.clientWidth;
      columnCount = Number(getComputedStyle(carousel).getPropertyValue("--carousel-columns")) || 1;
      cardWidth = ordered[0]?.getBoundingClientRect().width ?? 0;
      step = ordered.length > 1
        ? ordered[1].getBoundingClientRect().left - ordered[0].getBoundingClientRect().left
        : cardWidth;
      offset = oldStep > 0 ? offset / oldStep * step : 0;
      if (ordered.length <= columnCount) offset = 0;
      renderPosition();
      updateAccessibility();
      syncMotion();
    };
    const resetCarousel = () => {
      track.append(...cards);
      ordered = cards.filter((card) => !card.classList.contains("is-hidden"));
      offset = 0;
      measure();
    };
    viewport.addEventListener("pointerdown", (event) => {
      clearTimeout(swipeClickTimer);
      swiped = false;
      touchStart = event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
      isTouching = Boolean(touchStart);
      syncMotion();
    });
    viewport.addEventListener("pointermove", (event) => {
      if (!touchStart) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      if ((swiped || Math.abs(dx) > 12) && Math.abs(dx) > Math.abs(dy) * 1.5
        && ordered.length > columnCount) {
        swiped = true;
        offset -= dx;
        touchStart = { x: event.clientX, y: event.clientY };
        renderPosition();
        updateAccessibility();
      }
    });
    const endTouch = () => {
      touchStart = null;
      isTouching = false;
      swipeClickTimer = setTimeout(() => { swiped = false; }, 300);
      syncMotion();
    };
    viewport.addEventListener("pointerup", endTouch);
    viewport.addEventListener("pointercancel", endTouch);
    viewport.addEventListener("click", (event) => {
      if (!swiped) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      swiped = false;
    }, true);
    document.addEventListener("visibilitychange", syncMotion);
    document.addEventListener("portfolio:lightboxchange", syncMotion);
    document.addEventListener("portfolio:projectfilterchange", resetCarousel);
    // Mobile browser chrome changes height during scrolling; preserve the slide.
    const handleCarouselResize = () => {
      const width = carousel.clientWidth;
      if (width === lastCarouselWidth) return;
      lastCarouselWidth = width;
      measure();
    };
    if ("ResizeObserver" in window) {
      new ResizeObserver(handleCarouselResize).observe(carousel);
    } else {
      window.addEventListener("resize", handleCarouselResize);
    }
    new MutationObserver(syncMotion).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        isInView = entries[0].isIntersecting;
        syncMotion();
      });
      observer.observe(viewport);
    }
    resetCarousel();
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
        document.dispatchEvent(new Event("portfolio:lightboxchange"));
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
    lightbox.addEventListener("close", () => {
      document.dispatchEvent(new Event("portfolio:lightboxchange"));
    });
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  // ==========================================
  // 12. REPEATABLE SCROLL TRANSITIONS
  // ==========================================
  const revealItems = document.querySelectorAll(".reveal");
  let revealObserver;
  let motionResizeFrame;

  const configureScrollMotion = () => {
    revealObserver?.disconnect();

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const headerHeight = header?.getBoundingClientRect().height ?? 64;
    const distance = window.innerWidth <= 640 ? 40 : 80;
    const viewportHeight = Math.max(1, window.innerHeight - headerHeight);
    const revealThresholds = new Map(Array.from(revealItems, (item) => [
      item,
      Math.min(0.12, viewportHeight / Math.max(1, item.offsetHeight) * 0.16),
    ]));
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          const isVisible = entry.isIntersecting && entry.intersectionRatio >= revealThresholds.get(item);
          item.classList.toggle("is-visible", isVisible);
        });
      },
      {
        threshold: Array.from(new Set([0, ...revealThresholds.values()])),
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
      }
    );

    revealItems.forEach((item) => {
      // Paired content enters from opposite sides and exits to the same side.
      const offset = item.dataset.delay === "1" ? distance : -distance;
      item.style.setProperty("--reveal-offset", `${offset}px`);
      revealObserver.observe(item);
    });
    document.body.classList.add("reveal-init");
  };

  configureScrollMotion();
  const scheduleScrollMotion = () => {
    cancelAnimationFrame(motionResizeFrame);
    motionResizeFrame = requestAnimationFrame(configureScrollMotion);
  };
  window.addEventListener("resize", scheduleScrollMotion);
  if ("ResizeObserver" in window) {
    // Recalculate after fonts, images, or project filtering change item sizes.
    const motionSizeObserver = new ResizeObserver(scheduleScrollMotion);
    revealItems.forEach((item) => motionSizeObserver.observe(item));
    if (header) motionSizeObserver.observe(header);
  }

  // Keyboard navigation can always reveal and reach offscreen content.
  revealItems.forEach((item) => {
    item.addEventListener("focusin", () => item.classList.add("is-visible"));
  });
});
