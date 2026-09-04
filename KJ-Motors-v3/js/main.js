/* ==========================================================================
   KJ MOTORS — main.js
   Shared across every page: navigation, wishlist store, card rendering,
   scroll reveal, back-to-top, footer year.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile menu overlay (fully separate from desktop nav-links) ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    // collapse any open accordion groups so the menu reopens fresh next time
    mobileMenu.querySelectorAll(".mobile-menu-group.is-open").forEach((g) => {
      g.classList.remove("is-open");
      const caret = g.querySelector(".mobile-menu-caret");
      if (caret) caret.setAttribute("aria-expanded", "false");
    });
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", openMobileMenu);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }
  if (mobileMenu) {
    // Tapping a direct link (not a group toggle) closes the menu before navigating.
    mobileMenu.querySelectorAll(".mobile-menu-links > a, .mobile-menu-sub a").forEach((a) => {
      a.addEventListener("click", closeMobileMenu);
    });
    // Accordion toggles for Inventory / More groups.
    mobileMenu.querySelectorAll(".mobile-menu-caret").forEach((caret) => {
      caret.addEventListener("click", () => {
        const group = caret.closest(".mobile-menu-group");
        if (!group) return;
        const willOpen = !group.classList.contains("is-open");
        group.classList.toggle("is-open", willOpen);
        caret.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
  // Safety net: if the viewport is resized past the mobile breakpoint while
  // the menu is open (e.g. rotating a tablet), close it so it can't get
  // stuck open behind the desktop nav.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) closeMobileMenu();
  });

  /* ---------- Dropdown menus (Inventory categories, More) — desktop only ---------- */
  const navMores = document.querySelectorAll(".nav-more");
  function closeAllDropdowns(except) {
    navMores.forEach((el) => {
      if (el === except) return;
      el.classList.remove("is-open");
      const trigger = el.querySelector(".nav-caret, .nav-more-label");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }
  navMores.forEach((el) => {
    const trigger = el.querySelector(".nav-caret, .nav-more-label");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !el.classList.contains("is-open");
      closeAllDropdowns(el);
      el.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-more")) closeAllDropdowns();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href], .mobile-menu-links a[href]").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector(".back-to-top");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("is-visible", window.scrollY > 600);
    });
    backTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Currency (PKR, converted from base USD data) ---------- */
  window.KJ = window.KJ || {};
  var USD_TO_PKR = 278; // update this rate periodically to match the market
  window.KJ.formatPrice = function (usd) {
    var pkr = Math.round(Number(usd) * USD_TO_PKR);
    if (pkr >= 1000000) {
      return "PKR " + (pkr / 1000000).toFixed(2).replace(/\.00$/, "") + " Million";
    }
    if (pkr >= 1000) {
      return "PKR " + Math.round(pkr / 1000).toLocaleString("en-PK") + " Thousand";
    }
    return "PKR " + pkr.toLocaleString("en-PK");
  };
  window.KJ.formatMiles = function (n) {
    return Number(n).toLocaleString("en-US") + " mi";
  };

  /* ---------- Wishlist store (localStorage) ---------- */
  const WISHLIST_KEY = "kj_wishlist";
  window.KJ.getWishlist = function () {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      return [];
    }
  };
  window.KJ.toggleWishlist = function (id) {
    const list = window.KJ.getWishlist();
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1);
    else list.push(id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    return list.includes(id);
  };
  window.KJ.isWishlisted = function (id) {
    return window.KJ.getWishlist().includes(id);
  };

  /* ---------- Compare store (localStorage, max 3) ---------- */
  const COMPARE_KEY = "kj_compare";
  window.KJ.getCompare = function () {
    try {
      return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
    } catch (e) {
      return [];
    }
  };
  window.KJ.toggleCompare = function (id) {
    let list = window.KJ.getCompare();
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
    } else {
      if (list.length >= 3) list.shift();
      list.push(id);
    }
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    return list;
  };

  /* ---------- Car card renderer (shared by home/inventory/category/wishlist) ---------- */
  window.KJ.carCardHTML = function (car) {
    const wished = window.KJ.isWishlisted(car.id);
    const originClass = car.origin === "Japanese" ? "jp" : "de";
    const originLabel = car.origin === "Japanese" ? "JP IMPORT" : "DE IMPORT";
    return `
      <article class="car-card" data-id="${car.id}" data-brand="${car.brand}" data-origin="${car.origin}"
                data-category="${car.category}" data-price="${car.price}" data-year="${car.year}">
        <div class="car-card-media">
          <img src="${car.image}" alt="${car.name}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${car.seed}/480/360'">
          <span class="car-tag ${originClass}">${originLabel}</span>
          ${car.featured ? '<span class="car-tag-featured">FEATURED</span>' : ""}
        </div>
        <div class="car-card-body">
          <h3>${car.year} ${car.name}</h3>
          <div class="car-meta">
            <span>${car.mileage === 0 ? "0 mi · New" : window.KJ.formatMiles(car.mileage)}</span>
            <span>${car.fuel}</span>
            <span>${car.transmission}</span>
          </div>
          <div class="car-price">${window.KJ.formatPrice(car.price)} <small>${car.condition}</small></div>
          <div class="car-card-actions">
            <a class="btn btn-primary" href="contact.html?carId=${car.id}">Enquire</a>
            <button class="wishlist-btn ${wished ? "is-active" : ""}" data-wishlist="${car.id}" aria-label="Save to wishlist">${wished ? "♥" : "♡"}</button>
          </div>
        </div>
      </article>`;
  };

  /* Delegate wishlist clicks anywhere on the page */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wishlist]");
    if (!btn) return;
    const id = Number(btn.getAttribute("data-wishlist"));
    const active = window.KJ.toggleWishlist(id);
    btn.classList.toggle("is-active", active);
    btn.textContent = active ? "♥" : "♡";
    document.dispatchEvent(new CustomEvent("kj:wishlist-change"));
  });
})();
