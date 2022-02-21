const API_KEY = "25755107-c5ecbaee54c3d5c87c2809c98";
const BASE_URL = "https://pixabay.com/api/";

const params = new URLSearchParams({
  image_type: "photo",
  orientation: "horizontal",
});

const input = document.querySelector("input");
const list = document.querySelector(".list");

input.addEventListener("input", _.debounce(getImages));

let page = 0;

function fetchImages(word) {
  return fetch(`${BASE_URL}?key=${API_KEY}&q=${word}&${params}&page=${page}`).then((response) => {
    console.log(response);
    if (!response.ok) {
      return new Error(response.message);
    }
    return response.json();
  });
}
// .then((response) => response.json())

function getImages() {
  const searchQuery = input.value.trim();

  if (searchQuery === "") {
    list.innerHTML = "";
    return;
  }
  page += 1;
  fetchImages(searchQuery).then((data) => {
    renderList(data.hits);
  });
}

function renderList(array) {
  const markup = array
    .map(({ webformatURL, largeImageURL, tags }) => {
      return `
    <li>
          <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" data-source="${largeImageURL}">
          </a>
    </li>
    `;
    })
    .join("");
  list.insertAdjacentHTML("beforeend", markup);
  loadMore();
}

function loadMore() {
  const obServer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          getImages();
        }
      });
    },
    { threshold: 0.5 }
  );
  obServer.observe(document.querySelector("li:last-child"));
}
