/* ==========================================================================
   KJ MOTORS — form.js
   Client-side validation + Google Sheets submission for every form on the
   site (contact, book-test-drive, register). Login is authentication only
   and is never sent to the sheet.
   ========================================================================== */

(function () {
  "use strict";

  // 1. Paste your deployed Google Apps Script Web App URL here (see setup guide).
  //    Until you do, forms fall back to a local "demo success" so the site still works.
  var GAS_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

  function showError(field, message) {
    const wrap = field.closest(".field");
    if (!wrap) return;
    const errorEl = wrap.querySelector(".field-error");
    if (errorEl) errorEl.textContent = message || "";
    wrap.classList.toggle("has-error", !!message);
  }

  function validateField(field) {
    if (field.hasAttribute("required") && !field.value.trim()) {
      showError(field, "This field is required.");
      return false;
    }
    if (field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      showError(field, "Enter a valid email address.");
      return false;
    }
    if (field.type === "tel" && field.value && field.value.replace(/\D/g, "").length < 7) {
      showError(field, "Enter a valid phone number.");
      return false;
    }
    if (field.getAttribute("data-match")) {
      const other = document.getElementById(field.getAttribute("data-match"));
      if (other && field.value !== other.value) {
        showError(field, "Passwords do not match.");
        return false;
      }
    }
    if (field.minLength && field.value && field.value.length < field.minLength) {
      showError(field, `Must be at least ${field.minLength} characters.`);
      return false;
    }
    showError(field, "");
    return true;
  }

  document.querySelectorAll("form[data-validate]").forEach((form) => {
    const fields = form.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      fields.forEach((field) => {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      const successEl = form.querySelector(".form-success") || form.parentElement.querySelector(".form-success");
      const formType = form.getAttribute("data-form-type");

      if (submitBtn) {
        submitBtn.disabled = true;
        const original = submitBtn.textContent;
        submitBtn.textContent = "Submitting…";

        const finish = () => {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
          form.reset();
          if (successEl) {
            successEl.style.display = "block";
            successEl.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => (successEl.style.display = "none"), 6000);
          }
        };

        const fail = () => {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
          alert("Something went wrong submitting the form. Please try again, or contact us directly.");
        };

        const isConfigured = GAS_ENDPOINT && GAS_ENDPOINT.indexOf("PASTE_YOUR") === -1;

        if (formType && isConfigured) {
          // Build the payload from every named field except passwords —
          // credentials never get written to the sheet.
          const payload = new URLSearchParams();
          payload.append("formType", formType);
          fields.forEach((field) => {
            if (field.type === "password") return;
            if (field.name) payload.append(field.name, field.value);
          });

          fetch(GAS_ENDPOINT, {
            method: "POST",
            mode: "no-cors", // Apps Script web apps don't return readable CORS headers;
            body: payload,   // we fire-and-forget and treat a resolved request as success.
          })
            .then(finish)
            .catch(fail);
        } else {
          // Demo fallback until GAS_ENDPOINT is configured above.
          setTimeout(finish, 700);
        }
      }
    });
  });

  /* Prefill enquiry form car name from ?car= query param (used by car card "Enquire" links) */
  const carField = document.querySelector("[data-prefill-car]");
  if (carField) {
    const params = new URLSearchParams(location.search);
    const car = params.get("car");
    if (car) carField.value = car;
  }
})();
