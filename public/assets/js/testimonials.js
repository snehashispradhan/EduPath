const testimonialFallback = [
  { studentName: "Aarav Mishra", course: "B.Tech Computer Science", city: "Bhubaneswar", testimonial: "EduPath India helped me compare branches and prepare a cleaner admission checklist. I could discuss options with my family with more confidence.", rating: 5, image: "assets/images/student-placeholder-1.svg", bannerImage: "assets/images/testimonials/testimonial-01.svg", bannerAlt: "Student testimonial banner for Aarav Mishra, B.Tech Computer Science", featured: true },
  { studentName: "Priya Nair", course: "MBA", city: "Cuttack", testimonial: "The counselling conversation helped me understand MBA specialisations and the questions I should ask colleges before applying.", rating: 5, image: "assets/images/student-placeholder-2.svg", bannerImage: "assets/images/testimonials/testimonial-02.svg", bannerAlt: "Student testimonial banner for Priya Nair, MBA", featured: true },
  { studentName: "Rohan Das", course: "BCA", city: "Rourkela", testimonial: "I was unsure about BCA and engineering alternatives. EduPath India explained the differences in a practical, student-friendly way.", rating: 4, image: "assets/images/student-placeholder-3.svg", bannerImage: "assets/images/testimonials/testimonial-03.svg", bannerAlt: "Student testimonial banner for Rohan Das, BCA", featured: true },
  { studentName: "Sanya Patra", course: "B.Tech Data Science", city: "Sambalpur", testimonial: "The guidance was clear and did not pressure me. I got a better sense of course fit and application steps.", rating: 5, image: "assets/images/student-placeholder-1.svg", bannerImage: "assets/images/testimonials/testimonial-04.svg", bannerAlt: "Student testimonial banner for Sanya Patra, B.Tech Data Science", featured: false },
  { studentName: "Aditya Sen", course: "MBA Business Analytics", city: "Berhampur", testimonial: "EduPath India helped me prepare questions for MBA colleges and compare options beyond only brand names.", rating: 4, image: "assets/images/student-placeholder-2.svg", bannerImage: "assets/images/testimonials/testimonial-05.svg", bannerAlt: "Student testimonial banner for Aditya Sen, MBA Business Analytics", featured: false },
  { studentName: "Meera Sahu", course: "B.Tech Civil Engineering", city: "Bhubaneswar", testimonial: "The team helped me organise admission documents and understand why verifying college details directly matters.", rating: 5, image: "assets/images/student-placeholder-3.svg", bannerImage: "assets/images/testimonials/testimonial-06.svg", bannerAlt: "Student testimonial banner for Meera Sahu, B.Tech Civil Engineering", featured: false }
];

async function loadTestimonials() {
  if (window.location.protocol === "file:") return testimonialFallback;
  try {
    const response = await fetch("data/testimonials.json");
    if (!response.ok) throw new Error("testimonials");
    return await response.json();
  } catch (error) {
    return testimonialFallback;
  }
}

function testimonialBanner(testimonial, options = {}) {
  const image = testimonial.bannerImage || testimonial.image || "assets/images/student-placeholder-1.svg";
  const alt = testimonial.bannerAlt || testimonial.alt || `Student testimonial from ${testimonial.studentName || "EduPath India student"}`;
  const loading = options.eager ? "eager" : "lazy";
  return `<article class="testimonial-banner${options.featured ? " testimonial-banner--featured" : ""}">
    <figure class="testimonial-banner__media">
      <img src="${image}" width="1200" height="675" loading="${loading}" decoding="async" alt="${alt}" data-fallback="${testimonial.image || "assets/images/student-placeholder-1.svg"}">
    </figure>
  </article>`;
}

function attachImageFallbacks(root = document) {
  root.querySelectorAll(".testimonial-banner img").forEach(image => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src.indexOf(fallback) === -1) {
        image.src = fallback;
        image.classList.add("is-fallback");
      } else {
        image.closest(".testimonial-banner__media")?.classList.add("has-image-error");
      }
    }, { once: true });
  });
}

(async () => {
  const data = (await loadTestimonials()).filter(item => item.studentName);
  const all = document.querySelector("#all-testimonials");
  if (all) {
    all.classList.add("testimonial-gallery");
    all.innerHTML = data.length
      ? data.map(testimonial => testimonialBanner(testimonial)).join("")
      : `<p class="notice">Testimonials will be updated soon.</p>`;
    attachImageFallbacks(all);
  }

  const track = document.querySelector("#testimonial-track");
  if (!track) return;

  const shell = document.querySelector("[data-testimonials-home]");
  const dots = document.querySelector("[data-testimonial-dots]");
  const nextButton = document.querySelector("[data-testimonial-next]");
  const prevButton = document.querySelector("[data-testimonial-prev]");
  const featured = data.filter(item => item.featured).concat(data.filter(item => !item.featured));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer;
  let startX = 0;

  if (!featured.length) {
    track.innerHTML = `<p class="notice">Testimonials will be updated soon.</p>`;
    return;
  }

  const render = () => {
    const active = featured[index % featured.length];
    track.innerHTML = testimonialBanner(active, { eager: true, featured: true });
    attachImageFallbacks(track);
    if (dots) {
      dots.innerHTML = featured.map((item, dotIndex) => `<button type="button" aria-label="Show testimonial ${dotIndex + 1}"${dotIndex === index ? " aria-current=\"true\"" : ""}></button>`).join("");
      dots.querySelectorAll("button").forEach((button, dotIndex) => {
        button.addEventListener("click", () => {
          index = dotIndex;
          stop();
          render();
        });
      });
    }
  };

  const next = () => {
    index = (index + 1) % featured.length;
    render();
  };
  const prev = () => {
    index = (index - 1 + featured.length) % featured.length;
    render();
  };
  const play = () => {
    if (!reduceMotion && featured.length > 1) timer = setInterval(next, 6200);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
  };

  if (nextButton) nextButton.textContent = "\u203A";
  if (prevButton) prevButton.textContent = "\u2039";

  nextButton?.addEventListener("click", () => {
    stop();
    next();
  });
  prevButton?.addEventListener("click", () => {
    stop();
    prev();
  });
  track.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      stop();
      next();
    }
    if (event.key === "ArrowLeft") {
      stop();
      prev();
    }
  });
  track.addEventListener("pointerdown", event => {
    startX = event.clientX;
  });
  track.addEventListener("pointerup", event => {
    if (Math.abs(event.clientX - startX) > 45) {
      stop();
      (event.clientX < startX ? next : prev)();
    }
  });
  shell?.addEventListener("mouseenter", stop);
  shell?.addEventListener("mouseleave", play);
  shell?.addEventListener("focusin", stop);
  shell?.addEventListener("focusout", play);

  if (featured.length === 1) shell?.classList.add("has-one-testimonial");
  render();
  play();
})();
