
function change() {
    var i = document.getElementById("video-volume");
    var v = document.getElementById("playing-video");
    if (i.className == "fas fa-volume-mute") {
        i.className = "fas fa-volume-up";
        v.muted = false;
    } else {
        i.className = "fas fa-volume-mute";
        v.muted = true;
    }
}


clicked = () => {
    const hamburger = document.querySelector("#hamburger")
    const navbar = document.querySelector("#navbar");

    hamburger.classList.toggle('fa-bars');
    hamburger.classList.toggle('fa-times');
    navbar.classList.toggle('nav-toggle');

}