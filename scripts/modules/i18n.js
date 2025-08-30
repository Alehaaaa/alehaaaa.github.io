// i18n + language dropdown

const DEFAULT_LOCALES = ["en-GB", "es-ES", "ca-ES", "fr-FR", "it-IT"];
const CACHE_KEY = "preferredLocale";

const loadCachedLocale = () =>
  DEFAULT_LOCALES.includes(localStorage.getItem(CACHE_KEY)) ? localStorage.getItem(CACHE_KEY) : null;
const saveCachedLocale = (loc) => localStorage.setItem(CACHE_KEY, loc);

function getFlagCode(locale) {
  return locale.language === "ca" && locale.region === "ES" ? "es-ct" : locale.region.toLowerCase();
}

export function initI18n(langsData, { dropdownBtn, dropdownContent, locales = DEFAULT_LOCALES, observeRoot } = {}) {
  const langs = langsData;
  if (!dropdownBtn || !dropdownContent) return;

  function applyTranslationToElement(el, dict) {
    const key = el.getAttribute('data-translation-id');
    const text = dict[key];
    if (!text) return;

    const keyImpliesUrl = /_(link|poster|src)$/.test(key);
    const valueLooksUrl = /^https?:\/\//.test(text) || text.startsWith('src/');

    if ((keyImpliesUrl || valueLooksUrl) && (el.hasAttribute('href') || el.hasAttribute('src'))) {
      if (el.hasAttribute('href')) {
        el.setAttribute('href', text);
      } else {
        el.setAttribute('src', text);
      }
    } else {
      el.innerHTML = text;
    }
  }

  function switchLanguage(code) {
    const dict = langs[code];
    if (!dict) return;
    document.querySelectorAll('[data-translation-id]').forEach((el) => applyTranslationToElement(el, dict));
  }

  function setSelectedLocale(locale, fromUser = true) {
    const intlLocale = new Intl.Locale(locale);
    const langName = new Intl.DisplayNames([locale], { type: "language" }).of(intlLocale.language);
    const formattedName = langName.charAt(0).toUpperCase() + langName.slice(1);

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
    dropdownContent.style.display = "none";
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

  // Dropdown interactions
  let isDropdownOpen = false;
  function toggleDropdown(e) {
    if (e) e.stopPropagation();
    isDropdownOpen = !isDropdownOpen;
    dropdownContent.style.display = isDropdownOpen ? "block" : "none";
  }
  function closeDropdown() {
    if (isDropdownOpen) toggleDropdown();
  }

  dropdownBtn.addEventListener("click", toggleDropdown);
  document.addEventListener("click", () => {
    if (isDropdownOpen) closeDropdown();
  });

  // Observe late-added nodes under observeRoot
  if (observeRoot) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1 && n.hasAttribute && n.hasAttribute("data-translation-id")) {
            // best-effort: use current dropdown label to detect current locale
            const currentLabel = dropdownBtn.textContent.trim();
            const localeKey = locales.find((l) => currentLabel.includes(new Intl.DisplayNames([l], { type: "language" }).of(new Intl.Locale(l).language)));
            if (localeKey) applyTranslationToElement(n, langs[localeKey]);
          }
        });
      });
    });
    observer.observe(observeRoot, { childList: true, subtree: true });
  }

  chooseInitialLocale();
}

