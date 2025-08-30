// LightGallery integration

const defaultImages = [
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

export function initGallery({ images = defaultImages } = {}) {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  container.innerHTML = "";

  images.forEach((name) => {
    const a = document.createElement("a");
    a.href = `src/gallery/${name}`;
    a.className = "gallery-item";
    a.setAttribute("data-lg-size", "1400-933");

    const img = document.createElement("img");
    img.src = `src/gallery/${name}`;
    img.loading = "lazy";
    img.alt = name;
    img.className = "img";
    a.appendChild(img);

    container.appendChild(a);
  });

  // Initialize LightGallery if available globally
  if (typeof window.lightGallery === 'function') {
    window.lightGallery(container, {
      selector: 'a',
      speed: 300,
      licenseKey: '0000-0000-000-0000',
      plugins: [window.lgZoom, window.lgThumbnail].filter(Boolean),
      download: false,
      thumbnail: true,
      zoom: true,
      zoomFromOrigin: false, // disable opening zoom animation
      mode: 'lg-fade', // subtle fade between images, no zoom-in
      getCaptionFromTitleOrAlt: false,
    });
  }
}
