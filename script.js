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

ham_open = () => {
    const hamburger = document.querySelector("#ham_icon");
    const navbar = document.querySelector("#navbar");

    if (hamburger.src.endsWith("images/hamburger.svg")) {
        hamburger.src = "images/close.svg";
    } else {
        hamburger.src = "images/hamburger.svg";
    }
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