/* ==========================================================================
   KJ MOTORS — calculator.js
   Simple monthly-payment loan calculator for finance.html
   ========================================================================== */

(function () {
  "use strict";
  const form = document.querySelector("[data-calc-form]");
  if (!form) return;

  const priceEl = form.querySelector("[data-calc-price]");
  const downEl = form.querySelector("[data-calc-down]");
  const rateEl = form.querySelector("[data-calc-rate]");
  const termEl = form.querySelector("[data-calc-term]");

  const outMonthly = document.querySelector("[data-calc-monthly]");
  const outPrincipal = document.querySelector("[data-calc-principal]");
  const outInterest = document.querySelector("[data-calc-interest]");
  const outTotal = document.querySelector("[data-calc-total]");

  function calc() {
    const price = Number(priceEl.value) || 0;
    const down = Number(downEl.value) || 0;
    const annualRate = Number(rateEl.value) || 0;
    const months = Number(termEl.value) || 1;

    const principal = Math.max(price - down, 0);
    const monthlyRate = annualRate / 100 / 12;

    let monthly;
    if (monthlyRate === 0) {
      monthly = principal / months;
    } else {
      monthly =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const total = monthly * months;
    const interest = total - principal;

    // These calculator fields are entered directly in PKR (not converted from USD),
    // so format as plain PKR currency rather than routing through KJ.formatPrice.
    const fmt = (n) => "PKR " + Math.round(n).toLocaleString("en-PK");
    outMonthly.textContent = fmt(monthly);
    outPrincipal.textContent = fmt(principal);
    outInterest.textContent = fmt(Math.max(interest, 0));
    outTotal.textContent = fmt(total);
  }

  form.addEventListener("input", calc);
  calc();
})();
