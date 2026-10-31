/**
 * Fifth Floor Press — weekly note signups.
 * Deploy steps: open DEPLOY.md in this folder and follow it in order.
 *
 * The web app writes one row per address to a sheet named "Signups".
 * doPost appends timestamp, email, name, source page, consent, an
 * unsubscribe token, and status. It dedupes on email.
 * doGet with ?token= marks that row unsubscribed.
 *
 * Deploy the web app as: Execute as Me, Who has access: Anyone.
 * The site posts text/plain JSON so the browser skips a CORS preflight.
 * Apps Script adds Access-Control-Allow-Origin on the public /exec URL.
 */

var SPREADSHEET_ID = "";
var SHEET_NAME = "Signups";
var HEADERS = ["timestamp", "email", "name", "source", "consent", "token", "status", "unsubscribed_at"];
var TIMEZONE = "America/Chicago";

function doPost(e) {
  try {
    return json_(handlePost_(e || {}));
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "Could not save that signup." });
  }
}

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var token = params.token ? String(params.token) : "";
    if (!token) {
      return json_({ ok: true, service: "fifth-floor-press-signups" });
    }
    return json_(unsubscribe_(token));
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: "Could not update that subscription." });
  }
}

function handlePost_(e) {
  var data = readBody_(e);
  if (data.company) return { ok: true };
  var email = String(data.email || "").replace(/^\s+|\s+$/g, "").toLowerCase();
  var name = clip_(String(data.name || "").replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, ""), 80);
  var source = clip_(String(data.source || "").replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, ""), 300);
  if (!email) return { ok: false, error: "Please enter an email address." };
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email does not look valid." };
  }
  if (!consented_(data.consent)) {
    return { ok: false, error: "Please agree to the weekly note." };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = sheet_();
    var token = tokenFor_(email);
    var row = findEmail_(sheet, email);
    var stamp = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    var record = [stamp, safe_(email), safe_(name), safe_(source), "yes", token, "subscribed", ""];
    if (row) {
      var status = String(sheet.getRange(row, 7).getValue() || "");
      sheet.getRange(row, 1, 1, HEADERS.length).setValues([record]);
      return { ok: true, duplicate: status === "subscribed" };
    }
    sheet.appendRow(record);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function unsubscribe_(token) {
  if (token.length > 200) return { ok: false, error: "unknown" };
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = sheet_();
    var row = findToken_(sheet, token);
    if (!row) return { ok: false, error: "unknown" };
    var status = String(sheet.getRange(row, 7).getValue() || "");
    if (status === "unsubscribed") return { ok: true, status: "already" };
    var stamp = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    sheet.getRange(row, 7, 1, 2).setValues([["unsubscribed", stamp]]);
    return { ok: true, status: "unsubscribed" };
  } finally {
    lock.releaseLock();
  }
}

function readBody_(e) {
  if (e.postData && e.postData.contents) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (err) {}
  }
  return e.parameter || {};
}

function consented_(value) {
  var s = String(value == null ? "" : value).toLowerCase();
  return s === "true" || s === "yes" || s === "on" || s === "1";
}

function sheet_() {
  var ss = spreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === "") {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function spreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  try {
    var active = SpreadsheetApp.getActive();
    if (active) return active;
  } catch (err) {}
  throw new Error("Set SPREADSHEET_ID at the top of Code.gs, or create this script from the sheet (Extensions, Apps Script).");
}

function secret_() {
  var s = PropertiesService.getScriptProperties().getProperty("UNSUB_SECRET");
  if (s && String(s).length >= 16) return String(s);
  return "REPLACE_WITH_SCRIPT_PROPERTY_UNSUB_SECRET";
}

function tokenFor_(email) {
  var raw = Utilities.computeHmacSha256Signature(email, secret_());
  /* Leading "t" keeps the token from looking like a spreadsheet formula. */
  return "t" + Utilities.base64EncodeWebSafe(raw).replace(/=+$/, "");
}

function findEmail_(sheet, email) {
  return find_(sheet, 2, email, true);
}

function findToken_(sheet, token) {
  return find_(sheet, 6, token, false);
}

function find_(sheet, col, needle, lower) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var values = sheet.getRange(2, col, last - 1, 1).getValues();
  var want = lower ? String(needle).toLowerCase() : String(needle);
  for (var i = 0; i < values.length; i++) {
    var have = String(values[i][0]);
    if (have.charAt(0) === "'") have = have.substring(1);
    if (lower) have = have.toLowerCase();
    if (have === want) return i + 2;
  }
  return 0;
}

function safe_(value) {
  var s = String(value == null ? "" : value);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function clip_(value, max) {
  if (value.length <= max) return value;
  return value.substring(0, max);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
