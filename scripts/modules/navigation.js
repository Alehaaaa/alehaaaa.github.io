// Navigation and smooth scroll

export function initNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navbarList = document.getElementById("navbar-list");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("ham-active");
      navbarList.classList.toggle("nav-active");
    });
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
}

