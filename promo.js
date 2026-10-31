/* Free-book window for Koshaku.
   Closes at the end of 5 November 2026, US Central time.
   That date is Central Standard Time (UTC-6), after daylight saving
   ends on 1 November 2026. Midnight at the end of 5 November Central
   is 2026-11-06 06:00 UTC.

   There is no start bound: the announcement stays up through the
   morning of the sale, including the days before 1 November.
   Preview either state by adding ?promo=free or ?promo=ended. */
(function () {
  var PROMO_ENDS = Date.parse("2026-11-06T06:00:00Z");
  var params = new URLSearchParams(window.location.search);
  var preview = params.get("promo");
  var live = preview === "ended" ? false : preview === "free" ? true : Date.now() < PROMO_ENDS;

  var nodes = document.querySelectorAll("[data-free-nav]");
  for (var i = 0; i < nodes.length; i++) {
    if (live) nodes[i].removeAttribute("hidden");
    else nodes[i].setAttribute("hidden", "");
  }

  var kicker = document.getElementById("promo-kicker");
  var title = document.getElementById("promo-title");
  if (kicker && title) {
    if (live) {
      kicker.textContent = "Free on Kindle";
      title.textContent = "Koshaku by R. J. Marek is free on Amazon, November 1 to 5";
    } else {
      kicker.textContent = "Now on Amazon";
      title.textContent = "Koshaku by R. J. Marek";
    }
  }

  var current = document.querySelector(".floor-nav a.active");
  if (current && current.scrollIntoView) {
    try {
      current.scrollIntoView({ inline: "center", block: "nearest" });
    } catch (err) {}
  }
})();
