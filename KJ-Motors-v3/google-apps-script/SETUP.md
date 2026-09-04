# Connecting KJ Motors forms to Google Sheets

This connects three forms — **Sign Up**, **Contact / Enquiry**, and **Book a Test
Drive** — to a Google Sheet, so every submission appears as a new row
automatically. **Login is not connected** (it's authentication only; nothing
should be logged from it).

No paid tools or servers required — this uses a free Google Apps Script
"Web App," which acts as the backend.

## 1. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet.
2. Name it something like **KJ Motors — Form Submissions**.
3. You don't need to create any tabs yourself — the script creates a
   **Sign Up**, **Contact**, and **Test Drive** tab automatically the first
   time each form is submitted.

## 2. Add the script
1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete any placeholder code in the editor.
3. Open `google-apps-script/Code.gs` (included in your site download) and
   paste its full contents into the editor.
4. Click the **Save** icon (or Ctrl/Cmd+S).

## 3. Deploy it as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google will ask you to authorize the script — click through the consent
   screens (you may see an "unverified app" warning since this is your own
   script; click **Advanced → Go to [project name] (unsafe)** to proceed —
   this is expected for personal scripts and is safe since you wrote it).
6. Copy the **Web app URL** it gives you — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 4. Connect it to the website
1. Open `js/form.js` in your site files.
2. Near the top, find this line:
   ```javascript
   var GAS_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder text with the URL you copied, e.g.:
   ```javascript
   var GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Save the file and re-upload it to your live site.

That's it — submissions from Sign Up, Contact, and Book a Test Drive will
now land as new rows in your Google Sheet, each on their own tab.

## Notes
- **Passwords are never sent.** The Sign Up form collects a password for the
  demo login flow, but `form.js` deliberately strips password fields before
  sending anything to the sheet.
- **"Enquire" links on car cards** open the Contact form pre-filled with the
  car name, so those submissions land in the same "Contact" tab.
- If you ever need to reset or re-authorize, just redeploy from
  **Deploy → Manage deployments → Edit → New version**.
- Until you paste in a real URL, forms still work exactly as before (a local
  "Thanks, we got your message" confirmation) — nothing breaks in the
  meantime.
