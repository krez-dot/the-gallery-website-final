document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initNavigation();
  initScrollAnimations();
  initCarousels();
  initImageModal();
  initBackgroundAudio();
  initLoadingScreen();
});

function initMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".mobile-overlay");

  if (!mobileToggle || !sidebar || !overlay) return;

  mobileToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", function () {
    mobileToggle.classList.remove("active");
    sidebar.classList.remove("active");
    this.classList.remove("active");
  });
}

function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const href = this.getAttribute("data-href");

      closeMobileMenu();

      if (href && href.includes(".html")) {
        window.location.href = href;
        return;
      }

      updateActiveNavItem(this);
      scrollToSection(this.querySelector(".nav-text").textContent);
    });
  });
}

function closeMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".mobile-overlay");

  if (mobileToggle?.classList.contains("active")) {
    mobileToggle.classList.remove("active");
    sidebar?.classList.remove("active");
    overlay?.classList.remove("active");
  }
}

function updateActiveNavItem(activeItem) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  activeItem.classList.add("active");
}

function scrollToSection(navText) {
  if (navText === "Home") {
    smoothScrollTo(0, 1200);
    return;
  }

  const targetId = navText.toLowerCase().replace(/\s+/g, "-");
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    const headerOffset = 100;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    smoothScrollTo(offsetPosition, 1000);
    return;
  }

  const sections = document.querySelectorAll(".section-title, .painters-title");
  for (let section of sections) {
    if (section.textContent.toLowerCase().includes(navText.toLowerCase())) {
      const parentSection = section.closest(".section");
      if (parentSection) {
        const headerOffset = 100;
        const elementPosition = parentSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        smoothScrollTo(offsetPosition, 1000);
        break;
      }
    }
  }
}

function smoothScrollTo(to, duration = 1000) {
  const start = window.pageYOffset;
  const change = to - start;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = easeInOutCubic(progress);
    const position = start + change * eased;

    window.scrollTo(0, position);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };
  const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  const sections = document.querySelectorAll(
    ".painters-section, .contemporary-art, .modern-art, .renaissance-art, .photography, .footer"
  );
  sections.forEach((section) => observer.observe(section));

  const dividerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".section-divider").forEach((divider) => {
    dividerObserver.observe(divider);
  });

  setTimeout(() => {
    document.querySelectorAll(".painter-card").forEach((card, index) => {
      setTimeout(() => card.classList.add("visible"), 500 + index * 300);
    });
  }, 1000);

  setTimeout(() => {
    document.querySelector(".sidebar")?.classList.add("loaded");
  }, 800);
}

function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("painters-section")) {
      entry.target.querySelectorAll(".painter-card").forEach((card, index) => {
        setTimeout(() => card.classList.add("visible"), index * 200);
      });
    }

    const artSections = [
      "contemporary-art",
      "modern-art",
      "renaissance-art",
      "photography",
    ];
    if (artSections.some((cls) => entry.target.classList.contains(cls))) {
      animateArtworkSection(entry.target);
    }
  });
}

function animateArtworkSection(section) {
  section.querySelectorAll(".artwork-img").forEach((img, index) => {
    setTimeout(() => img.classList.add("visible"), index * 100);
  });

  section.querySelectorAll(".artwork-info").forEach((info, index) => {
    setTimeout(() => info.classList.add("visible"), index * 100 + 200);
  });
}

function initCarousels() {
  initializeCarousels();
  window.addEventListener("resize", initializeCarousels);
}

function initializeCarousels() {
  if (window.innerWidth > 1024) {
    document
      .querySelectorAll(".painters-container, .art-section-container")
      .forEach((container) => {
        container.style.display = "block";
      });
    return;
  }

  createPainterCarousel();
  createArtworkCarousels();
}

function createPainterCarousel() {
  const painterCards = document.querySelectorAll(".painter-card");
  if (painterCards.length === 0) return;

  const paintersContainer = document.querySelector(".painters-container");
  if (!paintersContainer) return;

  paintersContainer.style.display = "none";

  let carouselContainer = document.querySelector(
    ".painters-carousel-container"
  );
  if (carouselContainer) return;

  carouselContainer = document.createElement("div");
  carouselContainer.className = "painters-carousel-container";
  paintersContainer.parentNode.insertBefore(
    carouselContainer,
    paintersContainer.nextSibling
  );

  const carouselHTML = `
    <div class="carousel-container">
      <div class="carousel-slides">
        ${Array.from(painterCards)
          .map(
            (card, index) => `
          <div class="carousel-slide polaroid ${index === 0 ? "active" : ""}">
            <div class="painter-card">
              ${card.querySelector("img").outerHTML}
              ${card.querySelector(".painter-name").outerHTML}
              ${card.querySelector(".painter-bio").outerHTML}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="carousel-controls">
        <button class="carousel-btn prev-btn">‹</button>
        <button class="carousel-btn next-btn">›</button>
      </div>
      <div class="carousel-dots">
        ${Array.from(painterCards)
          .map(
            (_, index) => `
          <button class="carousel-dot ${
            index === 0 ? "active" : ""
          }" data-index="${index}"></button>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  carouselContainer.innerHTML = carouselHTML;
  setupCarousel(
    ".painters-carousel-container .carousel-container",
    painterCards.length
  );
}

function createArtworkCarousels() {
  ["contemporary-art", "modern-art", "renaissance-art", "photography"].forEach(
    (sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const artContainer = section.querySelector(".art-section-container");
      if (!artContainer) return;

      artContainer.style.display = "none";

      if (section.querySelector(".art-carousel-container")) return;

      const artworkImgs = section.querySelectorAll(".artwork-img");
      const artworkInfos = section.querySelectorAll(".artwork-info");

      if (artworkImgs.length === 0) return;

      const carouselContainer = document.createElement("div");
      carouselContainer.className = "art-carousel-container";
      artContainer.parentNode.insertBefore(
        carouselContainer,
        artContainer.nextSibling
      );

      const slides = [];
      for (
        let i = 0;
        i < Math.max(artworkImgs.length, artworkInfos.length);
        i++
      ) {
        const img = artworkImgs[i]?.outerHTML || "";
        const info = artworkInfos[i]?.outerHTML || "";
        slides.push({ img, info });
      }

      const carouselHTML = `
      <div class="carousel-container">
        <div class="carousel-slides">
          ${slides
            .map(
              (slide, index) => `
            <div class="carousel-slide polaroid ${index === 0 ? "active" : ""}">
              ${slide.img}
              ${slide.info}
            </div>
          `
            )
            .join("")}
        </div>
        <div class="carousel-controls">
          <button class="carousel-btn prev-btn">‹</button>
          <button class="carousel-btn next-btn">›</button>
        </div>
        <div class="carousel-dots">
          ${slides
            .map(
              (_, index) => `
            <button class="carousel-dot ${
              index === 0 ? "active" : ""
            }" data-index="${index}"></button>
          `
            )
            .join("")}
        </div>
      </div>
    `;

      carouselContainer.innerHTML = carouselHTML;
      setupCarousel(
        `#${sectionId} .art-carousel-container .carousel-container`,
        slides.length
      );
    }
  );
}

function setupCarousel(containerSelector, totalSlides) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const slides = container.querySelectorAll(".carousel-slide");
  const prevBtn = container.querySelector(".prev-btn");
  const nextBtn = container.querySelector(".next-btn");
  const dots = container.querySelectorAll(".carousel-dot");

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % totalSlides);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }

  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  let touchStartX = 0;
  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  });
}

function initImageModal() {
  console.log("initImageModal called, window width:", window.innerWidth);

  const modal = {
    element: document.getElementById("imageModal"),
    img: document.getElementById("modalImg"),
    caption: document.getElementById("modalCaption"),
    close: document.getElementById("modalClose"),
    loading: document.getElementById("modalLoading"),
    zoomIn: document.getElementById("zoomIn"),
    zoomOut: document.getElementById("zoomOut"),
    zoomReset: document.getElementById("zoomReset"),
  };

  console.log("Modal elements:", {
    element: !!modal.element,
    img: !!modal.img,
    close: !!modal.close,
  });

  if (!modal.element) {
    console.error("Image modal element not found!");
    // Create modal if it doesn't exist
    createModal();
    return;
  }

  let allImages = [];
  let currentImageIndex = 0;
  let currentScale = 1;
  let isDesktop = window.innerWidth > 1024;

  // Collect all images
  collectClickableImages();

  // Setup for both desktop and mobile, but with different behaviors
  if (isDesktop) {
    // Desktop: Add hover effects and visual feedback
    setupDesktopImageInteractions();
  } else {
    // Mobile: Just make images clickable without hover effects
    setupMobileImageInteractions();
  }

  setupModalEvents();

  function setupDesktopImageInteractions() {
    console.log("Setting up desktop image interactions...");

    allImages.forEach((imageData) => {
      const img = imageData.element;

      // Make clickable
      img.style.cursor = "pointer";
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `View ${img.alt} in larger detail`);

      // Add hover effects
      if (imageData.type === "painter") {
        img.addEventListener("mouseenter", () => {
          img.style.transform = "scale(1.02)";
          img.style.transition = "transform 0.3s ease";
        });

        img.addEventListener("mouseleave", () => {
          img.style.transform = "scale(1)";
        });
      } else if (imageData.type === "artwork") {
        img.addEventListener("mouseenter", () => {
          img.style.transform = "scale(1.01)";
          img.style.opacity = "0.95";
          img.style.transition = "transform 0.3s ease, opacity 0.3s ease";
        });

        img.addEventListener("mouseleave", () => {
          img.style.transform = "scale(1)";
          img.style.opacity = "1";
        });
      }

      // Click listener
      img.addEventListener("click", function (e) {
        console.log("Image clicked on desktop:", img.alt);
        e.stopPropagation();
        handleImageClick(this);
      });
    });
  }

  function setupMobileImageInteractions() {
    console.log("Setting up mobile image interactions...");

    allImages.forEach((imageData) => {
      const img = imageData.element;

      // Make clickable
      img.style.cursor = "pointer";
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `Tap to view ${img.alt}`);

      // Touch/click listener for mobile
      img.addEventListener("click", function (e) {
        console.log("Image tapped on mobile:", img.alt);
        e.stopPropagation();
        handleImageClick(this);
      });

      // Also support touch events for better mobile UX
      img.addEventListener(
        "touchstart",
        function (e) {
          // Add touch feedback
          this.style.opacity = "0.8";
        },
        { passive: true }
      );

      img.addEventListener(
        "touchend",
        function (e) {
          this.style.opacity = "1";
        },
        { passive: true }
      );
    });
  }

  function handleImageClick(imgElement) {
    console.log("handleImageClick called for:", imgElement.src);

    // Add click animation (desktop only)
    if (isDesktop) {
      imgElement.classList.add("image-clicked");
      setTimeout(() => {
        imgElement.classList.remove("image-clicked");
      }, 600);
    }

    // Find this image in our collection
    const clickedSrc = imgElement.src;
    currentImageIndex = allImages.findIndex(
      (imgData) => imgData.src === clickedSrc
    );

    console.log("Found at index:", currentImageIndex);

    if (currentImageIndex !== -1) {
      openModal(currentImageIndex);
    } else {
      console.error("Image not found in collection!");
      openSingleImage(imgElement);
    }
  }

  function collectClickableImages() {
    allImages = [];
    console.log("Collecting all clickable images...");

    // Painter cards - check for both desktop and mobile versions
    const painterImages = document.querySelectorAll(
      ".painter-card img, .painters-carousel-container .painter-card img"
    );
    console.log("Found painter images:", painterImages.length);

    painterImages.forEach((img, index) => {
      // Find the closest card container
      const card = img.closest(".painter-card");
      if (!card) return;

      const name =
        card.querySelector(".painter-name")?.textContent ||
        `Painter ${index + 1}`;
      const bio = card.querySelector(".painter-bio")?.textContent || "";

      allImages.push({
        element: img,
        src: img.src,
        alt: img.alt,
        title: name,
        description: bio,
        type: "painter",
      });
    });

    // Artwork images - check for both grid and carousel versions
    const artworkImages = document.querySelectorAll(
      ".artwork-img, .art-carousel-container .artwork-img"
    );
    console.log("Found artwork images:", artworkImages.length);

    artworkImages.forEach((img, index) => {
      // Try to find artwork info
      let title = img.alt;
      let details = "";

      // Check if there's a sibling .artwork-info element
      const parent = img.closest(".artwork-group, .carousel-slide");
      if (parent) {
        const infoElement =
          parent.querySelector(".artwork-info") ||
          parent.nextElementSibling?.classList.contains("artwork-info")
            ? parent.nextElementSibling
            : null;

        if (infoElement) {
          title =
            infoElement.querySelector(".artwork-title")?.textContent || img.alt;
          details =
            infoElement.querySelector(".artwork-details")?.textContent || "";
        }
      }

      allImages.push({
        element: img,
        src: img.src,
        alt: img.alt,
        title: title,
        details: details,
        type: "artwork",
      });
    });

    // Hero image
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
      allImages.push({
        element: heroImage,
        src: heroImage.src,
        alt: heroImage.alt,
        title: "THE GALLERY",
        description: "Welcome to our curated art collection",
        type: "hero",
      });
    }

    console.log("Total images collected:", allImages.length);
  }

  function openModal(index) {
    console.log("openModal called with index:", index);

    if (index < 0 || index >= allImages.length) {
      console.error("Invalid index:", index);
      return;
    }

    currentImageIndex = index;
    const imageData = allImages[index];

    modal.loading.style.display = "block";
    modal.img.style.opacity = "0";
    modal.caption.innerHTML = "";

    const img = new Image();
    img.onload = function () {
      console.log("Image loaded successfully");
      modal.img.src = imageData.src;
      modal.img.alt = imageData.alt;

      // Set caption
      let caption = "";
      if (imageData.type === "painter") {
        caption = `<strong>${imageData.title}</strong><br><br>${imageData.description}`;
      } else if (imageData.type === "artwork") {
        // Extract data from the original DOM element instead
        const imgElement = imageData.element;
        const parent = imgElement.closest(".artwork-group, .carousel-slide");
        let artworkInfo = "";

        if (parent) {
          const infoElement = parent.nextElementSibling?.classList.contains(
            "artwork-info"
          )
            ? parent.nextElementSibling
            : parent.querySelector(".artwork-info");

          if (infoElement) {
            const title =
              infoElement.querySelector(".artwork-title")?.textContent ||
              imageData.title;
            const details =
              infoElement.querySelector(".artwork-details")?.innerHTML || "";

            caption = `
        <strong>${title}</strong><br>
        <div style="margin-top: 5px">${details}</div>
      `;
          }
        } else {
          // Fallback to original
          caption = `<strong>${imageData.title}</strong><br>${imageData.details}`;
        }
      }

      modal.caption.innerHTML = caption;

      // Show modal
      modal.element.classList.add("active");
      modal.element.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        modal.loading.style.display = "none";
        modal.img.style.opacity = "1";
        resetZoom();

        // Focus close button for accessibility
        modal.close.focus();
      }, 300);
    };

    img.onerror = function () {
      console.error("Failed to load image:", imageData.src);
      modal.loading.textContent = "Failed to load image";
      setTimeout(() => {
        modal.loading.style.display = "none";
        closeModal();
      }, 2000);
    };

    img.src = imageData.src;
  }

  function closeModal() {
    console.log("Closing modal");

    modal.element.classList.remove("active");
    modal.element.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetZoom();
  }

  function resetZoom() {
    currentScale = 1;
    modal.img.style.transform = `scale(${currentScale})`;
    modal.img.style.transformOrigin = "center center";
  }

  function setupModalEvents() {
    console.log("Setting up modal events for all devices");

    // Close modal
    modal.close.addEventListener("click", closeModal);

    // Close on background click
    modal.element.addEventListener("click", (e) => {
      if (e.target === modal.element) {
        closeModal();
      }
    });

    // Keyboard navigation (desktop)
    document.addEventListener("keydown", (e) => {
      if (!modal.element.classList.contains("active")) return;

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        if (currentImageIndex > 0) {
          openModal(currentImageIndex - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (currentImageIndex < allImages.length - 1) {
          openModal(currentImageIndex + 1);
        }
      }
    });

    // Touch/swipe support (mobile)
    let touchStartX = 0;
    modal.element.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    modal.element.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0 && currentImageIndex < allImages.length - 1) {
            openModal(currentImageIndex + 1);
          } else if (diff < 0 && currentImageIndex > 0) {
            openModal(currentImageIndex - 1);
          }
        }
      },
      { passive: true }
    );

    // Zoom controls
    if (modal.zoomIn) {
      modal.zoomIn.addEventListener("click", () => {
        currentScale = Math.min(currentScale + 0.2, 3);
        modal.img.style.transform = `scale(${currentScale})`;
      });
    }

    if (modal.zoomOut) {
      modal.zoomOut.addEventListener("click", () => {
        currentScale = Math.max(currentScale - 0.2, 0.5);
        modal.img.style.transform = `scale(${currentScale})`;
      });
    }

    if (modal.zoomReset) {
      modal.zoomReset.addEventListener("click", resetZoom);
    }
  }

  function createModal() {
    console.log("Creating modal element");

    const modalHTML = `
      <div class="image-modal" id="imageModal" role="dialog" aria-modal="true" aria-labelledby="modalCaption" aria-hidden="true">
        <button class="modal-close" id="modalClose" aria-label="Close image view">&times;</button>
        <div class="modal-content">
          <img class="modal-img" id="modalImg" src="" alt="" />
          <div class="modal-caption" id="modalCaption" role="region" aria-live="polite"></div>
          <div class="modal-zoom-controls">
            <button class="zoom-btn" id="zoomIn" aria-label="Zoom in">+</button>
            <button class="zoom-btn" id="zoomOut" aria-label="Zoom out">-</button>
            <button class="zoom-btn" id="zoomReset" aria-label="Reset zoom">↺</button>
          </div>
          <div class="modal-swipe-indicator" aria-hidden="true">Swipe to navigate</div>
        </div>
        <div class="modal-loading" id="modalLoading" style="display: none" aria-live="assertive">Loading</div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Reinitialize with the new modal
    initImageModal();
  }

  // Update on resize
  window.addEventListener("resize", function () {
    isDesktop = window.innerWidth > 1024;

    // Re-setup interactions if needed
    allImages.forEach((imageData) => {
      const img = imageData.element;

      if (isDesktop) {
        // Re-add hover effects for desktop
        img.style.cursor = "pointer";

        if (imageData.type === "painter") {
          img.onmouseenter = null;
          img.onmouseleave = null;

          img.addEventListener("mouseenter", () => {
            img.style.transform = "scale(1.02)";
            img.style.transition = "transform 0.3s ease";
          });

          img.addEventListener("mouseleave", () => {
            img.style.transform = "scale(1)";
          });
        }
      } else {
        // Remove hover effects for mobile
        img.style.cursor = "pointer";
        img.onmouseenter = null;
        img.onmouseleave = null;
        img.style.transform = "";
        img.style.opacity = "";
      }
    });
  });

  console.log("Image modal initialization complete for all devices");
}

function initBackgroundAudio() {
  const audio = document.getElementById("backgroundAudio");
  const audioToggleBtn = document.getElementById("audioToggleBtn");
  const audioExpandedPanel = document.getElementById("audioExpandedPanel");
  const audioToggleExpanded = document.getElementById("audioToggleExpanded");
  const closeExpandedBtn = document.getElementById("closeExpandedBtn");
  const prevBtn = document.getElementById("prevTrack");
  const nextBtn = document.getElementById("nextTrack");
  const trackTitle = document.querySelector(".track-title");
  const trackDetails = document.querySelector(".track-details");
  const volumeControl = document.getElementById("volumeControl");
  const volumeLevel = document.querySelector(".volume-level");
  const trackLoading = document.getElementById("trackLoading");

  if (!audio || !audioToggleBtn) return;

  // Track information for the 3-song loop
  const tracks = [
    {
      title: "Gymnopédie No. 1",
      composer: "Erik Satie",
      year: "1888",
      trackNum: "1/3",
      filename: "gymnopedie-no1.mp3",
    },
    {
      title: "Gymnopédie No. 2",
      composer: "Erik Satie",
      year: "1888",
      trackNum: "2/3",
      filename: "gymnopedie-no2.mp3",
    },
    {
      title: "Gymnopédie No. 3",
      composer: "Erik Satie",
      year: "1888",
      trackNum: "3/3",
      filename: "gymnopedie-no3.mp3",
    },
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let isExpanded = false;
  let userInteracted = false;

  // Load saved preferences
  const savedMuted = localStorage.getItem("galleryAudioMuted") === "true";
  const savedVolume = parseInt(
    localStorage.getItem("galleryAudioVolume") || "30"
  );

  // Set initial volume and ensure percentage shows
  function setVolume(volume) {
    const vol = Math.min(Math.max(volume, 0), 100);
    volumeControl.value = vol;
    audio.volume = vol / 100;

    // ALWAYS update volume level display
    if (volumeLevel) {
      volumeLevel.textContent = `${vol}%`;
      volumeLevel.style.opacity = "1";
      volumeLevel.style.visibility = "visible";
      volumeLevel.style.display = "block";
    }

    localStorage.setItem("galleryAudioVolume", vol);
  }

  // Initialize volume
  setVolume(savedVolume);

  // Update track info
  function updateTrackInfo() {
    const track = tracks[currentTrackIndex];
    if (trackTitle) {
      trackTitle.textContent = `${track.title} • ${track.composer}`;
    }
    if (trackDetails) {
      trackDetails.textContent = `Track ${track.trackNum} • ${track.year}`;
    }
  }

  // Update audio UI
  function updateAudioUI(playing) {
    const audioIcons = document.querySelectorAll(".audio-icon");
    const mutedIcons = document.querySelectorAll(".muted-icon");

    isPlaying = playing;

    if (playing) {
      audioIcons.forEach((icon) => (icon.style.display = "block"));
      mutedIcons.forEach((icon) => (icon.style.display = "none"));
      audioToggleBtn.classList.add("active");
      if (audioToggleExpanded) audioToggleExpanded.classList.add("active");
    } else {
      audioIcons.forEach((icon) => (icon.style.display = "none"));
      mutedIcons.forEach((icon) => (icon.style.display = "block"));
      audioToggleBtn.classList.remove("active");
      if (audioToggleExpanded) audioToggleExpanded.classList.remove("active");
    }
  }

  // Load and play a specific track
  function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;

    currentTrackIndex = index;
    const track = tracks[index];

    if (trackLoading) {
      trackLoading.style.display = "block";
    }

    // Update audio source
    audio.src = track.filename;
    updateTrackInfo();

    // Load the track
    audio.load();

    // If we were playing, start the new track
    if (!audio.muted && userInteracted) {
      audio
        .play()
        .then(() => {
          if (trackLoading) {
            trackLoading.style.display = "none";
          }
          updateAudioUI(true);
        })
        .catch((error) => {
          console.log("Track play error:", error);
          if (trackLoading) {
            trackLoading.style.display = "none";
          }
        });
    } else {
      if (trackLoading) {
        trackLoading.style.display = "none";
      }
    }
  }

  // Play next track in the 3-song loop
  function playNextTrack() {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(nextIndex);
  }

  // Play previous track in the 3-song loop
  function playPrevTrack() {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prevIndex);
  }

  // Initialize audio
  function initializeAudio() {
    // Start with the first track
    loadTrack(0);

    // Set up audio event listeners
    audio.addEventListener("ended", playNextTrack);

    // Start with saved mute state
    if (savedMuted) {
      audio.muted = true;
      updateAudioUI(false);
    } else {
      audio.muted = false;
      updateAudioUI(true);
    }

    // Try autoplay after a delay
    setTimeout(() => {
      if (!audio.muted && !userInteracted) {
        audio
          .play()
          .then(() => {
            updateAudioUI(true);
          })
          .catch(() => {
            // Autoplay blocked, wait for user interaction
          });
      }
    }, 1000);
  }

  // Toggle expanded panel
  function toggleExpandedPanel() {
    isExpanded = !isExpanded;
    if (isExpanded) {
      audioExpandedPanel.style.display = "block";
      // Close panel when clicking outside
      setTimeout(() => {
        document.addEventListener("click", closePanelOnClickOutside);
      }, 100);
    } else {
      audioExpandedPanel.style.display = "none";
      document.removeEventListener("click", closePanelOnClickOutside);
    }
  }

  // Close panel when clicking outside
  function closePanelOnClickOutside(event) {
    if (
      !audioExpandedPanel.contains(event.target) &&
      !audioToggleBtn.contains(event.target) &&
      audioExpandedPanel.style.display === "block"
    ) {
      isExpanded = false;
      audioExpandedPanel.style.display = "none";
      document.removeEventListener("click", closePanelOnClickOutside);
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    userInteracted = true;

    if (audio.muted) {
      // Unmute and play
      audio.muted = false;
      localStorage.setItem("galleryAudioMuted", "false");

      audio
        .play()
        .then(() => {
          updateAudioUI(true);
        })
        .catch((error) => {
          console.log("Play error:", error);
        });
    } else {
      // Mute
      audio.muted = true;
      localStorage.setItem("galleryAudioMuted", "true");
      updateAudioUI(false);
    }

    // Click animation
    const clickedBtn = audioToggleExpanded || audioToggleBtn;
    clickedBtn.classList.add("clicked");
    setTimeout(() => {
      clickedBtn.classList.remove("clicked");
    }, 400);
  }

  // Initialize
  initializeAudio();

  // Event listeners
  audioToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleExpandedPanel();
  });

  if (audioToggleExpanded) {
    audioToggleExpanded.addEventListener("click", function (e) {
      e.stopPropagation();
      togglePlayPause();
    });
  }

  if (closeExpandedBtn) {
    closeExpandedBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      isExpanded = false;
      audioExpandedPanel.style.display = "none";
      document.removeEventListener("click", closePanelOnClickOutside);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userInteracted = true;
      playPrevTrack();
      showTrackNotification(`Playing: ${tracks[currentTrackIndex].title}`);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userInteracted = true;
      playNextTrack();
      showTrackNotification(`Playing: ${tracks[currentTrackIndex].title}`);
    });
  }

  // Volume control - FIXED: Always update percentage
  volumeControl.addEventListener("input", function () {
    userInteracted = true;
    setVolume(this.value);

    // If volume > 0 and muted, unmute
    if (this.value > 0 && audio.muted) {
      audio.muted = false;
      localStorage.setItem("galleryAudioMuted", "false");
      updateAudioUI(true);
    }

    // If volume is 0, mute
    if (this.value == 0 && !audio.muted) {
      audio.muted = true;
      localStorage.setItem("galleryAudioMuted", "true");
      updateAudioUI(false);
    }
  });

  // Also update on change for better mobile support
  volumeControl.addEventListener("change", function () {
    setVolume(this.value);
  });

  // Handle page visibility changes
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      audio.pause();
    } else if (!audio.muted && userInteracted) {
      audio.play().catch(() => {
        // Playback might be blocked
      });
    }
  });

  // Listen for user interaction to enable audio
  const enableAudio = () => {
    userInteracted = true;
    if (!audio.muted && audio.paused) {
      audio
        .play()
        .then(() => {
          updateAudioUI(true);
        })
        .catch((error) => {
          console.log("Playback error:", error);
        });
    }
  };

  document.addEventListener("click", enableAudio);
  document.addEventListener("touchstart", enableAudio, { passive: true });
  document.addEventListener("keydown", enableAudio);

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (isExpanded) {
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "ArrowLeft") {
        playPrevTrack();
      } else if (e.key === "ArrowRight") {
        playNextTrack();
      } else if (e.key === "Escape") {
        isExpanded = false;
        audioExpandedPanel.style.display = "none";
        document.removeEventListener("click", closePanelOnClickOutside);
      }
    }
  });

  // Mobile long-press for next track
  let pressTimer;
  audioToggleBtn.addEventListener(
    "touchstart",
    function (e) {
      pressTimer = setTimeout(() => {
        userInteracted = true;
        playNextTrack();
        showTrackNotification(`Next: ${tracks[currentTrackIndex].title}`);
      }, 500);
    },
    { passive: true }
  );

  audioToggleBtn.addEventListener(
    "touchend",
    function (e) {
      clearTimeout(pressTimer);
    },
    { passive: true }
  );

  audioToggleBtn.addEventListener(
    "touchmove",
    function (e) {
      clearTimeout(pressTimer);
    },
    { passive: true }
  );
}

// Track notification function
function showTrackNotification(message) {
  let notification = document.querySelector(".track-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "track-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 1500);
}

// Add this function if not already present
function showTrackNotification(message) {
  let notification = document.querySelector(".track-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "track-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 1500);
}

function showTrackNotification(message) {
  let notification = document.querySelector(".track-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "track-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 1500);
}
function showTrackNotification(message) {
  let notification = document.querySelector(".track-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "track-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 1500);
}

function showMobileNotification(message) {
  let notification = document.querySelector(".audio-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "audio-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function showTrackNotification(message) {
  let notification = document.querySelector(".track-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "track-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 1500);
}

function showMobileNotification(message) {
  let notification = document.querySelector(".audio-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "audio-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function showTrackNotification(message) {
  let notification = document.querySelector(".track-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "track-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function showMobileNotification(message) {
  let notification = document.querySelector(".audio-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "audio-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function showMobileNotification(message) {
  let notification = document.querySelector(".audio-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "audio-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Also add this CSS for better mobile audio controls:

function setupMobileAudioControls(audioToggle, audioControls) {
  if (window.innerWidth > 768) return;

  let touchStartTime = 0;
  let touchTimer = null;

  audioToggle.addEventListener(
    "touchstart",
    function () {
      touchStartTime = Date.now();
      touchTimer = setTimeout(() => {
        audioControls.classList.add("active");
      }, 500);
    },
    { passive: true }
  );

  audioToggle.addEventListener("touchend", function () {
    clearTimeout(touchTimer);
  });

  document.addEventListener("touchstart", function (e) {
    if (
      audioControls.classList.contains("active") &&
      !audioControls.contains(e.target)
    ) {
      audioControls.classList.remove("active");
    }
  });
}

function showMobileNotification(message) {
  let notification = document.querySelector(".audio-notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "audio-notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function initLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen");
  if (!loadingScreen) return;

  const images = document.querySelectorAll("img");
  const totalImages = images.length;
  let loadedImages = 0;

  loadingScreen.style.display = "flex";
  updateLoadingText("Preparing gallery experience...");

  const progressBar = createProgressBar();
  loadingScreen.querySelector(".loading-content").appendChild(progressBar);

  images.forEach((img) => {
    img.classList.add("image-loading");

    if (img.complete) {
      imageLoaded();
    } else {
      img.addEventListener("load", imageLoaded);
      img.addEventListener("error", imageLoaded);
      setTimeout(imageLoaded, 5000);
    }
  });

  if (totalImages === 0) {
    finishLoading();
  } else {
    setTimeout(finishLoading, 10000);
  }

  function imageLoaded() {
    loadedImages++;
    updateProgressBar(loadedImages, totalImages);
    updateLoadingText(`Loading images: ${loadedImages}/${totalImages}`);

    if (this?.classList) {
      this.classList.remove("image-loading");
    }

    if (loadedImages >= totalImages) {
      finishLoading();
    }
  }

  function finishLoading() {
    updateLoadingText("Entering The Gallery...");
    loadingScreen.classList.add("fade-out");

    setTimeout(() => {
      loadingScreen.style.display = "none";
      document.body.classList.add("loaded");

      const audio = document.getElementById("backgroundAudio");
      if (audio && !audio.paused) {
        audio.play().catch((e) => console.log("Audio autoplay prevented"));
      }
    }, 800);
  }
}

function updateLoadingText(text) {
  const loadingText = document.querySelector(".loading-text");
  if (loadingText) loadingText.textContent = text;
}

function createProgressBar() {
  const container = document.createElement("div");
  container.className = "loading-progress";
  container.innerHTML =
    '<div class="loading-progress-bar" id="progressBar"></div>';
  return container;
}

function updateProgressBar(loaded, total) {
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    const progress = (loaded / total) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

window.testLoading = function (delay = 2000) {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.style.display = "flex";
    loadingScreen.classList.remove("fade-out");
    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      setTimeout(() => (loadingScreen.style.display = "none"), 800);
    }, delay);
  }
};

window.showLoading = function () {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.style.display = "flex";
    loadingScreen.classList.remove("fade-out");
  }
};
function initParallaxBlur() {
  const parallaxElements = document.querySelectorAll('.hero-image, .painter-card img, .artwork-img');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax effect
      const speed = 0.3 + (index % 3) * 0.1;
      const yPos = -(scrolled * speed);
      
      // Calculate blur based on position
      const distanceFromCenter = Math.abs((elementTop + rect.height / 2) - (scrolled + windowHeight / 2));
      const blurAmount = Math.min(distanceFromCenter / windowHeight * 5, 3);
      
      // Apply parallax and blur
      element.style.transform = `translateY(${yPos}px)`;
      element.style.filter = `blur(${blurAmount}px)`;
    });
  }, { passive: true });
}
