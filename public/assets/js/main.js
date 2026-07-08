(function () {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("#primary-nav");
  const toggle = document.querySelector(".nav-toggle");
  const year = document.querySelector("[data-year]");

  if (year) year.textContent = new Date().getFullYear();

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", open);
    if (open) {
      const firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setMenu(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", event => {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus({ preventScroll: true });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) setMenu(false);
    });
  }

  if (header) {
    const onScroll = () => header.classList.toggle("is-sticky", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-count]").forEach(counter => {
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 28));
    const tick = () => {
      current = Math.min(target, current + step);
      counter.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
  });

  const form = document.querySelector("#enquiry-form");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const message = document.querySelector("#form-message");
      if (!form.checkValidity()) {
        form.reportValidity();
        if (message) message.textContent = "Please complete the required fields before sending.";
        return;
      }

      const data = new FormData(form);
      const text = `Hello EduPath India, I need guidance regarding college admission.%0AName: ${encodeURIComponent(data.get("name"))}%0APhone: ${encodeURIComponent(data.get("phone"))}%0ACourse: ${encodeURIComponent(data.get("course") || "")}%0ALocation: ${encodeURIComponent(data.get("location") || "")}%0AMessage: ${encodeURIComponent(data.get("message"))}`;
      if (message) message.textContent = "This static form has no backend yet. Opening WhatsApp with your enquiry details.";
      window.open(`https://wa.me/919019492121?text=${text}`, "_blank", "noopener");
    });
  }
})();
