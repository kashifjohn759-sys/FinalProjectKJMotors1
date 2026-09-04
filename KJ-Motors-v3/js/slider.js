/* ==========================================================================
   KJ MOTORS — slider.js
   Autoplaying hero slider with dot navigation. Homepage only.
   ========================================================================== */

(function () {
  "use strict";
  const slides = document.querySelectorAll(".hero-slide");
  const dotsWrap = document.querySelector(".hero-dots");
  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer = null;
  const INTERVAL = 5500;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dotsWrap.children[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dotsWrap.children[current].classList.add("is-active");
  }

  function next() {
    goTo(current + 1);
  }

  function start() {
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => {
      goTo(i);
      start();
    });
    dotsWrap.appendChild(dot);
  });

  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    heroEl.addEventListener("mouseenter", stop);
    heroEl.addEventListener("mouseleave", start);
  }

  start();
})();
