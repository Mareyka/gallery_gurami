document.addEventListener("DOMContentLoaded", function () {

  //  Списки регистрации (день / месяц / год) 

  const daysInput = document.querySelector('input[placeholder="День"]');
  const monthsInput = document.querySelector('input[placeholder="Месяц"]');
  const yearsInput = document.querySelector('input[placeholder="Год"]');
  const daysList = document.getElementById("days");
  const monthsList = document.getElementById("months");
  const yearsList = document.getElementById("years");

  if (daysInput && daysList) {
    for (let i = 1; i <= 31; i++) {
      const div = document.createElement("div");
      div.textContent = i;
      div.addEventListener("click", () => { daysInput.value = i; daysList.style.display = "none"; });
      daysList.appendChild(div);
    }
    daysInput.addEventListener("click", () => {
      daysList.style.display = daysList.style.display === "block" ? "none" : "block";
    });
  }

  if (monthsInput && monthsList) {
    ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"].forEach(month => {
        const div = document.createElement("div");
        div.textContent = month;
        div.addEventListener("click", () => { monthsInput.value = month; monthsList.style.display = "none"; });
        monthsList.appendChild(div);
      });
    monthsInput.addEventListener("click", () => {
      monthsList.style.display = monthsList.style.display === "block" ? "none" : "block";
    });
  }

  if (yearsInput && yearsList) {
    for (let y = 2026; y >= 1970; y--) {
      const div = document.createElement("div");
      div.textContent = y;
      div.addEventListener("click", () => { yearsInput.value = y; yearsList.style.display = "none"; });
      yearsList.appendChild(div);
    }
    yearsInput.addEventListener("click", () => {
      yearsList.style.display = yearsList.style.display === "block" ? "none" : "block";
    });
  }

  //  Дропдаун сортировки в профиле 

  const sortInput = document.getElementById("sortInput");
  const sortList = document.getElementById("sortList");

  if (sortInput && sortList) {
    ["Автору", "Цене", "Дате"].forEach(option => {
      const item = document.createElement("div");
      item.textContent = option;
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        sortInput.value = option;
        sortList.classList.remove("open");
      });
      sortList.appendChild(item);
    });
    sortInput.addEventListener("click", (e) => {
      e.stopPropagation();
      sortList.classList.toggle("open");
    });
  }

  //  Закрываем все дропдауны при клике вне 

  document.addEventListener("click", (e) => {
    if (daysInput && daysList && !daysInput.contains(e.target) && !daysList.contains(e.target)) daysList.style.display = "none";
    if (monthsInput && monthsList && !monthsInput.contains(e.target) && !monthsList.contains(e.target)) monthsList.style.display = "none";
    if (yearsInput && yearsList && !yearsInput.contains(e.target) && !yearsList.contains(e.target)) yearsList.style.display = "none";
    if (sortInput && sortList && !sortInput.contains(e.target) && !sortList.contains(e.target)) sortList.classList.remove("open");
  });

  //  Бургер-меню 

  const header = document.querySelector("header");
  if (!header) return;

  // 1. Overlay
  const overlay = document.createElement("div");
  overlay.className = "side-menu-overlay";
  document.body.appendChild(overlay);

  // 2. Боковое меню
  const sideMenu = document.createElement("nav");
  sideMenu.className = "side-menu";

  const allLinks = [...header.querySelectorAll(".header_element")];
  const exitLink = allLinks.find(l => l.textContent.trim() === "Выход");

  // Контейнер верхних ссылок
  const topLinks = document.createElement("div");
  topLinks.style.cssText = "flex: 1;";

  // Контейнер нижних ссылок
  const bottomLinks = document.createElement("div");
  bottomLinks.style.cssText = `
    padding: 10px 0;
    margin-top: 10px;
  `;

  // Слова которые идут вниз
  const bottomTexts = new Set(["Вход", "Регистрация", "Вход / Регистрация", "Профиль"]);

  // Все ссылки — сортируем, без дублей
  const seen = new Set();
  allLinks.forEach(link => {
    if (link === exitLink) return;
    const text = link.textContent.trim();
    if (seen.has(text)) return;
    seen.add(text);
    const clone = link.cloneNode(true);
    clone.className = "side-menu-link";
    if (bottomTexts.has(text)) {
      clone.style.background = "transparent";
      clone.querySelectorAll("*").forEach(el => el.style.background = "transparent");
      bottomLinks.appendChild(clone);
    } else {
      topLinks.appendChild(clone);
    }
  });

  // Профиль — вниз (только если ещё не добавлен через header_element)
  const accountImg = header.querySelector("a img.header_account");
  if (accountImg && !seen.has("Профиль")) {
    const accountHref = accountImg.closest("a").getAttribute("href") || "";
    if (!accountHref.includes("getin")) {
      const profileLink = document.createElement("a");
      profileLink.className = "side-menu-link side-menu-profile";
      profileLink.href = accountHref;
      profileLink.textContent = "Профиль";
      bottomLinks.appendChild(profileLink);
    }
  }

  // Выход — вниз
  if (exitLink) {
    const exitClone = exitLink.cloneNode(true);
    exitClone.className = "side-menu-link";
    exitClone.style.background = "transparent";
    exitClone.querySelectorAll("*").forEach(el => el.style.background = "transparent");
    bottomLinks.appendChild(exitClone);
  }

  sideMenu.appendChild(topLinks);
  sideMenu.appendChild(bottomLinks);

  // Тема — верхний левый угол бокового меню
  const themeImg = header.querySelector('a img[src*="sun.svg"], a img[src*="moon.svg"]');
  if (themeImg) {
    const themeLink = document.createElement("a");
    themeLink.href = themeImg.closest("a").getAttribute("href") || "#";
    const img = document.createElement("img");
    img.src = themeImg.getAttribute("src");
    img.style.cssText = "width: 24px; height: 24px;";
    themeLink.appendChild(img);
    themeLink.style.cssText = "position: absolute; top: 24px; left: 28px;";
    sideMenu.appendChild(themeLink);
  }


  // Показывать нижний блок только если есть ссылки
  if (bottomLinks.children.length > 0) {
    bottomLinks.style.cssText += `
      background: rgba(86,88,246,0.07);
      border-top: 1px solid rgba(86,88,246,0.25);
      margin-left: -28px;
      margin-right: -28px;
      margin-bottom: -40px;
      padding-left: 28px;
      padding-right: 28px;
      padding-top: 10px;
      padding-bottom: 70px;
    `;
  }

  document.body.appendChild(sideMenu);

  // 3. Кнопка бургера
  const burgerBtn = document.createElement("button");
  burgerBtn.className = "burger-btn";
  burgerBtn.setAttribute("aria-label", "Открыть меню");
  burgerBtn.innerHTML = "<span></span><span></span><span></span>";
  header.appendChild(burgerBtn);

  // 4. Логика открытия/закрытия

  function openMenu() {
    const headerHeight = header.offsetHeight;
    sideMenu.style.top = headerHeight + "px";
    sideMenu.style.height = "calc(100vh - " + headerHeight + "px)";
    sideMenu.classList.add("open");
    overlay.classList.add("open");
    overlay.style.top = headerHeight + "px";
    document.body.style.overflow = "hidden";
    burgerBtn.classList.add("active");
    // шапка принимает цвет меню
    header.style.backdropFilter = "none";
    header.style.webkitBackdropFilter = "none";
    header.style.transition = "background 0.32s ease";
    const isDark = document.querySelector('a img[src*="sun.svg"]');
    header.style.background = isDark ? "rgba(17,17,17,1)" : "rgba(239,234,211,1)";
  }

  function closeMenu() {
    sideMenu.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    burgerBtn.classList.remove("active");
    // шапка возвращается к полупрозрачной
    header.style.background = "";
    header.style.backdropFilter = "";
    header.style.webkitBackdropFilter = "";
  }

  burgerBtn.addEventListener("click", () => {
    sideMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  sideMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

});


//  Таймер аукциона 

const auctionTimerEl = document.getElementById("auction_timer");
if (auctionTimerEl) {
  const auctionDate = new Date("2026-03-08T23:00:00");

  function addZero(n) { return n < 10 ? "0" + n : n; }

  function updateTimer() {
    const diff = auctionDate - new Date();
    if (diff <= 0) { auctionTimerEl.textContent = "00:00:00:00"; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    auctionTimerEl.textContent = `${addZero(d)}:${addZero(h)}:${addZero(m)}:${addZero(s)}`;
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}


//  Слайдер 

const slider = document.getElementById("slider_image");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

if (slider && next && prev) {
  const images = [
    "../photo/auction_peace_1.avif",
    "../photo/peace_1_detail_1.avif",
    "../photo/peace_1 _detail_2.avif"
  ];
  let current = 0;

  let updateDots = function () { };

  next.onclick = () => { current = (current + 1) % images.length; slider.src = images[current]; updateDots(); };
  prev.onclick = () => { current = (current - 1 + images.length) % images.length; slider.src = images[current]; updateDots(); };

  //  Точки и свайп
  const photoSlider = document.querySelector('.photo_slider');
  if (photoSlider) {

    const dotsContainer = document.createElement('div');
    dotsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
    `;

    const dots = [];
    for (let i = 0; i < images.length; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 8px; height: 8px;
        border-radius: 50%;
        background: #EFEAD3;
        transition: background 0.2s;
        cursor: pointer;
      `;
      dot.addEventListener('click', () => {
        current = i;
        slider.src = images[current];
        updateDots();
      });
      dots.push(dot);
      dotsContainer.appendChild(dot);
    }

    dotsContainer.style.position = 'absolute';
    dotsContainer.style.bottom = '40px';
    dotsContainer.style.left = '0';
    dotsContainer.style.right = '0';
    dotsContainer.style.marginTop = '0';
    dotsContainer.style.background = 'none';
    photoSlider.style.position = 'relative';
    photoSlider.appendChild(dotsContainer);

    updateDots = function () {
      dots.forEach((d, i) => {
        d.style.background = i === current ? '#3a3a3a7a' : '#EFEAD3';
      });
    };

    updateDots();

    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) next.click();
        else prev.click();
      }
    }, { passive: true });
  }
}


//  Модальное окно 

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");

if (modal && openBtn && closeBtn) {
  openBtn.addEventListener("click", () => { modal.style.display = "flex"; modal.classList.add("show"); });
  closeBtn.addEventListener("click", () => { modal.style.display = "none"; modal.classList.remove("show"); });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) { modal.style.display = "none"; modal.classList.remove("show"); }
  });
}


//  Профиль — переключение табов 

function openTab(tabNumber) {
  document.querySelectorAll(".content_block").forEach(tab => tab.classList.remove("active"));
  document.getElementById("tab" + tabNumber).classList.add("active");
}

// шапка
const headerEl = document.querySelector("header");
if (headerEl) {
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) {
      headerEl.style.transform = "translateY(-100%)";
    } else {
      headerEl.style.transform = "translateY(0)";
    }
    lastScroll = current;
  });
}

// Лайтбокс для фотографии проекта
const projectPhoto = document.querySelector('.project_photo');
if (projectPhoto) {
  const targetImg = window.innerWidth <= 768
    ? projectPhoto.querySelector('img:nth-child(1)')
    : projectPhoto.querySelector('img:nth-child(2)');

  if (targetImg) {
    targetImg.style.cursor = 'zoom-in';

    targetImg.addEventListener('click', () => {
      const lb = document.createElement('div');
      lb.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.92);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: zoom-out;
      `;

      const img = document.createElement('img');
      img.src = targetImg.src;
      img.style.cssText = `
        max-width: 95vw;
        max-height: 95vh;
        object-fit: contain;
        border-radius: 8px;
        touch-action: pinch-zoom;
      `;

      lb.appendChild(img);
      document.body.appendChild(lb);
      document.body.style.overflow = 'hidden';

      lb.addEventListener('click', () => {
        lb.remove();
        document.body.style.overflow = '';
      });
    });
  }
}

// Лайтбокс для слайдера на странице аукциона
const sliderLink = document.getElementById("slider_link");
const sliderImage = document.getElementById("slider_image");
if (sliderLink && sliderImage) {
  sliderLink.style.cursor = 'zoom-in';

  sliderLink.addEventListener('click', (e) => {
    e.preventDefault();
    const lb = document.createElement('div');
    lb.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: zoom-out;
    `;

    const img = document.createElement('img');
    img.src = sliderImage.src;
    img.style.cssText = `
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      border-radius: 8px;
      touch-action: pinch-zoom;
    `;

    lb.appendChild(img);
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    lb.addEventListener('click', () => {
      lb.remove();
      document.body.style.overflow = '';
    });
  });
}

// Массив фотографий для .block_photo_biography
const bioImages = [
  "../photo/person1.jpg",
  "../photo/person2.png",
  "../photo/person3.png"
];

// Находим все элементы block_photo_biography
const blockPhotoBiography = [...document.querySelectorAll('.block_photo_biography')];

if (bioImages.length > 0) {

  function openBiographyLightbox(startIndex) {
    let current = startIndex;

    const lb = document.createElement('div');
    lb.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 2000;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: zoom-out;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
      touch-action: pinch-zoom;
    `;

    // Стрелки
    const prev = document.createElement('img');
    prev.src = '../photo/arrow_left_light.svg';
    prev.style.cssText = `
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      cursor: pointer;
      z-index: 10;
      background: none;
    `;
    const next = document.createElement('img');
    next.src = '../photo/arrow_right_light.svg';
    next.style.cssText = `
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      cursor: pointer;
      z-index: 10;
      background: none;
    `;

    // Точки
    const dotsContainer = document.createElement('div');
    dotsContainer.style.cssText = `
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 8px;
    `;
    const dots = [];
    bioImages.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        cursor: pointer;
        transition: 0.2s;
      `;
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        current = i;
        updateLightbox();
      });
      dots.push(dot);
      dotsContainer.appendChild(dot);
    });

    function updateLightbox() {
      img.src = bioImages[current];
      dots.forEach((d, i) => {
        d.style.background = i === current ? '#fff' : 'rgba(255,255,255,0.4)';
      });
    }

    prev.addEventListener('click', (e) => {
      e.stopPropagation();
      current = (current - 1 + bioImages.length) % bioImages.length;
      updateLightbox();
    });
    next.addEventListener('click', (e) => {
      e.stopPropagation();
      current = (current + 1) % bioImages.length;
      updateLightbox();
    });

    let touchStartX = 0;
    lb.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        current = diff > 0 
          ? (current + 1) % bioImages.length 
          : (current - 1 + bioImages.length) % bioImages.length;
        updateLightbox();
      }
    }, { passive: true });

    lb.addEventListener('click', () => { lb.remove(); document.body.style.overflow = ''; });
    img.addEventListener('click', (e) => e.stopPropagation());

    lb.appendChild(img);
    lb.appendChild(prev);
    lb.appendChild(next);
    lb.appendChild(dotsContainer);
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    updateLightbox();
  }

  blockPhotoBiography.forEach((img, index) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openBiographyLightbox(index));
  });
}