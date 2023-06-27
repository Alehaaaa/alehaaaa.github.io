var i = document.getElementById("video-volume");
var elem = document.getElementById("playing-video");

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

function ham_open() {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");

    hamburger.classList.toggle("is-active");
    navbar.classList.toggle("nav-toggle");
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});