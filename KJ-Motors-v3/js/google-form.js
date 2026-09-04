/* ==========================================================================
   KJ MOTORS — google-form.js
   Submits the site-styled Contact / Enquiry form (contact.html) straight to
   your Google Form's response endpoint, so responses still land in the
   Google Sheet connected to that form — but the form itself looks and
   behaves like the rest of the site instead of Google's default styling.
   ========================================================================== */

(function () {
  "use strict";

  // Your Google Form's ID (the long string in the form's URL, already filled in).
  var GOOGLE_FORM_ID = "1FAIpQLSe-9ph9H2EMPpBQQmOK8oSj7dLZapZFOVw4wmlhVQNKarwWcQ";

  // Map each site field to the matching Google Form question's entry ID.
  // See GOOGLE_FORM_SETUP.md for exactly how to find these — it's a 2-minute,
  // one-time step. Paste just the number, e.g. "1234567890" (no "entry." prefix).
  var ENTRY_MAP = {
    name: "1748413531",
    email: "859592490",
    phone: "374926768",
    car: "261326407",
    message: "515824709",
  };

  var form = document.querySelector("[data-enquiry-form]");
  if (!form) return;
  var fields = form.querySelectorAll("input, textarea");

  function showError(field, message) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    var errorEl = wrap.querySelector(".field-error");
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
    showError(field, "");
    return true;
  }

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var valid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      var firstError = form.querySelector(".has-error input, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    var submitBtn = form.querySelector('[type="submit"]');
    var successEl = form.querySelector(".form-success");
    var original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    var isConfigured = Object.keys(ENTRY_MAP).every(function (key) {
      return ENTRY_MAP[key].indexOf("REPLACE_WITH") === -1;
    });

    var finish = function () {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
      form.reset();
      if (successEl) {
        successEl.style.display = "block";
        successEl.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () {
          successEl.style.display = "none";
        }, 6000);
      }
    };

    if (isConfigured) {
      var payload = new URLSearchParams();
      fields.forEach(function (field) {
        var entryId = ENTRY_MAP[field.name];
        if (entryId) payload.append("entry." + entryId, field.value);
      });

      fetch("https://docs.google.com/forms/d/e/" + GOOGLE_FORM_ID + "/formResponse", {
        method: "POST",
        mode: "no-cors", // Google Forms doesn't return readable CORS headers;
        body: payload,   // we fire-and-forget and treat the resolved request as success.
      })
        .then(finish)
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
          alert("Something went wrong sending your enquiry. Please try again or contact us directly.");
        });
    } else {
      // Demo fallback until ENTRY_MAP is filled in — see GOOGLE_FORM_SETUP.md.
      setTimeout(finish, 700);
    }
  });
})();
