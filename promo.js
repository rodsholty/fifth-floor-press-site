/* Free-book window for Koshaku.
   Closes at the end of 5 November 2026, US Central time.
   That date is Central Standard Time (UTC-6), after daylight saving
   ends on 1 November 2026. Midnight at the end of 5 November Central
   is 2026-11-06 06:00 UTC.

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

  var freeBlock = document.getElementById("promo-free");
  var nowBlock = document.getElementById("promo-now");
  if (!freeBlock || !nowBlock) return;
  if (live) {
    freeBlock.removeAttribute("hidden");
    nowBlock.setAttribute("hidden", "");
  } else {
    freeBlock.setAttribute("hidden", "");
    nowBlock.removeAttribute("hidden");
  }
})();
