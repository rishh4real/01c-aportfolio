const revealTargets = document.querySelectorAll("[data-reveal]");
const introBrand = document.querySelector(".intro-brand");
const introNav = document.querySelector(".intro-nav");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealTargets.forEach((target, index) => {
    target.style.transitionDelay = `${Math.min(index * 0.06, 0.32)}s`;
    revealObserver.observe(target);
  });
}

if (introBrand) {
  introBrand.addEventListener("click", () => {
    introBrand.classList.remove("is-popped");
    window.requestAnimationFrame(() => {
      introBrand.classList.add("is-popped");
      window.setTimeout(() => {
        introBrand.classList.remove("is-popped");
      }, 220);
    });
  });
}

if (introNav && mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = introNav.classList.toggle("is-open");
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  introNav.querySelectorAll(".intro-nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      introNav.classList.remove("is-open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const projectPreviewItems = Array.from(
  document.querySelectorAll(".archive-grid figure, .featured-project-card")
).filter((item) => !item.classList.contains("poster-lightbox-target") && !item.closest(".device-frame__screen"));

if (projectPreviewItems.length) {
  const preview = document.createElement("div");
  preview.className = "project-preview";
  preview.setAttribute("role", "dialog");
  preview.setAttribute("aria-modal", "true");
  preview.setAttribute("aria-hidden", "true");
  preview.innerHTML = `
    <div class="project-preview__card" role="document">
      <div class="project-preview__media">
        <img src="" alt="" />
      </div>
      <h3 class="project-preview__title"></h3>
      <button class="project-preview__close" type="button" aria-label="Close project preview">×</button>
    </div>
  `;
  document.body.appendChild(preview);

  const previewImage = preview.querySelector("img");
  const previewTitle = preview.querySelector(".project-preview__title");
  const previewClose = preview.querySelector(".project-preview__close");

  const closePreview = () => {
    preview.classList.remove("is-open");
    preview.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-project-preview");
  };

  const playShine = (card) => {
    card.classList.remove("is-shining");
    void card.offsetWidth;
    card.classList.add("is-shining");
    window.setTimeout(() => {
      card.classList.remove("is-shining");
    }, 1050);
  };

  const getProjectTitle = (card) => {
    const cardTitle = card.querySelector("h3");
    const sectionTitle = card.closest(".archive-section")?.querySelector(".archive-heading h2");
    return cardTitle?.textContent?.trim() || sectionTitle?.textContent?.trim() || "Project preview";
  };

  const openPreview = (card) => {
    const image = card.querySelector("img");

    if (!image) {
      return;
    }

    playShine(card);
    previewImage.src = image.currentSrc || image.src;
    previewImage.alt = image.alt || getProjectTitle(card);
    previewTitle.textContent = getProjectTitle(card);
    preview.classList.add("is-open");
    preview.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-project-preview");
    previewClose.focus({ preventScroll: true });
  };

  projectPreviewItems.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${getProjectTitle(card)} preview`);

    card.addEventListener("click", () => openPreview(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(card);
      }
    });
  });

  previewClose.addEventListener("click", closePreview);
  preview.addEventListener("click", (event) => {
    if (event.target === preview) {
      closePreview();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && preview.classList.contains("is-open")) {
      closePreview();
    }
  });
}

const posterLightboxItems = document.querySelectorAll(".poster-lightbox-target");

if (posterLightboxItems.length) {
  const posterLightbox = document.createElement("div");
  posterLightbox.className = "poster-lightbox";
  posterLightbox.setAttribute("role", "dialog");
  posterLightbox.setAttribute("aria-modal", "true");
  posterLightbox.setAttribute("aria-hidden", "true");
  posterLightbox.innerHTML = `
    <img src="" alt="" />
    <button class="poster-lightbox__close" type="button" aria-label="Close poster preview">×</button>
  `;
  document.body.appendChild(posterLightbox);

  const posterImage = posterLightbox.querySelector("img");
  const posterClose = posterLightbox.querySelector(".poster-lightbox__close");

  const closePosterLightbox = () => {
    posterLightbox.classList.remove("is-open");
    posterLightbox.setAttribute("aria-hidden", "true");
  };

  const openPosterLightbox = (item) => {
    const image = item.querySelector("img");

    if (!image) {
      return;
    }

    posterImage.src = image.currentSrc || image.src;
    posterImage.alt = image.alt || "Poster preview";
    posterLightbox.classList.add("is-open");
    posterLightbox.setAttribute("aria-hidden", "false");
    posterClose.focus({ preventScroll: true });
  };

  posterLightboxItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open poster preview");

    item.addEventListener("click", () => openPosterLightbox(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPosterLightbox(item);
      }
    });
  });

  posterClose.addEventListener("click", closePosterLightbox);
  posterLightbox.addEventListener("click", (event) => {
    if (event.target === posterLightbox) {
      closePosterLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && posterLightbox.classList.contains("is-open")) {
      closePosterLightbox();
    }
  });
}
