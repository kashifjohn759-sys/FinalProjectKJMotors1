/* ==========================================================================
   KJ MOTORS — gallery.js
   Simple lightbox with keyboard + click navigation for gallery.html
   ========================================================================== */

(function () {
  "use strict";
  const thumbs = document.querySelectorAll("[data-gallery-item]");
  const lightbox = document.querySelector(".lightbox");
  if (!thumbs.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");

  let index = 0;
  const sources = Array.from(thumbs).map((t) => t.getAttribute("data-full") || t.src);

  function open(i) {
    index = (i + sources.length) % sources.length;
    lightboxImg.src = sources[index];
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => open(i)));
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  if (prevBtn) prevBtn.addEventListener("click", () => open(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => open(index + 1));

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(index - 1);
    if (e.key === "ArrowRight") open(index + 1);
  });
})();
