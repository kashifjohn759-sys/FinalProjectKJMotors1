# Finishing the Enquiry form → Google Sheet connection

Your Contact/Enquiry page (`contact.html`) now uses a fully custom-styled
form that matches the rest of the site — no Google branding, no Google
account email showing at the top. It submits quietly in the background to
your existing Google Form, so responses still land in the same Google Sheet
you already have connected.

One small step is needed to finish connecting it: telling the form which
Google Sheet **column** each site field should map to.

## Get your form's entry IDs (2 minutes, one time)

1. Open your Google Form in edit mode (not the live/shared link — the
   editor).
2. Click the **⋮ (three dots)** menu in the top right → **Get pre-filled
   link**.
3. You'll see your form with empty fields. Fill in an obvious placeholder in
   each one so they're easy to spot later, e.g.:
   - Full name → `TESTNAME`
   - Email → `test@test.com`
   - Phone → `12345`
   - Vehicle of interest → `TESTCAR`
   - Message → `TESTMESSAGE`
4. Click **Get link** at the bottom, then **Copy link**.
5. Paste that link somewhere you can read it — it'll look like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform?usp=pp_url&entry.111111111=TESTNAME&entry.222222222=test%40test.com&entry.333333333=12345&entry.444444444=TESTCAR&entry.555555555=TESTMESSAGE
   ```
6. Each `entry.XXXXXXXXX=` right before your placeholder text tells you
   which field it belongs to (match by the placeholder value you typed).

## Fill them into the site

Open `js/google-form.js` and find this block near the top:

```javascript
var ENTRY_MAP = {
  name: "REPLACE_WITH_ENTRY_ID_FOR_FULL_NAME",
  email: "REPLACE_WITH_ENTRY_ID_FOR_EMAIL",
  phone: "REPLACE_WITH_ENTRY_ID_FOR_PHONE",
  car: "REPLACE_WITH_ENTRY_ID_FOR_VEHICLE",
  message: "REPLACE_WITH_ENTRY_ID_FOR_MESSAGE",
};
```

Replace each placeholder with just the number from `entry.NUMBER=` (no
`entry.` prefix, no quotes around the number itself needed beyond what's
already there). For example, if your link contained
`entry.111111111=TESTNAME`, the `name` line becomes:

```javascript
name: "111111111",
```

Do that for all five fields, save the file, and re-upload it. That's it —
submissions from the on-site form will now write straight into your
Google Sheet, matched to the correct columns.

## Notes
- Until `ENTRY_MAP` is filled in, the form still works as a demo (shows a
  "Thanks, got it" success message locally) — nothing on the page breaks in
  the meantime.
- The **"Vehicle of interest" field auto-fills** when someone arrives via a
  car's "Enquire" button, and that same value is what gets sent to your
  sheet.
- If you ever edit the Google Form and add/remove/rename a question, you'll
  need to regenerate the pre-filled link and update `ENTRY_MAP` again — the
  entry IDs are tied to the specific questions, not their labels.
