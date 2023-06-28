i = document.getElementById("video-volume");
elem = document.getElementById("playing-video");
hamburger = document.getElementById("hamburger");
navbar = document.getElementById("navbar-list");

function mute_video() {
    if (i.src.endsWith("images/mute.svg")) {
        i.src = "images/volume.svg";
        elem.muted = false;
    } else {
        i.src = "images/mute.svg";
        elem.muted = true;
    }
}

function fullscreen_video() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
    elem.muted = false;
    i.src = "images/volume.svg";
}

document.addEventListener("click", function (event) {
    if (
        !navbar.classList.contains("nav-toggle") &&
        !event.target.isEqualNode(navbar) &&
        !navbar.contains(event.target)
    ) {
        hamburger.classList.toggle("is-active");
        navbar.classList.toggle("nav-toggle");
    } else if (event.target.isEqualNode(hamburger)) {
        hamburger.classList.toggle("is-active");
        navbar.classList.toggle("nav-toggle");
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

$(function () {
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
        const img = $(".img");

        if (!target.is(img) && !target.is(next) && !target.is(prev)) {
            $("body").removeClass("view-open");
        }
    });

    if (!$("body").hasClass("view-open")) {
        $(document).keydown(function (e) {
            if (e.keyCode === 37) {prevImage();
            } else if (e.keyCode === 39) {nextImage();
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
        const totalItems = $(".img-panel").length;

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
