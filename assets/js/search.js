const fallbackCourses = [
  { title: "B.Tech Computer Science", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "CSE admission guidance for students comparing private engineering colleges and technology-focused careers." },
  { title: "B.Tech Artificial Intelligence & Machine Learning", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "Explore AI and Machine Learning engineering pathways with responsible admission counselling." },
  { title: "B.Tech Data Science", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "Understand data-focused engineering programs and compare course fit." },
  { title: "B.Tech Cyber Security", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "Review cyber security engineering admission options and branch expectations." },
  { title: "B.Tech Mechanical Engineering", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "Guidance for mechanical engineering admission and college selection." },
  { title: "B.Tech Civil Engineering", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "Explore civil engineering admission pathways and application steps." },
  { title: "B.Tech Electrical Engineering", category: "Engineering", location: "India", url: "engineering-admission.html", summary: "Compare electrical engineering admission options and course scope." },
  { title: "MBA", category: "Management", location: "India", url: "mba-admission.html", summary: "MBA admission counselling for Finance, Marketing, HR, Operations, and Business Analytics." },
  { title: "BBA", category: "Management", location: "India", url: "courses.html#bba", summary: "Undergraduate management admission guidance for students after 12th." },
  { title: "BCA", category: "Computer Applications", location: "India", url: "courses.html#bca", summary: "Computer applications admission support for software-oriented students." },
  { title: "MCA", category: "Computer Applications", location: "India", url: "courses.html#mca", summary: "Postgraduate computer applications guidance for MCA aspirants." }
];

const fallbackColleges = [
  { name: "Engineering colleges in Bhubaneswar", type: "Engineering", city: "Bhubaneswar", url: "admission-odisha.html", summary: "Compare engineering college options in Bhubaneswar and verify details with institutions." },
  { name: "MBA colleges in Bhubaneswar", type: "Management", city: "Bhubaneswar", url: "admission-odisha.html", summary: "Explore private MBA college options in Bhubaneswar with admission counselling support." },
  { name: "Private colleges in Odisha", type: "Multiple courses", city: "Odisha", url: "admission-odisha.html", summary: "Shortlist private colleges in Odisha across engineering, management, and computer applications." },
  { name: "Engineering colleges India", type: "Engineering", city: "India", url: "engineering-admission.html", summary: "Understand engineering college admission choices across India." }
];

async function getJson(path, fallback) {
  if (window.location.protocol === "file:") return fallback;
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(path);
    return await response.json();
  } catch (error) {
    return fallback;
  }
}

function card(item) {
  return `<article class="result-item"><h3>${item.title || item.name}</h3><p>${item.summary}</p><a href="${item.url}">View details</a></article>`;
}

(async () => {
  const courses = await getJson("data/courses.json", fallbackCourses);
  const colleges = await getJson("data/colleges.json", fallbackColleges);
  const all = [...courses, ...colleges];
  const home = document.querySelector("#home-courses");
  const list = document.querySelector("#course-list");
  const collegeList = document.querySelector("#college-list");
  if (home) home.innerHTML = courses.slice(0, 8).map(card).join("");
  if (list) list.innerHTML = courses.map(card).join("");
  if (collegeList) collegeList.innerHTML = colleges.map(card).join("");

  const input = document.querySelector("#global-search");
  const results = document.querySelector("#search-results");
  if (input && results) {
    const render = queryText => {
      const query = queryText.trim().toLowerCase();
      if (!query) {
        results.innerHTML = "";
        return;
      }
      const found = all.filter(item => JSON.stringify(item).toLowerCase().includes(query)).slice(0, 8);
      results.innerHTML = found.length ? found.map(card).join("") : "<p>No matching static result found. Contact EduPath India for guidance.</p>";
    };
    input.addEventListener("input", event => render(event.target.value));
    document.querySelectorAll(".suggestions button").forEach(button => {
      button.addEventListener("click", () => {
        input.value = button.textContent;
        render(input.value);
        input.focus();
      });
    });
  }
})();
