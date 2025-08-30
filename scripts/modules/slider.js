// Slider module: renders projects and attaches interactions

export function renderProjects(projectsData, container) {
  const slider = document.createElement("div");
  slider.id = "slider";
  const disablePopUpOnValue = 700;
  let projectCount = 1;

  projectsData.projects
    .slice()
    .reverse()
    .forEach((project) => {
      if (project.enabled === false) return;

      const projectDiv = document.createElement("div");
      projectDiv.className = "project";
      projectDiv.style.setProperty("--gradient-1", project.gradient1);
      projectDiv.style.setProperty("--gradient-2", project.gradient2);

      projectDiv.addEventListener("click", () => toggleSelection(projectDiv, container));

      const projectPoster = document.createElement("img");
      if (project.poster && project.poster.includes("/studies/")) {
        projectPoster.setAttribute("data-translation-id", `project_poster_${projectCount++}`);
      }
      projectPoster.className = "project_poster";
      projectPoster.src = project.poster;
      projectPoster.alt = `Poster of '${project.title}'`;
      projectPoster.draggable = false;
      projectDiv.appendChild(projectPoster);

      const projectInfo = document.createElement("div");
      projectInfo.className = "project_info";

      const year = document.createElement("h4");
      year.textContent = Array.isArray(project.year) ? project.year.join(" – ") : project.year;
      projectInfo.appendChild(year);

      const titleDiv = document.createElement("div");
      const title = document.createElement("h5");
      title.setAttribute("data-translation-id", project.type);
      const titleSub = document.createElement("h6");
      titleSub.textContent = project.title;
      titleSub.setAttribute("data-translation-id", project.title);
      titleDiv.append(title, titleSub);
      projectInfo.appendChild(titleDiv);

      const roleDiv = document.createElement("div");
      const roleTitle = document.createElement("h5");
      roleTitle.setAttribute("data-translation-id", project.roleTitle);
      const role = document.createElement("h6");
      role.setAttribute("data-translation-id", project.role);
      roleDiv.append(roleTitle, role);
      projectInfo.appendChild(roleDiv);

      const companyDiv = document.createElement("div");
      const companyTitle = document.createElement("h5");
      companyTitle.textContent = "Company";
      companyTitle.setAttribute("data-translation-id", "project_comp");
      const companyLink = document.createElement("a");
      companyLink.href = project.companyLink;
      companyLink.target = "_blank";
      companyLink.className = "company_link";
      const companyImg = document.createElement("img");
      companyImg.src = project.companyLogo;
      companyImg.alt = "Company Logo";
      companyLink.appendChild(companyImg);
      companyDiv.append(companyTitle, companyLink);
      projectInfo.appendChild(companyDiv);

      const mediaDiv = document.createElement("div");
      const mediaTitle = document.createElement("h5");
      const isTrailer = project.mediaType === 1;
      mediaTitle.setAttribute("data-translation-id", isTrailer ? "project_play_trailer" : "project_play_demo");
      mediaTitle.textContent = isTrailer ? "Play Trailer" : "Play Demo";

      const mediaLink = document.createElement("a");
      mediaLink.className = "company_play popup-vimeo";
      if (project.mediaLink) {
        mediaLink.href = project.mediaLink;
      } else {
        mediaLink.classList.add("disabled");
      }
      const playIcon = document.createElement("i");
      playIcon.className = "fa fa-play fa-lg";
      mediaLink.appendChild(playIcon);
      mediaDiv.append(mediaTitle, mediaLink);
      projectInfo.appendChild(mediaDiv);

      projectDiv.appendChild(projectInfo);
      slider.prepend(projectDiv);
    });

  container.appendChild(slider);
}

// Internal state for drag/click selection
let isDown = false;
let startX;
let scrollLeft;
const dragThreshold = 40;
let isDragged = false;

export function attachSliderInteractions(container) {
  container.addEventListener("mousedown", (e) => {
    isDown = true;
    isDragged = false;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    isDragged = false;
  });

  container.addEventListener("mouseup", (event) => {
    const dragDistance = Math.abs((event.pageX - container.offsetLeft) - startX);
    isDown = false;
    if (dragDistance < dragThreshold) {
      const target = event.target.closest(".project");
      if (!target) {
        removeSelected(container);
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        toggleSelection(target, container);
      }
    }
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    container.scrollLeft = scrollLeft - walk;
    isDragged = Math.abs(walk) > dragThreshold;
  });

  document.addEventListener("click", (event) => {
    const sliderEl = document.getElementById("slider");
    if (sliderEl && !sliderEl.contains(event.target)) removeSelected(container);
  });
}

function removeSelected(container) {
  container.querySelectorAll(".project").forEach((p) => p.classList.remove("active", "darken"));
}

function toggleSelection(clickedProject, container) {
  if (isDragged) return;
  container.querySelectorAll(".project").forEach((project) => {
    const isTarget = project === clickedProject;
    project.classList.toggle("active", isTarget);
    project.classList.toggle("darken", !isTarget);
  });
}

