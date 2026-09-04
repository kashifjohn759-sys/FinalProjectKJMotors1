/**
 * KJ MOTORS — Google Sheets form backend
 * -----------------------------------------------------------------
 * Deploy this as a Google Apps Script Web App bound to your Google Sheet.
 * It receives POST requests from the site's Sign Up, Contact and
 * Book a Test Drive forms and appends each submission as a new row on
 * its own tab (creating the tab and header row automatically).
 *
 * SETUP — see the accompanying setup guide for full steps. Summary:
 *  1. Create a Google Sheet.
 *  2. Extensions -> Apps Script, delete the sample code, paste this file in.
 *  3. Deploy -> New deployment -> type "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the deployment URL and paste it into GAS_ENDPOINT in js/form.js.
 * -----------------------------------------------------------------
 */

function doPost(e) {
  try {
    var data = (e && e.parameter) || {};
    var formType = data.formType || "General";
    var columns = getColumnsForType(formType);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(formType);
    if (!sheet) {
      sheet = ss.insertSheet(formType);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(columns.map(headerLabel));
    }

    var row = columns.map(function (col) {
      if (col === "Timestamp") return new Date();
      return data[col] || "";
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Column keys per form — must match each <input name="..."> in the site's HTML.
function getColumnsForType(formType) {
  switch (formType) {
    case "signup":
      // Sign Up form (register.html). Passwords are deliberately never sent
      // by the site's JS and are not collected here.
      return ["Timestamp", "first", "last", "email"];
    case "contact":
      // Contact / enquiry form (contact.html), also used by "Enquire" links on car cards.
      return ["Timestamp", "name", "email", "phone", "car", "message"];
    case "test-drive":
      // Book a Test Drive form (book-test-drive.html)
      return ["Timestamp", "name", "phone", "email", "car", "date", "time", "notes"];
    default:
      return ["Timestamp", "name", "email"];
  }
}

// Friendlier column headers shown in row 1 of each sheet tab.
function headerLabel(col) {
  var labels = {
    Timestamp: "Timestamp",
    first: "First Name",
    last: "Last Name",
    email: "Email",
    name: "Name",
    phone: "Phone",
    car: "Vehicle",
    message: "Message",
    date: "Preferred Date",
    time: "Preferred Time",
    notes: "Notes",
  };
  return labels[col] || col;
}

// Optional: quick manual test from the Apps Script editor (Run > testDoPost).
function testDoPost() {
  var fakeEvent = {
    parameter: {
      formType: "contact",
      name: "Test User",
      email: "test@example.com",
      phone: "0300-1234567",
      car: "2023 BMW M4",
      message: "This is a test submission.",
    },
  };
  Logger.log(doPost(fakeEvent).getContent());
}
