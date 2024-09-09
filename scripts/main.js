
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



const sliderContainer = document.getElementById("slider-container");

function renderProjects(projectsData) {
    // Obtenemos el div #slider
    const slider = document.createElement('div');
    slider.id = "slider";

    // Recorremos cada proyecto en el JSON
    projectsData.projects.forEach(project => {
        // Creamos un div para el proyecto
        const projectDiv = document.createElement('div');
        projectDiv.className = "project";
        projectDiv.setAttribute('onclick', 'toggleSelection(this)');
        projectDiv.style.setProperty('--gradient-1', project.gradient1);
        projectDiv.style.setProperty('--gradient-2', project.gradient2);

        // Poster del proyecto
        const projectPoster = document.createElement('img');
        projectPoster.className = "project_poster";
        projectPoster.src = project.poster;
        projectPoster.alt = `Poster of '${project.title}'`;
        projectPoster.draggable = false;
        projectDiv.appendChild(projectPoster);

        // Información del proyecto
        const projectInfo = document.createElement('div');
        projectInfo.className = "project_info";

        // Año del proyecto
        const year = document.createElement('h4');
        year.textContent = project.year;
        projectInfo.appendChild(year);

        // Título del proyecto (Feature Film o Short Film)
        const titleDiv = document.createElement('div');
        const title = document.createElement('h5');
        title.setAttribute('data-translation-id', project.type);
        const titleSub = document.createElement('h6');
        titleSub.textContent = project.title;
        titleSub.setAttribute('data-translation-id', project.title);
        titleDiv.appendChild(title);
        titleDiv.appendChild(titleSub);
        projectInfo.appendChild(titleDiv);

        // Rol en el proyecto
        const roleDiv = document.createElement('div');
        const roleTitle = document.createElement('h5');
        roleTitle.setAttribute('data-translation-id', project.roleTitle);
        const role = document.createElement('h6');
        role.setAttribute('data-translation-id', project.role);
        roleDiv.appendChild(roleTitle);
        roleDiv.appendChild(role);
        projectInfo.appendChild(roleDiv);

        // Compañía
        const companyDiv = document.createElement('div');
        const companyTitle = document.createElement('h5');
        companyTitle.textContent = "Company";
        companyTitle.setAttribute('data-translation-id', 'project_comp');
        const companyLink = document.createElement('a');
        companyLink.href = project.companyLink;
        companyLink.target = "_blank";
        companyLink.className = "company_link";
        const companyImg = document.createElement('img');
        companyImg.src = project.companyLogo;
        companyImg.alt = "Company Logo";
        companyLink.appendChild(companyImg);
        companyDiv.appendChild(companyTitle);
        companyDiv.appendChild(companyLink);
        projectInfo.appendChild(companyDiv);

        // Enlace para el tráiler o demo
        const mediaDiv = document.createElement('div');
        const mediaTitle = document.createElement('h5');
        mediaTitle.textContent = project.mediaType === 1 ? "Play Trailer" : "Play Demo";
        mediaTitle.setAttribute('data-translation-id', project.mediaType === 1 ? "project_trailer_play" : "project_demo_play");
        const mediaLink = document.createElement('a');
        mediaLink.href = project.mediaLink;
        mediaLink.className = "company_play popup-vimeo";
        const playIcon = document.createElement('i');
        playIcon.className = "fa fa-play fa-lg";
        mediaLink.appendChild(playIcon);
        mediaDiv.appendChild(mediaTitle);
        mediaDiv.appendChild(mediaLink);
        projectInfo.appendChild(mediaDiv);

        // Añadir la información del proyecto al div del proyecto
        projectDiv.appendChild(projectInfo);

        // Añadir el div del proyecto al slider
        slider.appendChild(projectDiv);
    });

    // Finalmente, añadimos el slider al contenedor
    sliderContainer.appendChild(slider);
}






let isDragged = false;
let oneActive = false;

// Delegación de eventos para gestionar los clics en los proyectos
sliderContainer.addEventListener('click', (event) => {
    const target = event.target.closest('.project');
    
    if (!target) {
        // Si se hace clic fuera de un proyecto, deselecciona todos
        removeSelected();
    } else {
        // Si el proyecto fue arrastrado, no hacemos la selección
        if (!isDragged) {
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            toggleSelection(target);
        }
    }
});

function removeSelected() {
    const projects = sliderContainer.querySelectorAll('.project');
    projects.forEach((project) => {
        project.classList.remove('active');
        project.classList.remove('darken');
    });
}

function toggleSelection(clickedProject) {
    const projects = sliderContainer.querySelectorAll('.project');

    if (isDragged) return;

    if (oneActive) {
        projects.forEach((project) => {
            if (project !== clickedProject) {
                project.classList.add('darken');
                project.classList.remove('active');
            } else {
                project.classList.add('active');
                project.classList.remove('darken');
            }
        });
    } else {
        projects.forEach((project) => {
            if (project !== clickedProject) {
                project.classList.add('darken');
                project.classList.remove('active');
            } else {
                project.classList.add('active');
                project.classList.remove('darken');
                oneActive = true;
            }
        });
    }
}

// Manejo del arrastre en el sliderContainer
let startX;
let scrollLeft;
let isDown = false;

sliderContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragged = false;
    startX = e.pageX - sliderContainer.offsetLeft;
    scrollLeft = sliderContainer.scrollLeft;
});

sliderContainer.addEventListener('mouseleave', () => {
    isDown = false;
    isDragged = false;
});

sliderContainer.addEventListener('mouseup', () => {
    isDown = false;
});

sliderContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderContainer.offsetLeft;
    const walk = (x - startX);
    sliderContainer.scrollLeft = scrollLeft - walk;
    isDragged = true;
});






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
    const clickedInsideSlider = slider.contains(event.target);
    
    if (!clickedInsideSlider && oneActive) {
        removeSelected();
    }
});

dropdownBtn.addEventListener("click", (event) => {
    toggleDropdown(event);
});

try {
    setSelectedLocale(locales[0]);
} catch (ex) { }
const browserLang = new Intl.Locale(navigator.language).language;
for (const locale of locales) {
    const localeLang = new Intl.Locale(locale).language;
    if (localeLang === browserLang) {
        try {
            setSelectedLocale(locale);
        } catch (ex) { }
    }
}

// Nav Bar

function togglemenu() {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar-list");
    hamburger.classList.toggle("ham-active");
    navbar.classList.toggle("nav-active");
}

// Selecciona todos los enlaces de la barra de navegación que apuntan a secciones de la página (enlaces de ancla)
document.querySelectorAll('[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        // Obtener la sección a la que apunta el href
        const targetSection = document.querySelector(this.getAttribute("href"));

        if (targetSection) {
            // Obtener la altura del header
            const headerHeight = document.querySelector('header').offsetHeight;

            // Calcular la posición de la sección menos la altura del header
            const sectionPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            // Hacer scroll a la posición con la corrección de padding top
            window.scrollTo({
                top: sectionPosition,
                behavior: 'smooth'
            });
        }
    });
});


// Video Scripts

$(function () {
    $('.popup-vimeo').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        callbacks: {
            beforeOpen: function () {
                vimeoPlayer.setMuted(true);
                vimeoPlayer.pause();
            },
            afterClose: function () {
                vimeoPlayer.play();
            }
        }
    });
});

// Iniciar el reproductor de Vimeo
const vimeoPlayer = new Vimeo.Player('playing-video');

// Crear un IntersectionObserver para detectar cuándo el video está en la vista
const vimeoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Si el video está en la vista, reproducirlo
            vimeoPlayer.play();
        } else {
            // Si el video no está en la vista, detenerlo
            vimeoPlayer.pause();
        }
    });
}, {
    threshold: 0.5 // Se activa cuando el 50% del video está en la vista
});

// Seleccionar el iframe del video
const videoIframe = document.querySelector('#playing-video');

// Observar el iframe del video
vimeoObserver.observe(videoIframe);


// Gallery Scripts

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




// MutationObserver para observar cuando se agregan nuevos elementos al sliderContainer
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-translation-id')) {
                // Aplicar la traducción inmediatamente a los nuevos elementos
                applyTranslationToElement(node);
            }
        });
    });
});

// Configurar el observer para observar cambios en el sliderContainer
observer.observe(sliderContainer, { childList: true, subtree: true });


const switchLanguage = (code) => {
    const selectedLanguage = langs[code];
    if (selectedLanguage) {
        document.querySelectorAll('[data-translation-id]').forEach((element) => {
            applyTranslationToElement(element, selectedLanguage);
        });
    }
};

function applyTranslationToElement(element, selectedLanguage) {
    const translationId = element.getAttribute('data-translation-id');
    const translatedText = selectedLanguage[translationId];

    if (translatedText) {
        if (!element.hasAttribute('href') || element.innerText) {
            element.innerHTML = translatedText;
        } else {
            element.setAttribute('href', translatedText);
        }
    }
}


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
    for (const locale of locales) {
        const localeLang = new Intl.Locale(locale).language;
        if (localeLang === browserLang) {
            setSelectedLocale(locale);
            break; // Stop searching if a matching language is found
        }
    }
}

// Translation Buttons
let langs; // Declare the variable to hold the imported JSON data

fetch("scripts/langs.json")
    .then((response) => response.json())
    .then((data) => {
        langs = data; // Assign the imported JSON data to the variable
        
        fetch('scripts/projects.json')
            .then(response => response.json())
            .then(data => {
                renderProjects(data);
                setWebsiteLanguage();
            })
            .catch(error => console.error('Error loading projects:', error));
    })
    .catch((error) => console.error("Error loading langs.json:", error));



