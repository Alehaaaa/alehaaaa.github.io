
function mute_video() {
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
  
  function fullscreen_video() {
    var i = document.getElementById("video-volume");
    var elem = document.getElementById("playing-video");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
      elem.muted = false;
      i.className = "fas fa-volume-up";
}


ham_open = () => {
    const hamburger = document.querySelector("#hamburger")
    const navbar = document.querySelector("#navbar");

    hamburger.classList.toggle('fa-bars');
    hamburger.classList.toggle('fa-times');
    navbar.classList.toggle('nav-toggle');

}