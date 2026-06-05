const themeBtn = document.getElementById("themeBtn");
const pageBody = document.querySelector(".page");
const filterBtns = document.querySelectorAll(".nav-filters__btn");
const tagSelect = document.getElementById("tagSelect");
const gallery = document.getElementById("gallery");

let currentCategory = "Desktop";
let currentTag = "space";
let currentWallpaper = null;

const previewModal = document.getElementById("previewModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalFavBtn = document.getElementById("modalFavBtn");
const modalDownloadBtn = document.getElementById("modalDownloadBtn");
const modalFullscreenBtn = document.getElementById("modalFullscreenBtn");
const modalLinksContainer = document.getElementById("modalLinksContainer");

const onFavorites = window.location.pathname.includes("favorites.html");

let favorites = JSON.parse(localStorage.getItem("wallpapers_favs")) || [];

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  pageBody.classList.add("light-theme");
  const icon = themeBtn.querySelector("i");
  if (icon) icon.className = "fa-solid fa-sun";
}

themeBtn.addEventListener("click", () => {
  pageBody.classList.toggle("light-theme");
  const icon = themeBtn.querySelector("i");

  if (pageBody.classList.contains("light-theme")) {
    if (icon) icon.className = "fa-solid fa-sun";
    localStorage.setItem("theme", "light");
  } else {
    if (icon) icon.className = "fa-solid fa-moon";
    localStorage.setItem("theme", "dark");
  }
});

function renderGallery() {
  if (!gallery) return;
  gallery.innerHTML = "";

  let items = [];

  if (onFavorites) {
    items = favorites;
    if (items.length === 0) {
      gallery.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.6; padding: 40px 0;">У вас пока нет избранных обоев.</p>`;
      return;
    }
  } else {
    items = window.wallpapersData.filter((item) => {
      if (
        item.category === "iOS (tendies)" ||
        item.category === "Wallpaper Engine"
      ) {
        return item.category === currentCategory;
      }
      return item.category === currentCategory && item.tag === currentTag;
    });
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
            <img class="card__img" src="${item.src}" loading="lazy" decoding="async" alt="${item.alt}">
            <div class="card__actions">
                <button class="card__btn card__btn--view">Посмотреть</button>
                <button class="card__btn card__btn--download" title="Скачать">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
        `;

    const viewBtn = card.querySelector(".card__btn--view");
    const downloadBtn = card.querySelector(".card__btn--download");

    const fullSizeSrc = getFullSizeUrl(item.src);

    viewBtn.addEventListener("click", () => {
      openModal(item, fullSizeSrc);
    });

    downloadBtn.addEventListener("click", () => {
      downloadImage(fullSizeSrc, item.alt || "wallpaper");
    });

    gallery.appendChild(card);
  });
}

function openModal(item, fullSizeSrc) {
  currentWallpaper = item;
  modalImg.src = fullSizeSrc;
  modalTitle.textContent = item.alt;

  const isFav = favorites.some((fav) => fav.src === item.src);
  if (isFav) {
    modalFavBtn.classList.add("active");
    modalFavBtn.innerHTML = `<i class="fa-solid fa-heart"></i> В избранном`;
  } else {
    modalFavBtn.classList.remove("active");
    modalFavBtn.innerHTML = `<i class="fa-regular fa-heart"></i> В избранное`;
  }

  modalDownloadBtn.onclick = () => {
    downloadImage(fullSizeSrc, item.alt || "wallpaper");
  };

  modalLinksContainer.innerHTML = "";

  if (currentCategory === "Desktop") {
    modalLinksContainer.innerHTML = `
      <a href="instructions-win.html" class="header__link"><i class="fa-brands fa-windows"></i> Инструкция для Windows</a>
      <a href="instructions-lin.html" class="header__link"><i class="fa-brands fa-linux"></i> Инструкция для Linux</a>
    `;
  } else if (currentCategory === "Phone") {
    modalLinksContainer.innerHTML = `
      <a href="instructions-phone.html" class="header__link"><i class="fa-solid fa-mobile-screen-button"></i> Инструкция для Android/iOS</a>
    `;
  } else if (currentCategory === "iOS (tendies)") {
    modalLinksContainer.innerHTML = `
      <a href="instructions-ios.html" class="header__link"><i class="fa-brands fa-apple"></i> Перейти к инструкции iOS</a>
    `;
  } else if (currentCategory === "Wallpaper Engine") {
    modalLinksContainer.innerHTML = `
      <a href="instructions-we.html" class="header__link"><i class="fa-solid fa-wand-magic-sparkles"></i> Инструкция Wallpaper Engine</a>
    `;
  }

  previewModal.classList.add("modal--open");
}

modalFavBtn.addEventListener("click", () => {
  if (!currentWallpaper) return;

  const index = favorites.findIndex((fav) => fav.src === currentWallpaper.src);

  if (index > -1) {
    favorites.splice(index, 1);
    modalFavBtn.classList.remove("active");
    modalFavBtn.innerHTML = `<i class="fa-regular fa-heart"></i> В избранное`;
  } else {
    favorites.push(currentWallpaper);
    modalFavBtn.classList.add("active");
    modalFavBtn.innerHTML = `<i class="fa-solid fa-heart"></i> В избранном`;
  }

  localStorage.setItem("wallpapers_favs", JSON.stringify(favorites));

  if (onFavorites) {
    renderGallery();
    if (index > -1) {
      previewModal.classList.remove("modal--open");
    }
  }
});

// весь экран
modalFullscreenBtn.addEventListener("click", () => {
  if (modalImg.requestFullscreen) {
    modalImg.requestFullscreen();
  } else if (modalImg.webkitRequestFullscreen) {
    // для Safari
    modalImg.webkitRequestFullscreen();
  }
});

// выход
modalImg.addEventListener("click", () => {
  if (modalImg.classList.contains("modal__img--fullscreen")) {
    modalImg.classList.remove("modal__img--fullscreen");
  }
});

modalCloseBtn.addEventListener("click", () => {
  previewModal.classList.remove("modal--open");
  modalImg.classList.remove("modal__img--fullscreen");
});

previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) {
    previewModal.classList.remove("modal--open");
    modalImg.classList.remove("modal__img--fullscreen");
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("nav-filters__btn--active"));
    btn.classList.add("nav-filters__btn--active");

    currentCategory = btn.getAttribute("data-category");

    if (currentCategory === "Phone" || currentCategory === "iOS (tendies)") {
      gallery.classList.add("gallery--phone");
    } else {
      gallery.classList.remove("gallery--phone");
    }

    const tagsBlock = document.querySelector(".tags");
    if (tagsBlock) {
      if (
        currentCategory === "iOS (tendies)" ||
        currentCategory === "Wallpaper Engine"
      ) {
        tagsBlock.classList.add("hidden");
      } else {
        tagsBlock.classList.remove("hidden");
      }
    }

    renderGallery();
  });
});

if (tagSelect) {
  tagSelect.addEventListener("change", (e) => {
    currentTag = e.target.value;
    renderGallery();
  });
}

renderGallery();

function getFullSizeUrl(url) {
  if (url.includes("raw.githubusercontent.com")) {
    return url.replace("/cards_min_size/", "/").replace("/cards/", "/");
  }
  return url;
}

function downloadImage(url, filename) {
  const btn = event ? event.currentTarget : null;
  if (btn) {
    btn.style.opacity = "0.5";
    btn.disabled = true;
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Сетевая ошибка при скачивании");
      return response.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      const fileExtension = url.split(".").pop().split("?")[0] || "jpg";
      link.download = `${filename}.${fileExtension}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((err) => {
      console.error("Ошибка скачивания файла:", err);
      window.open(url, "_blank");
    })
    .finally(() => {
      if (btn) {
        btn.style.opacity = "";
        btn.disabled = false;
      }
    });
}
