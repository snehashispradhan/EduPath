const fallbackNews = [
  { id: "eng-2026", title: "Engineering Admission Guide 2026", slug: "engineering-admission-guide-2026", summary: "A practical overview for students exploring B.Tech admission, engineering branches, and private college guidance in 2026.", category: "Engineering", publishedDate: "2026-01-05", author: "EduPath India", image: "assets/images/og-image.svg", featured: true, keywords: ["engineering admission", "B.Tech admission", "CSE admission"] },
  { id: "mba-2026", title: "MBA Admission Guide 2026", slug: "mba-admission-guide-2026", summary: "Understand MBA specialisations, college comparison questions, and responsible admission planning for management aspirants.", category: "MBA", publishedDate: "2026-01-08", author: "EduPath India", image: "assets/images/og-image.svg", featured: true, keywords: ["MBA admission", "MBA counselling", "management admission"] },
  { id: "odisha-2026", title: "Odisha College Admission Guide 2026", slug: "odisha-admission-guide-2026", summary: "Explore Odisha admission planning across Bhubaneswar, Cuttack, Rourkela, Sambalpur, and Berhampur.", category: "Odisha", publishedDate: "2026-01-10", author: "EduPath India", image: "assets/images/og-image.svg", featured: true, keywords: ["Admission Odisha", "college admission Odisha", "Bhubaneswar college admission"] }
];

async function getNews() {
  if (window.location.protocol === "file:") return fallbackNews;
  try {
    const response = await fetch("data/news.json");
    if (!response.ok) throw new Error("news");
    return await response.json();
  } catch (error) {
    return fallbackNews;
  }
}

function newsCard(news) {
  return `<article class="news-card"><img src="${news.image}" width="640" height="360" loading="lazy" alt="${news.title} EduPath India admission guide"><p class="eyebrow">${news.category} · ${new Date(news.publishedDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p><h3>${news.title}</h3><p>${news.summary}</p><a href="news/${news.slug}.html">Read guide</a></article>`;
}

(async () => {
  const news = await getNews();
  const home = document.querySelector("#home-news");
  if (home) home.innerHTML = news.slice(0, 3).map(newsCard).join("");

  const list = document.querySelector("#news-list");
  const featured = document.querySelector("#featured-news");
  const search = document.querySelector("#news-search");
  const buttons = document.querySelectorAll("[data-category]");
  let category = "All";

  function render() {
    if (!list) return;
    const query = (search?.value || "").toLowerCase();
    const filtered = news.filter(item => (category === "All" || item.category === category) && JSON.stringify(item).toLowerCase().includes(query));
    if (featured) {
      const item = news.find(entry => entry.featured) || news[0];
      featured.innerHTML = `<div class="feature-card"><p class="eyebrow">Featured</p><h2>${item.title}</h2><p>${item.summary}</p><a class="btn btn--gold" href="news/${item.slug}.html">Read Featured Guide</a></div>`;
    }
    list.innerHTML = filtered.map(newsCard).join("") || "<p>No admission updates match this search.</p>";
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      category = button.dataset.category;
      render();
    });
  });
  search?.addEventListener("input", render);
  render();
})();
