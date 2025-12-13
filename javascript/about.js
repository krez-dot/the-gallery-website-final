document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const navItems = document.querySelectorAll(".nav-item[data-href]");
  const groupPhoto = document.getElementById("groupPhoto");

  // Handle screen size changes
  function handleScreenSize() {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      menuToggle.style.display = "block";
      document.body.style.overflow = "";
    } else {
      sidebar.classList.add("active");
      overlay.classList.remove("active");
      menuToggle.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  // Initial screen size check
  handleScreenSize();

  // Mobile menu functionality
  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = menuToggle.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.7);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
          `;

      menuToggle.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Toggle sidebar
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = sidebar.classList.contains("active")
        ? "hidden"
        : "";
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(e.target) &&
        e.target !== menuToggle &&
        !overlay.contains(e.target)
      ) {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close sidebar with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const href = this.getAttribute("data-href");
      if (href) {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";

          if (window.innerWidth <= 768) {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
          }

          setTimeout(() => {
            window.location.href = href;
          }, 100);
        }, 150);
      }
    });
  });

  // Handle window resize
  window.addEventListener("resize", handleScreenSize);

  // Enhanced image hover effect
  if (groupPhoto) {
    groupPhoto.addEventListener("mouseenter", () => {
      groupPhoto.style.transform = "scale(1.02) rotate(0.5deg)";
    });

    groupPhoto.addEventListener("mouseleave", () => {
      groupPhoto.style.transform = "scale(1) rotate(0deg)";
    });

    // Add parallax effect on mousemove
    groupPhoto.addEventListener("mousemove", (e) => {
      const rect = groupPhoto.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / 50;
      const moveY = (y - centerY) / 50;

      groupPhoto.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) scale(1.02)`;
    });

    groupPhoto.addEventListener("mouseleave", () => {
      groupPhoto.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
      groupPhoto.style.transition = "transform 0.5s ease";
    });
  }

  // Add animation to bold and italic text on hover
  const boldText = document.querySelectorAll(".bold, .italic");
  boldText.forEach((text) => {
    text.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.display = "inline-block";
      this.style.transition = "transform 0.2s ease";
    });

    text.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Add scroll animation for sidebar items
  function checkSidebarInView() {
    const sidebarRect = sidebar.getBoundingClientRect();
    if (sidebarRect.top < window.innerHeight && sidebarRect.bottom > 0) {
      navItems.forEach((item, index) => {
        item.style.animationDelay = `${0.1 + index * 0.1}s`;
      });
    }
  }

  // Initial check
  checkSidebarInView();
  window.addEventListener("scroll", checkSidebarInView);
});
