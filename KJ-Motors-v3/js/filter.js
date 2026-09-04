/* ==========================================================================
   KJ MOTORS — filter.js
   Renders and filters the CAR_DATA set for inventory.html and the four
   category pages (luxury / sports / suv / electric). Reads a data-category
   attribute on <body> to lock a page to one category when present.
   ========================================================================== */

(function () {
  "use strict";
  const grid = document.querySelector("[data-car-grid]");
  if (!grid || typeof CAR_DATA === "undefined") return;

  const lockedCategory = document.body.getAttribute("data-category"); // e.g. "luxury" or null on inventory.html
  const featuredOnly = grid.hasAttribute("data-featured-only");
  const countEl = document.querySelector("[data-filter-count]");
  const emptyEl = document.querySelector("[data-empty-state]");

  if (featuredOnly) {
    const list = CAR_DATA.filter((c) => c.featured).slice(0, 8);
    grid.innerHTML = list.map((c) => window.KJ.carCardHTML(c)).join("");
    return;
  }

  const els = {
    brand: document.querySelector("[data-f-brand]"),
    origin: document.querySelector("[data-f-origin]"),
    category: document.querySelector("[data-f-category]"),
    price: document.querySelector("[data-f-price]"),
    sort: document.querySelector("[data-f-sort]"),
    search: document.querySelector("[data-f-search]"),
  };

  const PAGE_SIZE = 12;
  let page = 1;

  function baseSet() {
    return lockedCategory
      ? CAR_DATA.filter((c) => c.category === lockedCategory)
      : CAR_DATA;
  }

  function populateBrandOptions() {
    if (!els.brand) return;
    const brands = [...new Set(baseSet().map((c) => c.brand))].sort();
    brands.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      els.brand.appendChild(opt);
    });
  }

  function apply() {
    let list = baseSet();

    if (els.brand && els.brand.value) list = list.filter((c) => c.brand === els.brand.value);
    if (els.origin && els.origin.value) list = list.filter((c) => c.origin === els.origin.value);
    if (els.category && els.category.value) list = list.filter((c) => c.category === els.category.value);
    if (els.price && els.price.value) {
      const [min, max] = els.price.value.split("-").map(Number);
      list = list.filter((c) => c.price >= min && (max ? c.price <= max : true));
    }
    if (els.search && els.search.value.trim()) {
      const q = els.search.value.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    switch (els.sort && els.sort.value) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "year-desc":
        list = [...list].sort((a, b) => b.year - a.year);
        break;
      default:
        list = [...list].sort((a, b) => b.featured - a.featured);
    }

    render(list);
  }

  function render(list) {
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    grid.innerHTML = pageItems.map((c) => window.KJ.carCardHTML(c)).join("");

    if (countEl) countEl.textContent = `${list.length} vehicle${list.length === 1 ? "" : "s"} found`;
    if (emptyEl) emptyEl.style.display = list.length ? "none" : "block";

    renderPagination(list.length);
  }

  function renderPagination(total) {
    const wrap = document.querySelector("[data-pagination]");
    if (!wrap) return;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    wrap.innerHTML = "";
    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === page) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        page = i;
        apply();
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      wrap.appendChild(btn);
    }
  }

  Object.values(els).forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      page = 1;
      apply();
    });
  });

  const resetBtn = document.querySelector("[data-filter-reset]");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.values(els).forEach((el) => el && (el.value = ""));
      page = 1;
      apply();
    });
  }

  populateBrandOptions();
  apply();
})();
