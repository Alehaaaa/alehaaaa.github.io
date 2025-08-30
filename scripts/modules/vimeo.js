// Vimeo + Magnific Popup integration

export function initVimeo() {
  // Setup magnific popup on Vimeo links
  if (typeof $ !== 'undefined') {
    $(function () {
      $(".popup-vimeo").magnificPopup({
        disableOn: 700,
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        callbacks: {
          beforeOpen: () => vimeoPlayer.pause(),
          afterClose: () => vimeoPlayer.play(),
        },
      });
    });
  }

  // Vimeo player and pause/play on intersection
  const vimeoPlayer = new Vimeo.Player("playing-video");
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? vimeoPlayer.play() : vimeoPlayer.pause())),
    { threshold: 0.5 }
  );
  observer.observe(document.getElementById("playing-video"));
}

