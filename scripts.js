i = document.getElementById("video-volume");
video = document.getElementById("playing-video");

// ... (your existing code)


// Initialization function
function init() {
    // Call any initializations or setups here
    setWebsiteLanguage(); // Call the function to set the website language
}

// ... (rest of your code)

// Translation Buttons
let langs; // Declare the variable to hold the imported JSON data

document.addEventListener("DOMContentLoaded", function () {
    fetch("./langs.json")
        .then((response) => response.json())
        .then((data) => {
            langs = data; // Assign the imported JSON data to the variable
            init(); // Call the initialization function
        })
        .catch((error) => console.error("Error loading langs.json:", error));
});


const locales = ["en-GB", "es-ES", "ca-ES", "fr-FR", "it-IT"];
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContent = document.getElementById("dropdown-content");
let isDropdownOpen = false;

function getFlagCode(locale) {
    if (locale.region === "ES" && locale.language === "ca") {
        return "es-ct";
    } else {
        return locale.region.toLowerCase();
    }
}

const switchLanguage = (code) => {
    const selectedLanguage = langs[code];
    if (selectedLanguage) {
        for (let key of Object.keys(selectedLanguage)) {
            const element = document.getElementById(key);
            if (element) {
                element.innerHTML = selectedLanguage[key];
            }
        }
    }
};

function setSelectedLocale(locale) {
    const intlLocale = new Intl.Locale(locale);

    const langName = new Intl.DisplayNames([locale], {
        type: "language",
    }).of(intlLocale.language);
    const formattedLangName =
        langName.charAt(0).toUpperCase() + langName.slice(1);

    dropdownContent.innerHTML = "";

    const otherLocales = locales.filter((loc) => loc !== locale);
    otherLocales.forEach((otherLocale) => {
        const otherIntlLocale = new Intl.Locale(otherLocale);

        const otherLangName = new Intl.DisplayNames([otherLocale], {
            type: "language",
        }).of(otherIntlLocale.language);
        const formattedOtherLangName =
            otherLangName.charAt(0).toUpperCase() + otherLangName.slice(1);

        const listEl = document.createElement("li");
        listEl.innerHTML = `${formattedOtherLangName}<span class="fi fi-${getFlagCode(
            otherIntlLocale
        )}"></span>`;
        listEl.value = otherLocale;
        listEl.addEventListener("mousedown", function () {
            setSelectedLocale(otherLocale);
        });
        dropdownContent.appendChild(listEl);
    });

    dropdownBtn.innerHTML = `<span class="fi fi-${getFlagCode(
        intlLocale
    )}"></span>${formattedLangName}<span class="arrow-down">`;
    closeDropdown();
    switchLanguage(locale);
}

// Function to set website language based on device language
function setWebsiteLanguage() {
    const browserLang = new Intl.Locale(navigator.language).language;
    console.log(browserLang)
    for (const locale of locales) {
        const localeLang = new Intl.Locale(locale).language;
        if (localeLang === browserLang) {
            setSelectedLocale(locale);
            break; // Stop searching if a matching language is found
        }
    }
}

function toggleDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    isDropdownOpen = !isDropdownOpen;
    dropdownContent.style.display = isDropdownOpen ? "block" : "none";
}

function closeDropdown() {
    if (isDropdownOpen) {
        isDropdownOpen = false;
        dropdownContent.style.display = "none";
    }
}

document.addEventListener("click", (event) => {
    if (isDropdownOpen) {
        closeDropdown();
    }
});

dropdownBtn.addEventListener("click", (event) => {
    toggleDropdown(event);
});

try {
    setSelectedLocale(locales[0]);
} catch (ex) {}
const browserLang = new Intl.Locale(navigator.language).language;
for (const locale of locales) {
    const localeLang = new Intl.Locale(locale).language;
    if (localeLang === browserLang) {
        try {
            setSelectedLocale(locale);
        } catch (ex) {}
    }
}

// Nav Bar

function togglemenu() {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar-list");
    hamburger.classList.toggle("is-active");
    navbar.classList.toggle("nav-toggle");
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Video Scripts

$(function() {
    var videoMute = null; // Store the video element reference
    
    $('.popup-vimeo').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        callbacks: {
            beforeOpen: function () {
                videoMute = video.muted;
                video.pause();
                video.muted = true;
            },
            afterClose: function () {
                video.play();
                video.muted = videoMute
            }
        }
    });
});


function fullscreen_video() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        /* Safari */
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        /* IE11 */
        video.msRequestFullscreen();
    }
    video.muted = false;
    i.src = "src/volume.svg";
}

function mute_video() {
    if (i.src.endsWith("src/mute.svg")) {
        i.src = "src/volume.svg";
        video.muted = false;
    } else {
        i.src = "src/mute.svg";
        video.muted = true;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    observer.observe(video);
});


// Gallery Scripts

const imageNames = [
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
imageNames.forEach((imageName) => {
    const imgPanelDiv = document.createElement("div");
    imgPanelDiv.className = "img-panel";

    const imgElement = document.createElement("img");
    imgElement.className = "img";
    imgElement.loading = "lazy";
    imgElement.src = `gallery/${imageName}`;
    imgElement.alt = "";

    imgPanelDiv.appendChild(imgElement);
    galleryContainer.appendChild(imgPanelDiv);
});

$(window).on('load', function () {

    const thumbnail = $(".img-panel");
    const container = $(".viewer-body");
    const margin = $(".thumb-viewer");
    const next = $(".next");
    const prev = $(".prev");

    thumbnail.click(function () {
        const imageUrl = $(this).find("img").attr("src");
        thumbnail.removeClass("open");
        $(this).addClass("open");
        $("body").addClass("view-open");
        container.html(`<img src="${imageUrl}">`);
    });

    next.click(nextImage);

    prev.click(prevImage);

    margin.click(function (event) {
        const target = $(event.target);
        if (!target.is($("img")) && !target.is(next) && !target.is(prev)) {
            $("body").removeClass("view-open");
        }
    });

    if (!$("body").hasClass("view-open")) {
        $(document).keydown(function (e) {
            if (e.keyCode === 27) {
                $("body").removeClass("view-open");
            } else if (e.keyCode === 37 || e.keyCode === 40) {
                prevImage();
            } else if (e.keyCode === 39 || e.keyCode === 38) {
                nextImage();
            }
        });
    }

    function nextImage() {
        const currentIndex = $(".open").index();
        const totalItems = $(".img-panel").length;

        if (currentIndex === totalItems - 1) {
            $(".open").removeClass("open");
            $(".img-panel:first-child").addClass("open");
        } else {
            $(".open").removeClass("open").next().addClass("open");
        }

        const imageUrl = $(".open").find("img").attr("src");
        container.html(`<img src="${imageUrl}">`);
    }

    function prevImage() {
        const currentIndex = $(".open").index();

        if (currentIndex === 0) {
            $(".open").removeClass("open");
            $(".img-panel:last-child").addClass("open");
        } else {
            $(".open").removeClass("open").prev().addClass("open");
        }

        const imageUrl = $(".open").find("img").attr("src");
        container.html(`<img src="${imageUrl}">`);
    }
});
