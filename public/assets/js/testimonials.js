const testimonialFallback = [
  { studentName: "Aarav Mishra", course: "B.Tech Computer Science", city: "Bhubaneswar", testimonial: "EduPath India helped me compare branches and prepare a cleaner admission checklist. I could discuss options with my family with more confidence.", rating: 5, image: "assets/images/student-placeholder-1.svg", featured: true },
  { studentName: "Priya Nair", course: "MBA", city: "Cuttack", testimonial: "The counselling conversation helped me understand MBA specialisations and the questions I should ask colleges before applying.", rating: 5, image: "assets/images/student-placeholder-2.svg", featured: true },
  { studentName: "Rohan Das", course: "BCA", city: "Rourkela", testimonial: "I was unsure about BCA and engineering alternatives. EduPath India explained the differences in a practical, student-friendly way.", rating: 4, image: "assets/images/student-placeholder-3.svg", featured: true },
  { studentName: "Sanya Patra", course: "B.Tech Data Science", city: "Sambalpur", testimonial: "The guidance was clear and did not pressure me. I got a better sense of course fit and application steps.", rating: 5, image: "assets/images/student-placeholder-1.svg", featured: false },
  { studentName: "Aditya Sen", course: "MBA Business Analytics", city: "Berhampur", testimonial: "EduPath India helped me prepare questions for MBA colleges and compare options beyond only brand names.", rating: 4, image: "assets/images/student-placeholder-2.svg", featured: false },
  { studentName: "Meera Sahu", course: "B.Tech Civil Engineering", city: "Bhubaneswar", testimonial: "The team helped me organise admission documents and understand why verifying college details directly matters.", rating: 5, image: "assets/images/student-placeholder-3.svg", featured: false }
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

function testimonialCard(testimonial) {
  const stars = "★★★★★".slice(0, testimonial.rating) + "☆☆☆☆☆".slice(testimonial.rating, 5);
  return `<article class="testimonial-card"><img src="${testimonial.image}" width="64" height="64" loading="lazy" alt="Placeholder portrait for ${testimonial.studentName}"><h3>${testimonial.studentName}</h3><p><strong>${testimonial.course}</strong> · ${testimonial.city}</p><p class="stars" aria-label="${testimonial.rating} out of 5 stars">${stars}</p><blockquote>${testimonial.testimonial}</blockquote></article>`;
}

(async () => {
  const data = (await loadTestimonials()).filter(item => !item._comment);
  const all = document.querySelector("#all-testimonials");
  if (all) all.innerHTML = data.map(testimonialCard).join("");

  const track = document.querySelector("#testimonial-track");
  if (!track) return;
  let index = 0;
  let timer;
  let startX = 0;
  const featured = data.filter(item => item.featured).concat(data.filter(item => !item.featured));
  const render = () => {
    track.innerHTML = testimonialCard(featured[index % featured.length]);
  };
  const next = () => {
    index = (index + 1) % featured.length;
    render();
  };
  const prev = () => {
    index = (index - 1 + featured.length) % featured.length;
    render();
  };
  document.querySelector("[data-testimonial-next]")?.addEventListener("click", next);
  document.querySelector("[data-testimonial-prev]")?.addEventListener("click", prev);
  track.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  });
  track.addEventListener("pointerdown", event => {
    startX = event.clientX;
  });
  track.addEventListener("pointerup", event => {
    if (Math.abs(event.clientX - startX) > 45) (event.clientX < startX ? next : prev)();
  });
  const shell = document.querySelector("[data-testimonials-home]");
  const play = () => {
    timer = setInterval(next, 5200);
  };
  const stop = () => clearInterval(timer);
  shell?.addEventListener("mouseenter", stop);
  shell?.addEventListener("mouseleave", play);
  render();
  play();
})();
