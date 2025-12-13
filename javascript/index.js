document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("enterButton");
  const buttonAnimationContainer = document.getElementById(
    "buttonAnimationContainer"
  );
  const pageTransition = document.getElementById("pageTransition");
  const galleryPreview = document.getElementById("galleryPreview");

  // Typing effect
  const subtitle = document.querySelector(".hero-subtitle");
  const originalText = subtitle.textContent;
  subtitle.textContent = "";

  let i = 0;
  const typeWriter = () => {
    if (i < originalText.length) {
      subtitle.textContent += originalText.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
  };

  setTimeout(typeWriter, 1000);

  // Button click animation
  button.addEventListener("click", function () {
    if (
      this.classList.contains("loading") ||
      this.classList.contains("success")
    ) {
      return;
    }

    // Particle explosion
    createParticleExplosion(this);

    setTimeout(() => {
      this.classList.add("loading");
    }, 200);

    setTimeout(() => {
      this.classList.remove("loading");
      this.classList.add("success");
    }, 1500);

    const isMobile = window.innerWidth <= 767;

    // Faster transitions on mobile
    const transitionDelay = isMobile ? 1800 : 2200;
    const previewShowDelay = isMobile ? 100 : 100;
    const previewTime = isMobile ? 3500 : 6000;

    setTimeout(() => {
      pageTransition.style.display = "flex";

      setTimeout(() => {
        pageTransition.classList.add("active");

        setTimeout(() => {
          showGalleryPreview();

          setTimeout(() => {
            pageTransition.style.transition = "opacity 0.8s ease";
            pageTransition.style.opacity = "0";

            setTimeout(() => {
              window.location.href = "homepage.html";
            }, 800);
          }, previewTime);
        }, previewShowDelay);
      }, 10);
    }, transitionDelay);
  });

  function createParticleExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Fewer particles on mobile for performance
    const isMobile = window.innerWidth <= 767;
    const particleCount = isMobile ? 8 : 12;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * (isMobile ? 4 : 6) + (isMobile ? 3 : 4);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      const colorVariant = Math.floor(Math.random() * 30);
      particle.style.backgroundColor = `rgba(${68 + colorVariant}, ${
        54 + colorVariant
      }, ${39 + colorVariant}, 0.7)`;

      const angle = i * (360 / particleCount) + Math.random() * 15;
      const distance = isMobile
        ? 40
        : 60 + Math.random() * (isMobile ? 20 : 40);
      const tx = Math.cos((angle * Math.PI) / 180) * distance;
      const ty = Math.sin((angle * Math.PI) / 180) * distance;

      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;

      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);

      buttonAnimationContainer.appendChild(particle);
      particle.style.animation = `particleExplode ${
        isMobile ? "0.6s" : "0.8s"
      } ease-out forwards`;

      setTimeout(
        () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        },
        isMobile ? 600 : 800
      );
    }
  }

  function showGalleryPreview() {
    galleryPreview.innerHTML = `
            <div class="preview-content">
              <div class="preview-title">Welcome to The Gallery</div>
              <div class="preview-subtitle">Loading your artistic journey...</div>
              <div class="art-preview">
                <div class="art-frame"></div>
                <div class="art-frame"></div>
                <div class="art-frame"></div>
              </div>
              <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          `;

    setTimeout(() => {
      galleryPreview.classList.add("show");
    }, 100);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Reset button state on page load
  const button = document.getElementById("enterButton");
  if (button) {
    button.classList.remove("loading", "success");

    // Reset button content
    const buttonText = button.querySelector(".button-text");
    const buttonIcon = button.querySelector(".button-icon");

    if (buttonText) buttonText.textContent = "enter gallery";
    if (buttonIcon) buttonIcon.innerHTML = '<i class="fas fa-arrow-right"></i>';
  }
});
