/* ==========================================================================
   KJ MOTORS — compare.js
   Side-by-side spec comparison, up to 3 vehicles, backed by localStorage.
   ========================================================================== */

(function () {
  "use strict";
  if (typeof CAR_DATA === "undefined") return;
  const table = document.querySelector("[data-compare-table]");
  const picker = document.querySelector("[data-compare-picker]");
  if (!table) return;

  const ROWS = [
    { label: "Price", get: (c) => window.KJ.formatPrice(c.price) },
    { label: "Year", get: (c) => c.year },
    { label: "Origin", get: (c) => c.origin + " import" },
    { label: "Category", get: (c) => c.category },
    { label: "Mileage", get: (c) => window.KJ.formatMiles(c.mileage) },
    { label: "Fuel type", get: (c) => c.fuel },
    { label: "Transmission", get: (c) => c.transmission },
    { label: "Condition", get: (c) => c.condition },
    { label: "Exterior colour", get: (c) => c.color },
  ];

  function getSelected() {
    return window.KJ.getCompare()
      .map((id) => CAR_DATA.find((c) => c.id === id))
      .filter(Boolean);
  }

  function render() {
    const cars = getSelected();

    if (!cars.length) {
      table.innerHTML =
        '<tr><td class="empty-state">No vehicles selected yet. Add up to 3 cars from the inventory to compare specs side by side.</td></tr>';
      renderPicker(cars);
      return;
    }

    let head = "<tr><th>Spec</th>" + cars.map((c) => `<th>${c.year} ${c.name} <button data-remove="${c.id}" class="btn btn-sm" style="margin-top:8px;">Remove</button></th>`).join("") + "</tr>";
    let body = ROWS.map(
      (row) =>
        `<tr><td><strong>${row.label}</strong></td>` +
        cars.map((c) => `<td>${row.get(c)}</td>`).join("") +
        `</tr>`
    ).join("");

    table.innerHTML = head + body;
    renderPicker(cars);
  }

  function renderPicker(selectedCars) {
    if (!picker) return;
    const selectedIds = selectedCars.map((c) => c.id);
    picker.innerHTML =
      '<option value="">Add a vehicle to compare…</option>' +
      CAR_DATA.filter((c) => !selectedIds.includes(c.id))
        .slice(0, 60)
        .map((c) => `<option value="${c.id}">${c.year} ${c.name} — ${window.KJ.formatPrice(c.price)}</option>`)
        .join("");
  }

  if (picker) {
    picker.addEventListener("change", () => {
      if (picker.value) {
        window.KJ.toggleCompare(Number(picker.value));
        render();
      }
    });
  }

  table.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    window.KJ.toggleCompare(Number(btn.getAttribute("data-remove")));
    render();
  });

  render();
})();
