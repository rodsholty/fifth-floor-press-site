# Connect the weekly note

The live site already points `SIGNUP_ENDPOINT` in `signup-config.js` at the deployed web app. Use these steps to replace that deployment. An empty `SIGNUP_ENDPOINT` makes the form say signups are opening soon and sends nothing.

You need a Google account that should own the list. The sheet stays private. The web app URL is public: anyone can add an address or unsubscribe with a token. Reading the list requires the `ADMIN_KEY` script property.

## 1. Make the sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a blank spreadsheet.
2. Name it `Fifth Floor Press signups`.
3. Leave the first sheet empty. The script creates a tab named `Signups` and a header row the first time someone joins.

## 2. Add the script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete any code in `Code.gs`.
3. Paste the entire contents of `Code.gs` from this folder.
4. If you created the script some other way (not from the sheet), paste the spreadsheet ID into `SPREADSHEET_ID` at the top of `Code.gs`. The ID is the long string in the sheet URL between `/d/` and `/edit`. Leave it blank when the script is bound to the sheet.

## 3. Set the unsubscribe secret

Do this before the first real signup. Tokens are minted with this secret. If you change it later, old unsubscribe links stop matching.

1. In the Apps Script editor, open **Project Settings** (the gear).
2. Under **Script properties**, add a property:
   - Property: `UNSUB_SECRET`
   - Value: a long random string (at least 16 characters). A password manager can generate one.
3. Save.

## 3b. Set the list key

The newsletter sender reads the list with this key. It is not the unsubscribe secret, and it must never go in the website or in git.

1. In the same **Script properties** list, add:
   - Property: `ADMIN_KEY`
   - Value: a different long random string, at least 16 characters.
2. Save.

If `ADMIN_KEY` is missing or shorter than 16 characters, a list request is refused. A wrong key is refused the same way: `{"ok":false,"error":"unauthorized"}`. That answer does not say whether the key was missing, short, or wrong, and it does not include any addresses.

To read the list, once a new version is deployed:

```
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?action=list&key=YOUR_ADMIN_KEY
```

A match returns only rows whose status is `subscribed` and whose consent is `yes`:

```json
{"ok":true,"subscribers":[{"email":"reader@example.com","name":"Ada","token":"t..."}]}
```

Each `token` is the unsubscribe token for that address. Put it on the end of `https://fifthfloorpressbooks.com/unsubscribe.html?token=`.

## 4. Deploy the web app

1. Click **Deploy → New deployment**.
2. Click the gear next to “Select type” and choose **Web app**.
3. Description: `Weekly note`.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
   This must be Anyone, not “Anyone with a Google account.” Visitors are not logged in.
6. Click **Deploy**.
7. Google will ask you to authorize the script. Choose the account that owns the sheet. If you see “Google hasn’t verified this app,” click **Advanced**, then **Go to … (unsafe)**, then **Allow**. The warning is normal for a private script. You are allowing your own script to edit your own sheet.
8. Copy the **Web app URL**. It ends in `/exec`. Do not use the `/dev` URL.

## 5. Point the website at it

1. Open `signup-config.js` in the site repo.
2. Paste the URL between the quotes:

```javascript
var SIGNUP_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

3. Commit and push. GitHub Pages publishes from the push. The form starts saving on the next page load.

## 6. Test it

1. Open the homepage, enter your email, check the weekly-note box, and submit.
2. You should see “You’re on the list.” The `Signups` tab should gain one row: timestamp (Central time), email, name, source page, `yes`, a token, `subscribed`.
3. Submit the same email again. You should see that you’re already on the list, and the sheet should still have one row.
4. Copy the token from that row. Open:

   `https://fifthfloorpressbooks.com/unsubscribe.html?token=PASTE_TOKEN`

   You should see that you’re off the list. The row’s status becomes `unsubscribed`.
5. Put the link in the weekly note as:

   `https://fifthfloorpressbooks.com/unsubscribe.html?token=` plus that person’s token from column F.

## When you change the script

**Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.** A saved edit does not go live until you deploy a new version. The `/exec` URL stays the same, so you do not have to change `signup-config.js`.

## What the form sends

`POST` body, JSON, with `Content-Type: text/plain` so the browser does not send a CORS preflight (Apps Script does not answer preflight):

```json
{"email":"reader@example.com","name":"Ada","consent":true,"source":"/index.html","company":""}
```

`company` is a honeypot. If it is filled in, the script answers success and writes nothing.

A normal success response is `{"ok":true}`. A repeat address is `{"ok":true,"duplicate":true}`. Unsubscribe is a `GET` with `?token=` and answers `{"ok":true,"status":"unsubscribed"}` or `"already"`. A `GET` with no parameters answers `{"ok":true,"service":"fifth-floor-press-signups"}`. A `GET` with `action=list` answers the subscriber array above, or `{"ok":false,"error":"unauthorized"}`.

## If the row appears but the page says it could not save

The script ran, and a browser blocked reading the redirect from `script.google.com` to `script.googleusercontent.com`. Confirm you deployed **Anyone** and that the URL in `signup-config.js` is the `/exec` URL from that deployment. Submit again from a normal browser window (not an in-app preview). The text/plain JSON body is what makes the response readable.
