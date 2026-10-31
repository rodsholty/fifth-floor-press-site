/* Posts the weekly-note form to SIGNUP_ENDPOINT (signup-config.js).
   Blank endpoint: a clear "opening soon" message, no mailto, nothing stored. */
(function () {
  var SOON = "Signups are opening soon. Until the list is connected, write to info@fifthfloorpressbooks.com and we will add you.";
  var SAVED = "You\u2019re on the list. Watch for a short note when a book is free.";
  var DUPLICATE = "You\u2019re already on the list. We\u2019ll write when a book is free.";
  var NET = "We couldn\u2019t save that just now. Try again, or write to info@fifthfloorpressbooks.com.";

  function endpoint() {
    if (typeof SIGNUP_ENDPOINT !== "string") return "";
    return SIGNUP_ENDPOINT.replace(/^\s+|\s+$/g, "");
  }

  function setStatus(node, kind, message) {
    if (!node) return;
    node.textContent = message;
    node.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function sourcePage() {
    var path = window.location.pathname || "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    return path;
  }

  function previewKind() {
    var params;
    try { params = new URLSearchParams(window.location.search); }
    catch (err) { return ""; }
    var value = params.get("signup");
    if (value === "soon" || value === "success" || value === "error") return value;
    return "";
  }

  function showPreview(status, kind) {
    if (kind === "success") setStatus(status, "ok", SAVED);
    else if (kind === "error") setStatus(status, "error", NET);
    else setStatus(status, "", SOON);
  }

  function safeError(data) {
    if (!data || typeof data.error !== "string") return NET;
    if (data.error.length > 160 || /[<>]/.test(data.error)) return NET;
    return data.error;
  }

  var forms = document.querySelectorAll("form.signup-form");
  for (var i = 0; i < forms.length; i++) bind(forms[i]);

  function bind(form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type='submit']");
    var preview = previewKind();
    if (preview) showPreview(status, preview);
    else if (!endpoint()) setStatus(status, "", SOON);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var emailInput = form.querySelector("input[name='email']");
      var nameInput = form.querySelector("input[name='name']");
      var consentInput = form.querySelector("input[name='consent']");
      var honey = form.querySelector("input[name='company']");
      var email = emailInput ? emailInput.value.replace(/^\s+|\s+$/g, "") : "";
      var name = nameInput ? nameInput.value.replace(/^\s+|\s+$/g, "") : "";
      var consent = consentInput && consentInput.checked;

      if (emailInput) emailInput.removeAttribute("aria-invalid");

      if (!validEmail(email)) {
        if (emailInput) {
          emailInput.setAttribute("aria-invalid", "true");
          emailInput.focus();
        }
        setStatus(status, "error", "Please enter a valid email address.");
        return;
      }
      if (!consent) {
        if (consentInput) consentInput.focus();
        setStatus(status, "error", "Please check the box to agree to the weekly note.");
        return;
      }

      /* Filled honeypot: pretend it worked and do not store it. */
      if (honey && honey.value) {
        form.reset();
        setStatus(status, "ok", SAVED);
        return;
      }

      var url = endpoint();
      if (!url) {
        setStatus(status, "", SOON);
        return;
      }
      if (typeof window.fetch !== "function") {
        setStatus(status, "error", "This browser can\u2019t send the form. Email info@fifthfloorpressbooks.com and we will add you.");
        return;
      }

      var label = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Saving\u2026";
      }

      var payload = {
        email: email,
        name: name,
        consent: true,
        source: sourcePage(),
        company: ""
      };

      window.fetch(url, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (data && data.ok) {
          form.reset();
          setStatus(status, "ok", data.duplicate ? DUPLICATE : SAVED);
        } else {
          setStatus(status, "error", safeError(data));
        }
      }).catch(function () {
        setStatus(status, "error", NET);
      }).then(function () {
        if (button) {
          button.disabled = false;
          button.textContent = label;
        }
      });
    });
  }

  var unsub = document.getElementById("unsub-status");
  if (!unsub) return;
  var params;
  try { params = new URLSearchParams(window.location.search); }
  catch (err) { params = null; }
  var token = params ? (params.get("token") || "") : "";
  token = token.replace(/^\s+|\s+$/g, "");
  var url = endpoint();

  if (!token) {
    setStatus(unsub, "", "Open the unsubscribe link in the weekly note, or email info@fifthfloorpressbooks.com and we will remove you.");
    return;
  }
  if (!url) {
    setStatus(unsub, "", "The list is not connected yet. To be removed, email info@fifthfloorpressbooks.com.");
    return;
  }
  if (typeof window.fetch !== "function") {
    setStatus(unsub, "error", "This browser can\u2019t reach the list. Email info@fifthfloorpressbooks.com and we will remove you.");
    return;
  }

  setStatus(unsub, "", "Removing that address\u2026");
  var join = url.indexOf("?") >= 0 ? "&" : "?";
  window.fetch(url + join + "token=" + encodeURIComponent(token), { method: "GET" })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.ok && data.status === "already") {
        setStatus(unsub, "ok", "You\u2019re already off the list.");
      } else if (data && data.ok) {
        setStatus(unsub, "ok", "You\u2019re off the list. You won\u2019t get the weekly note.");
      } else {
        setStatus(unsub, "error", "That link doesn\u2019t match anyone on the list. Email info@fifthfloorpressbooks.com and we will remove you.");
      }
    })
    .catch(function () {
      setStatus(unsub, "error", "We couldn\u2019t reach the list just now. Email info@fifthfloorpressbooks.com and we will remove you.");
    });
})();
