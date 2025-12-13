document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.querySelector(".submit-btn");
  const navItems = document.querySelectorAll(".nav-item[data-href]");
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
  handleScreenSize();
  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      if (sidebar.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
    overlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
    document.addEventListener("click", function (e) {
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
  }
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const href = this.getAttribute("data-href");
      if (href) {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          overlay.classList.remove("active");
          document.body.style.overflow = "";
        }
        window.location.href = href;
      }
    });
  });
  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      if (!name || !email || !message) {
        alert("Please fill in all fields");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address");
        return;
      }
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
      submitBtn.classList.add("sending");
      setTimeout(() => {
        submitBtn.textContent = "Message Sent!";
        submitBtn.classList.remove("sending");
        submitBtn.classList.add("success");
        contactForm.classList.add("success");
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove("success");
          contactForm.classList.remove("success");
          alert("Thank you for your message! We will get back to you soon.");
        }, 2000);
      }, 1500);
    });
  }
  window.addEventListener("resize", handleScreenSize);
});
