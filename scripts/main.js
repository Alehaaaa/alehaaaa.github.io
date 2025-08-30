// ES module entry point: orchestrates modules
import { renderProjects, attachSliderInteractions } from './modules/slider.js';
import { initVimeo } from './modules/vimeo.js';
import { initNavigation } from './modules/navigation.js';
import { initGallery } from './modules/gallery.js';
import { initI18n } from './modules/i18n.js';

const sliderContainer = document.getElementById('slider-container');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');

Promise.all([
  fetch('scripts/langs.json').then((r) => r.json()),
  fetch('scripts/projects.json').then((r) => r.json()),
])
  .then(([langData, projectData]) => {
    renderProjects(projectData, sliderContainer);
    attachSliderInteractions(sliderContainer);
    initGallery();
    initVimeo();
    initNavigation();
    initI18n(langData, {
      dropdownBtn,
      dropdownContent,
      observeRoot: sliderContainer,
    });
  })
  .catch((err) => console.error('Initial load error:', err));

