var i = document.getElementById("video-volume");
var elem = document.getElementById("playing-video");

function mute_video() {
    if (i.className == "fas fa-volume-mute") {
        i.className = "fas fa-volume-up";
        elem.muted = false;
    } else {
        i.className = "fas fa-volume-mute";
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
    i.className = "fas fa-volume-up";
}

ham_open = () => {
    const hamburger = document.querySelector("#hamburger");
    const navbar = document.querySelector("#navbar");

    hamburger.classList.toggle("fa-bars");
    hamburger.classList.toggle("fa-times");
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