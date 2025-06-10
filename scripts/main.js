// -----------------------------
// Multi-language portfolio site
// main.js  (updated with caching + href fix)
// -----------------------------

// -----------------------------------------------------------------------------
// 0 · Constants & helpers
// -----------------------------------------------------------------------------
const locales = ["en-GB", "es-ES", "ca-ES", "fr-FR", "it-IT"];
const CACHE_KEY = "preferredLocale";

const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContent = document.getElementById("dropdown-content");
let isDropdownOpen = false;

const loadCachedLocale = () =>
  locales.includes(localStorage.getItem(CACHE_KEY))
    ? localStorage.getItem(CACHE_KEY)
    : null;
const saveCachedLocale = (loc) => localStorage.setItem(CACHE_KEY, loc);

function getFlagCode(locale) {
  return locale.language === "ca" && locale.region === "ES"
    ? "es-ct"
    : locale.region.toLowerCase();
}

// -----------------------------------------------------------------------------
// 1 · Projects slider ----------------------------------------------------------
// -----------------------------------------------------------------------------
const sliderContainer = document.getElementById("slider-container");

function renderProjects(projectsData) {
  const slider = document.createElement("div");
  slider.id = "slider";
  const disablePopUpOnValue = 700;
  let projectCount = 1;

  projectsData.projects
    .slice() // clone array to avoid mutating original
    .reverse()
    .forEach((project) => {
      if (project.disabled){
        return;
      }
      const projectDiv = document.createElement("div");
      projectDiv.className = "project";
      projectDiv.style.setProperty("--gradient-1", project.gradient1);
      projectDiv.style.setProperty("--gradient-2", project.gradient2);

      // click handler (instead of inline onclick)
      projectDiv.addEventListener("click", () => toggleSelection(projectDiv));

      // Poster
      const projectPoster = document.createElement("img");
      if (project.poster && project.poster.includes("/studies/")) {
        projectPoster.setAttribute(
          "data-translation-id",
          `project_poster_${projectCount++}`
        );
      }
      projectPoster.className = "project_poster";
      projectPoster.src = project.poster;
      projectPoster.alt = `Poster of '${project.title}'`;
      projectPoster.draggable = false;
      projectDiv.appendChild(projectPoster);

      // Info wrapper
      const projectInfo = document.createElement("div");
      projectInfo.className = "project_info";

      // Year
      const year = document.createElement("h4");
      year.textContent = Array.isArray(project.year)
        ? project.year.join(" – ")
        : project.year;
      projectInfo.appendChild(year);

      // Title & subtitle
      const titleDiv = document.createElement("div");
      const title = document.createElement("h5");
      title.setAttribute("data-translation-id", project.type);
      const titleSub = document.createElement("h6");
      titleSub.textContent = project.title;
      titleSub.setAttribute("data-translation-id", project.title);
      titleDiv.append(title, titleSub);
      projectInfo.appendChild(titleDiv);

      // Role
      const roleDiv = document.createElement("div");
      const roleTitle = document.createElement("h5");
      roleTitle.setAttribute("data-translation-id", project.roleTitle);
      const role = document.createElement("h6");
      role.setAttribute("data-translation-id", project.role);
      roleDiv.append(roleTitle, role);
      projectInfo.appendChild(roleDiv);

      // Company
      const companyDiv = document.createElement("div");
      const companyTitle = document.createElement("h5");
      companyTitle.textContent = "Company";
      companyTitle.setAttribute("data-translation-id", "project_comp");
      const companyLink = document.createElement("a");
      companyLink.href = project.companyLink;
      companyLink.target = "_blank";
      companyLink.className = "company_link";
      const companyImg = document.createElement("img");
      companyImg.src = project.companyLogo;
      companyImg.alt = "Company Logo";
      companyLink.appendChild(companyImg);
      companyDiv.append(companyTitle, companyLink);
      projectInfo.appendChild(companyDiv);

      // Media (trailer / demo)
      const mediaDiv = document.createElement("div");
      const mediaTitle = document.createElement("h5");
      const isTrailer = project.mediaType === 1;
      mediaTitle.setAttribute(
        "data-translation-id",
        isTrailer ? "project_play_trailer" : "project_play_demo"
      );
      mediaTitle.textContent = isTrailer ? "Play Trailer" : "Play Demo";

      const mediaLink = document.createElement("a");
      mediaLink.className = "company_play popup-vimeo";
      if (project.mediaLink) {
        mediaLink.href = project.mediaLink;
        mediaLink.addEventListener("click", function (event) {
          if (window.innerWidth <= disablePopUpOnValue) return;
          event.preventDefault();
          $(this)
            .magnificPopup({
              type: "iframe",
              disableOn: disablePopUpOnValue,
              mainClass: "mfp-fade",
              removalDelay: 160,
              preloader: false,
              fixedContentPos: false,
            })
            .magnificPopup("open");
        });
      } else {
        mediaLink.classList.add("disabled");
      }
      const playIcon = document.createElement("i");
      playIcon.className = "fa fa-play fa-lg";
      mediaLink.appendChild(playIcon);
      mediaDiv.append(mediaTitle, mediaLink);
      projectInfo.appendChild(mediaDiv);

      projectDiv.appendChild(projectInfo);
      slider.prepend(projectDiv);
    });

  sliderContainer.appendChild(slider);
}

// -----------------------------------------------------------------------------
// 2 · Slider interactions  -----------------------------------------------------
// -----------------------------------------------------------------------------
let oneActive = false;
let isDown = false;
let startX;
let scrollLeft;
const dragThreshold = 40;
let isDragged = false;
let dragDistance = 0;

sliderContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  isDragged = false;
  startX = e.pageX - sliderContainer.offsetLeft;
  scrollLeft = sliderContainer.scrollLeft;
  dragDistance = 0;
});

sliderContainer.addEventListener("mouseleave", () => {
  isDown = false;
  isDragged = false;
});

sliderContainer.addEventListener("mouseup", (event) => {
  isDown = false;
  if (dragDistance < dragThreshold) {
    const target = event.target.closest(".project");
    if (!target) {
      removeSelected();
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      toggleSelection(target);
    }
  }
});

sliderContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - sliderContainer.offsetLeft;
  const walk = x - startX;
  sliderContainer.scrollLeft = scrollLeft - walk;
  dragDistance = Math.abs(walk);
  if (dragDistance > dragThreshold) isDragged = true;
});

function removeSelected() {
  sliderContainer.querySelectorAll(".project").forEach((p) => {
    p.classList.remove("active", "darken");
  });
}

function toggleSelection(clickedProject) {
  if (isDragged) return;
  sliderContainer.querySelectorAll(".project").forEach((project) => {
    const isTarget = project === clickedProject;
    project.classList.toggle("active", isTarget);
    project.classList.toggle("darken", !isTarget);
  });
  oneActive = true;
}

// -----------------------------------------------------------------------------
// 3 · Vimeo pop‑up & intersection observer ------------------------------------
// -----------------------------------------------------------------------------
$(function () {
  $(".popup-vimeo").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
    callbacks: {
      beforeOpen: () => vimeoPlayer.pause(),
      afterClose: () => vimeoPlayer.play(),
    },
  });
});

const vimeoPlayer = new Vimeo.Player("playing-video");
new IntersectionObserver(
  (entries) => entries.forEach((e) => (e.isIntersecting ? vimeoPlayer.play() : vimeoPlayer.pause())),
  { threshold: 0.5 }
).observe(document.getElementById("playing-video"));

// -----------------------------------------------------------------------------
// 4 · Dropdown language selector ----------------------------------------------
// -----------------------------------------------------------------------------
function toggleDropdown(e) {
  if (e) e.stopPropagation();
  isDropdownOpen = !isDropdownOpen;
  dropdownContent.style.display = isDropdownOpen ? "block" : "none";
}
function closeDropdown() {
  if (isDropdownOpen) toggleDropdown();
}

document.addEventListener("click", (event) => {
  if (isDropdownOpen) closeDropdown();
  const sliderEl = document.getElementById("slider");
  if (sliderEl && !sliderEl.contains(event.target) && oneActive) removeSelected();
});

dropdownBtn.addEventListener("click", toggleDropdown);

// -----------------------------------------------------------------------------
// 5 · Navigation and smooth-scroll --------------------------------------------
// -----------------------------------------------------------------------------
function togglemenu() {
  document.getElementById("hamburger").classList.toggle("ham-active");
  document.getElementById("navbar-list").classList.toggle("nav-active");
}

document.querySelectorAll('[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetSection = document.querySelector(this.getAttribute("href"));
    if (!targetSection) return;

    const headerHeight = document.querySelector("header")?.offsetHeight || 0;
    const sectionHeight = targetSection.offsetHeight;
    const viewport = window.innerHeight;

    const sectionPos =
      sectionHeight < viewport
        ? targetSection.getBoundingClientRect().top + window.pageYOffset - (viewport / 2 - sectionHeight / 2)
        : targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

    window.scrollTo({ top: sectionPos, behavior: "smooth" });
  });
});

// -----------------------------------------------------------------------------
// 6 · Gallery ------------------------------------------------------------------
// -----------------------------------------------------------------------------
const imageNames = [
  "mega_robo_poster.jpg",
  "00_happyness.jpg",
  "01_disgust.jpg",
  "02_pain.jpg",
  "03_surprise.jpg",
  "08_samurai.jpg",
  "05_pose1.jpg",
  "06_pose3.jpg",
  "07_dance.jpg",
  "07_angry.jpg",
  "08_objeto_01.jpg",
  "09_relajado_02.jpg",
];

const galleryContainer = document.getElementById("gallery-container");
imageNames.forEach((name) => {
  const panel = document.createElement("div");
  panel.className = "img-panel";
  const img = document.createElement("img");
  img.className = "img";
  img.loading = "lazy";
  img.src = `src/gallery/${name}`;
  panel.appendChild(img);
  galleryContainer.appendChild(panel);
});

$(window).on("load", () => {
  const $thumbs = $(".img-panel");
  const $viewer = $(".viewer-body");
  const $wrapper = $(".thumb-viewer");
  const $next = $(".next");
  const $prev = $(".prev");

  const openThumb = ($el) => {
    $thumbs.removeClass("open");
    $el.addClass("open");
    $("body").addClass("view-open");
    $viewer.html(`<img src="${$el.find("img").attr("src")}">`);
  };

  $thumbs.on("click", (e) => openThumb($(e.currentTarget)));
  $next.on("click", () => navigateThumb(1));
  $prev.on("click", () => navigateThumb(-1));

  $wrapper.on("click", (e) => {
    if (!$(e.target).is("img, .next, .prev")) $("body").removeClass("view-open");
  });

  $(document).on("keydown", (e) => {
    if (!$("body").hasClass("view-open") || e.repeat) return;
    if (e.key === "Escape") $("body").removeClass("view-open");
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) navigateThumb(-1);
    if (["ArrowRight", "ArrowUp"].includes(e.key)) navigateThumb(1);
  });

  function navigateThumb(dir) {
    const $open = $(".open");
    if (!$open.length) return;
    const $siblings = $thumbs;
    const idx = $open.index();
    const nextIdx = (idx + dir + $siblings.length) % $siblings.length;
    openThumb($siblings.eq(nextIdx));
  }
});

// -----------------------------------------------------------------------------
// 7 · i18n helpers -------------------------------------------------------------
// -----------------------------------------------------------------------------
let langs; // holds the translation JSON

function switchLanguage(code) {
  const dict = langs[code];
  if (!dict) return;
  document.querySelectorAll("[data-translation-id]").forEach((el) => applyTranslationToElement(el, dict));
}

// i18n helper – writes text and, only for real URLs, rewrites href/src
function applyTranslationToElement(el, dict) {
  const key  = el.getAttribute('data-translation-id');
  const text = dict[key];
  if (!text) return;

  // treat the value as a URL only if …
  const keyImpliesUrl = /_(link|poster|src)$/.test(key);      // …the key name ends with _link/_poster/_src
  const valueLooksUrl = /^https?:\/\//.test(text) || text.startsWith('src/'); // …or the value is clearly a path

  if ((keyImpliesUrl || valueLooksUrl) && (el.hasAttribute('href') || el.hasAttribute('src'))) {
    if (el.hasAttribute('href')) {
      el.setAttribute('href', text);
    } else {
      el.setAttribute('src', text);
    }
  } else {
    // plain text / inner HTML
    el.innerHTML = text;
  }
}


function setSelectedLocale(locale, fromUser = true) {
  const intlLocale = new Intl.Locale(locale);
  const langName = new Intl.DisplayNames([locale], { type: "language" }).of(intlLocale.language);
  const formattedName = langName.charAt(0).toUpperCase() + langName.slice(1);

  // rebuild dropdown list
  dropdownContent.innerHTML = "";
  locales.filter((l) => l !== locale).forEach((otherLocale) => {
    const loc = new Intl.Locale(otherLocale);
    const otherName = new Intl.DisplayNames([otherLocale], { type: "language" }).of(loc.language);
    const li = document.createElement("li");
    li.innerHTML = `${otherName.charAt(0).toUpperCase() + otherName.slice(1)}<span class="fi fi-${getFlagCode(loc)}"></span>`;
    li.addEventListener("mousedown", () => setSelectedLocale(otherLocale, true));
    dropdownContent.appendChild(li);
  });

  dropdownBtn.innerHTML = `<span class="fi fi-${getFlagCode(intlLocale)}"></span>${formattedName}<span class="arrow-down">`;
  closeDropdown();
  switchLanguage(locale);
  if (fromUser) saveCachedLocale(locale);
}

function chooseInitialLocale() {
  const cached = loadCachedLocale();
  if (cached) return setSelectedLocale(cached, false);

  const browserLang = new Intl.Locale(navigator.language).language;
  const match = locales.find((loc) => new Intl.Locale(loc).language === browserLang);
  setSelectedLocale(match || locales[0], false);
}

// MutationObserver: translate late-added nodes (projects slider) --------------
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    m.addedNodes.forEach((n) => {
      if (n.nodeType === 1 && n.hasAttribute("data-translation-id")) {
        const currentLocale = dropdownBtn.textContent.trim();
        const localeKey = locales.find((l) => currentLocale.includes(new Intl.DisplayNames([l], { type: "language" }).of(new Intl.Locale(l).language)));
        if (localeKey) applyTranslationToElement(n, langs[localeKey]);
      }
    });
  });
});
observer.observe(sliderContainer, { childList: true, subtree: true });

// -----------------------------------------------------------------------------
// 8 · Load JSON and boot -------------------------------------------------------
// -----------------------------------------------------------------------------
Promise.all([
  fetch("scripts/langs.json").then((r) => r.json()),
  fetch("scripts/projects.json").then((r) => r.json()),
]).then(([langData, projectData]) => {
  langs = langData;
  renderProjects(projectData);
  chooseInitialLocale();
}).catch((err) => console.error("Initial load error:", err));
