/* Books for sale. Edit this file to change an Amazon link or the
   featured book on /links. The homepage shop and the bio page both
   read this list. Author pages repeat the same /dp/ links. */
var CATALOG = {
  featured: "try-the-spirits",
  books: [
    { id: "triage", title: "Triage", author: "Owen Kessler, MD", page: "kessler.html#triage", kindle: "https://www.amazon.com/dp/B0HBRN3KB9", paper: "https://www.amazon.com/dp/B0HKGKGJFR", cover: "covers/triage.jpg", w: 167, h: 268 },
    { id: "golden-hour", title: "Golden Hour", author: "Owen Kessler, MD", page: "kessler.html#golden-hour", kindle: "https://www.amazon.com/dp/B0HJCZ1WHV", paper: "https://www.amazon.com/dp/B0HKGMJCSF", cover: "covers/golden-hour.jpg", w: 167, h: 268 },
    { id: "edema", title: "Edema", author: "Owen Kessler, MD", page: "kessler.html#edema", kindle: "https://www.amazon.com/dp/B0HK3446QH", paper: "https://www.amazon.com/dp/B0HKGKDRMG", cover: "covers/edema.jpg", w: 167, h: 268 },
    { id: "resignation", title: "Resignation", author: "R. J. Marek", page: "marek.html#resignation", kindle: "https://www.amazon.com/dp/B0H3M3XQ45", paper: "https://www.amazon.com/dp/B0HMJRS5XF", cover: "covers/resignation.jpg", w: 167, h: 268 },
    { id: "koshaku", title: "Koshaku", author: "R. J. Marek", page: "marek.html#koshaku", kindle: "https://www.amazon.com/dp/B0HL5MXW6R", paper: "https://www.amazon.com/dp/B0HKH1K821", cover: "covers/koshaku.jpg", w: 167, h: 268 },
    { id: "candid", title: "Candid", author: "R. J. Marek", page: "marek.html#candid", kindle: "https://www.amazon.com/dp/B0HKH33C78", paper: "https://www.amazon.com/dp/B0HKH51Z2S", cover: "covers/candid.jpg", w: 167, h: 268 },
    { id: "try-the-spirits", title: "Try the Spirits", author: "R. J. Marek", page: "marek.html#try-the-spirits", kindle: "https://www.amazon.com/dp/B0HK1KGHK5", paper: "https://www.amazon.com/dp/B0HK21F5SR", cover: "covers/try-the-spirits.jpg", w: 167, h: 268 },
    { id: "last-chair", title: "Last Chair", author: "R. J. Marek", page: "marek.html#last-chair", kindle: "https://www.amazon.com/dp/B0HCK37SJG", paper: "https://www.amazon.com/dp/B0HCK9F65M", cover: "covers/last-chair.jpg", w: 240, h: 384 },
    { id: "the-scattering", title: "The Scattering", author: "R. J. Marek", page: "marek.html#the-scattering", kindle: "https://www.amazon.com/dp/B0HKGPR52R", paper: "https://www.amazon.com/dp/B0HKH228V4", cover: "covers/the-scattering.jpg", w: 167, h: 268 },
    { id: "the-long-winter", title: "The Long Winter", author: "R. J. Marek", page: "marek.html#the-long-winter", kindle: "https://www.amazon.com/dp/B0HNCPJHZY", paper: "https://www.amazon.com/dp/B0HND1K8XD", cover: "covers/the-long-winter.jpg", w: 167, h: 268 },
    { id: "eli", title: "Eli", author: "R. J. Marek", page: "marek.html#eli", kindle: "https://www.amazon.com/dp/B0HLTVTCT9", paper: "https://www.amazon.com/dp/B0HKHN41FN", cover: "covers/eli.jpg", w: 168, h: 252 },
    { id: "settled", title: "Settled", author: "Claire Dare", page: "dare.html#settled", kindle: "https://www.amazon.com/dp/B0HMH53WPR", paper: "https://www.amazon.com/dp/B0HMH46HM7", cover: "covers/settled.jpg", w: 167, h: 268 },
    { id: "natural", title: "NATURAL", author: "Claire Dare", page: "dare.html#natural", kindle: "", paper: "https://www.amazon.com/dp/B0HPSN7R8D", cover: "covers/natural.jpg", w: 167, h: 267 }
  ]
};

function renderFifthFloorCatalog() {
  var shop = document.getElementById("shop");
  if (shop) renderShop(shop);
  var grid = document.getElementById("bio-grid");
  if (grid) renderBioGrid(grid);
  applyFeaturedBook();
}

function renderShop(root) {
  var prefix = root.getAttribute("data-prefix") || "";
  CATALOG.books.forEach(function (book) {
    var card = document.createElement("article");
    card.className = "shop-card";
    var primary = book.kindle || book.paper;
    var cover = document.createElement("a");
    cover.className = "shop-cover";
    cover.href = primary;
    cover.target = "_blank";
    cover.rel = "noopener";
    cover.setAttribute("aria-label", book.title + " by " + book.author + " on Amazon");
    var img = document.createElement("img");
    img.src = prefix + book.cover;
    img.alt = book.title + " cover";
    img.width = book.w;
    img.height = book.h;
    cover.appendChild(img);
    card.appendChild(cover);
    var h = document.createElement("h3");
    var titleLink = document.createElement("a");
    titleLink.href = book.page;
    titleLink.textContent = book.title;
    h.appendChild(titleLink);
    card.appendChild(h);
    var meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = book.author;
    card.appendChild(meta);
    card.appendChild(buyBox(book));
    root.appendChild(card);
  });
}

function buyBox(book) {
  var buy = document.createElement("div");
  buy.className = "buy";
  if (book.paper) buy.appendChild(buyLink(book.paper, "buy-paper", "Buy Paperback", "Buy Paperback of " + book.title));
  if (book.kindle) buy.appendChild(buyLink(book.kindle, "buy-kindle", "Buy on Kindle", "Buy " + book.title + " on Kindle"));
  return buy;
}

function buyLink(href, cls, label, aria) {
  var a = document.createElement("a");
  a.className = "buy-link " + cls;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = label;
  a.setAttribute("aria-label", aria);
  return a;
}

function renderBioGrid(root) {
  var prefix = root.getAttribute("data-prefix") || "";
  CATALOG.books.forEach(function (book) {
    var dest = book.kindle || book.paper;
    var a = document.createElement("a");
    a.className = "tile";
    a.href = dest;
    a.rel = "noopener";
    a.setAttribute("data-id", book.id);
    a.setAttribute("data-title", book.title);
    a.setAttribute("data-author", book.author);
    a.setAttribute("data-kindle", dest);
    a.setAttribute("data-paper", book.paper);
    var img = document.createElement("img");
    img.src = prefix + book.cover;
    img.alt = "";
    img.width = book.w;
    img.height = book.h;
    a.appendChild(img);
    var title = document.createElement("span");
    title.className = "tile-title";
    title.textContent = book.title;
    a.appendChild(title);
    var author = document.createElement("span");
    author.className = "tile-author";
    author.textContent = book.author;
    a.appendChild(author);
    if (!book.kindle) {
      var note = document.createElement("span");
      note.className = "tile-note";
      note.textContent = "Paperback";
      a.appendChild(note);
    }
    root.appendChild(a);
  });
}

function applyFeaturedBook() {
  if (!document.getElementById("featured-title")) return;
  var tile = document.querySelector('.tile[data-id="' + CATALOG.featured + '"]');
  if (!tile) return;
  var title = tile.getAttribute("data-title");
  var author = tile.getAttribute("data-author");
  var kindle = tile.getAttribute("data-kindle");
  var paper = tile.getAttribute("data-paper");
  var img = tile.querySelector("img");
  var cover = document.getElementById("featured-cover");
  cover.src = img.getAttribute("src");
  cover.width = img.width;
  cover.height = img.height;
  cover.alt = title + " cover";
  document.getElementById("featured-title").textContent = title;
  document.getElementById("featured-author").textContent = author;
  var paperOnly = kindle === paper;
  document.getElementById("featured-cover-link").href = paperOnly ? paper : kindle;
  var kindleBtn = document.getElementById("featured-kindle");
  kindleBtn.href = paperOnly ? paper : kindle;
  kindleBtn.textContent = paperOnly ? "Paperback" : "Read on Kindle";
  kindleBtn.setAttribute("aria-label", paperOnly ? ("Paperback of " + title) : ("Read " + title + " on Kindle"));
  var paperBtn = document.getElementById("featured-paper");
  paperBtn.href = paper;
  if (paperOnly) paperBtn.setAttribute("hidden", "");
  else paperBtn.removeAttribute("hidden");
  paperBtn.setAttribute("aria-label", "Paperback of " + title);
}

renderFifthFloorCatalog();
