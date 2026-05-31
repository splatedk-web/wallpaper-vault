const wallpapers = [
  {
    src: "https://starwalk.space/gallery/images/what-is-space/1140x641.jpg",
    alt: "Космос Десктоп",
    category: "Desktop",
    tag: "space",
  },
  {
    src: "https://scientificrussia.ru/images/i/31qi-full.jpg",
    alt: "Космос Десктоп 2",
    category: "Desktop",
    tag: "space",
  },
  {
    src: "https://scientificrussia.ru/images/y/335y-full.jpg",
    alt: "Космос Мобильные",
    category: "Phone",
    tag: "space",
  },
  {
    src: "https://cdn2.relax-fm.ru/proxy/vardata/modules/news/files/1/2426/news_file_2426_660fe10523a8b.jpg?w=1020&h=680&pos=center&q=100&t=1712316677",
    alt: "Природа Десктоп",
    category: "Desktop",
    tag: "nature",
  },
];

const themeBtn = document.getElementById("themeBtn");
const pageBody = document.querySelector(".page");
const filterBtns = document.querySelectorAll(".nav-filters__btn");
const tagSelect = document.getElementById("tagSelect");
const gallery = document.getElementById("gallery");

let currentCategory = "Desktop";
let currentTag = "space";

themeBtn.addEventListener("click", () => {
  pageBody.classList.toggle("light-theme");
});

function renderGallery() {
  gallery.innerHTML = "";

  const filtered = wallpapers.filter((item) => {
    return item.category === currentCategory && item.tag === currentTag;
  });

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
            <img class="card__img" src="${item.src}" alt="${item.alt}">
            <div class="card__actions">
                <button class="card__btn card__btn--view">Смотреть</button>
                <button class="card__btn card__btn--download">⬇</button>
            </div>
        `;

    gallery.appendChild(card);
  });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".nav-filters__btn--active")
      .classList.remove("nav-filters__btn--active");
    btn.classList.add("nav-filters__btn--active");

    currentCategory = btn.getAttribute("data-category");
    renderGallery();
  });
});

tagSelect.addEventListener("change", (e) => {
  currentTag = e.target.value;
  renderGallery();
});

renderGallery();
