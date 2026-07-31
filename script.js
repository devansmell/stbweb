/* =============================================================
   SPLIT THE BILL - SCRIPT
   All content lives in the editable arrays below. To add a new
   event/performance, gallery photo, or background image, just
   edit these arrays - no HTML changes required.
   ============================================================= */

/* -------------------------------------------------------------
   1. PERFORMANCES
   Each object becomes its own full-screen video section.
   - youtube:    the YouTube video ID (e.g. "dQw4w9WgXcQ")
   - releaseDate: ISO date string. If it is in the future, a live
                  countdown is shown instead of the video, and the
                  video appears automatically when it reaches zero.
   - bg:         background for this section, from /assets/images/.
                 Can be a static jpg/png, OR an animated .webp/.gif -
                 animated files just loop forever as a background,
                 no player, no controls, nothing else to wire up.
                 The dark gradient over the background layer already
                 dims it so text stays readable on top.
   ------------------------------------------------------------- */
const performances = [
   // {
     // band: "Talllon",
     // logo: "talllon.png",
     // song: "Go Back Again",
     // youtube: "dQw4w9WgXcQ",
     // description:
       // "Talllon top the bill with a heavy, driving set. Placeholder description - replace with details about this performance.",
     // releaseDate: "2028-08-21",
     // bg: "1talllon.webp",
   // },

  {
    band: "Cats!",
    logo: "cats-text.svg", 
    invert: true, 
    accent: "cats-cat.svg", 
    song: "Engine No 9",
    youtube: "dQw4w9WgXcQ",
    description:
      "Statement from the band: \"Alek can't play drums, Ciaran looks like mclovin, Troy is a loser, and the singer is a chud.\"",
    releaseDate: "2026-08-07",
    bg: "4cats.webp",
  },

  {
    band: "Redline",
    logo: "redline.svg",
    song: "Bottle It Up [clip]",
    youtube: "LRiJrnGsxUM",
    description:
      "Redline are a four-piece alt/punk rock band from Galway. They draw inspiration from artists like Fugazi, The replacements and Bad Bunny. This unique blend of sound combines into catchy hooks and riffs to create unforgettable songs.",
    releaseDate: "2026-07-31",
    bg: "2redline.webp",
  },

  {
    band: "Hell Yeah!",
    logo: "hellyeah.svg",
    song: "It Could Be Worse",
    youtube: "t9ftGnicdmY",
    description:
      "Meet Hell Yeah!, the Galway outfit serving up homemade \"sick indie music\" with deeply personal lyrics. Their signature style blends vulnerable songwriting with a casual, unfiltered attitude. Joined by Isaac from Sakura, it all combines to create a massive sound that leaves you saying exactly one thing: \"hell yeah!\"",
    releaseDate: "2026-07-24",
    bg: "3hellyeah.webp",
  },

   // {
     // band: "Villainessica",
     // logo: "villainessica-text.svg", // wordmark in the band's own typeface
     // accent: "vil-logo.svg", // sigil mark, anchored bottom-right as an accent
     // song: "Track Name",
     // youtube: "dQw4w9WgXcQ",
     // description:
       // "Villainessica close out the lineup. Replace with details about this performance.",
     // releaseDate: "2028-08-15",
     // bg: "5villainessica.webp",
   // },
   // {
     // band: "Mentality",
     // logo: "mentality.svg",
     // song: "Track Name",
     // youtube: "dQw4w9WgXcQ",
     // description:
		// "Mentality bring their sound to the stage. Replace with details about this performance.",
     // releaseDate: "2028-07-24",
     // bg: "6mentality.webp",
  // },
]; 

/* Base path for the band identity logos */
const BAND_PATH = "assets/bands/";

/*  make dates 5pm  */
const RELEASE_HOUR = 17;

function getReleaseTimestamp(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, RELEASE_HOUR, 0, 0).getTime();
}

function isReleased(performance) {
  return getReleaseTimestamp(performance.releaseDate) <= Date.now();
}

/* is it drop day !! */
function isDropDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const now = new Date();
  return (
    now.getFullYear() === y &&
    now.getMonth() === m - 1 &&
    now.getDate() === d
  );
}

/* -------------------------------------------------------------
   2. GALLERY IMAGES (so you dont forget)
   Each object drives one photo. Gallery order = array order.
   - file:         filename, relative to /assets/images/
   - photographer: credit shown in the lightbox
   - url:          link to the photographer's work (opens in a new
                   tab). Leave as "" or omit to hide the link.
   ------------------------------------------------------------- */
const galleryImages = [
  { file: "gallery-1.jpg", photographer: "Dean Naylor", url: "https://instagram.com/deannaylorr" },
  { file: "gallery-2.jpg", photographer: "Dean Naylor", url: "https://instagram.com/deannaylorr" },
  { file: "gallery-3.jpg", photographer: "Ace (@tehya.jpeg)", url: "https://www.instagram.com/tehya.jpeg/" },
  { file: "gallery-4.jpg", photographer: "Aimee King", url: "https://www.instagram.com/aimeedotmusic/" },
  { file: "gallery-5.jpg", photographer: "Kamile (@withacinnamongirl)", url: "https://www.instagram.com/withacinnamongirl/" },
  { file: "gallery-6.jpg", photographer: "Dean Naylor", url: "https://instagram.com/deannaylorr" },
  { file: "gallery-7.jpg", photographer: "Dean Naylor", url: "https://instagram.com/deannaylorr" },
  { file: "gallery-8.jpg", photographer: "Ace (@tehya.jpeg)", url: "https://www.instagram.com/tehya.jpeg/" },
];
/* -------------------------------------------------------------
   3. BACKGROUNDS
   Persistent full-screen background slides. Sections reference
   these either by index (data-bg="0") or by filename.
   ------------------------------------------------------------- */
const backgrounds = [
  "poster.png", // 0 - hero / event poster (visual identity)
  "venue.jpg", // 1 - venue / about
  // Per-band looping previews (animated .webp/.gif) - referenced by
  // filename from each performance's [bg] field above.
  "1talllon.webp",
  "2redline.webp",
  "3hellyeah.webp",
  "4cats.webp",
  "5villainessica.webp",
  "6mentality.webp",
];

/* Base path for all image assets */
const IMG_PATH = "assets/images/";

/* =============================================================
   SCROLL REVEAL OBSERVER
   Declared early so the section builders below can use it.
   Elements with the [reveal] class fade + slide into view.
   ============================================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

/* =============================================================
   INTRO ANIMATION (once per browser session)
   ============================================================= */
(function initIntro() {
  const intro = document.getElementById("intro");
  if (!intro) return;

  // Skip if already played this session.
  if (sessionStorage.getItem("stb_intro_played")) {
    intro.classList.add("is-hidden");
    intro.remove();
    return;
  }

  // Hide after the animation (~2s) completes.
  window.setTimeout(() => {
    intro.classList.add("is-hidden");
    sessionStorage.setItem("stb_intro_played", "1");
    window.setTimeout(() => intro.remove(), 900);
  }, 2000);
})();

/* =============================================================
   NAVIGATION (scroll state + mobile menu + active link)
   ============================================================= */
(function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  // Add background to nav once scrolled.
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile hamburger toggle. (mmmmmm hamburger)
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close mobile menu after clicking a link.
  links.addEventListener("click", (e) => {
    if (e.target.matches(".nav__link")) {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* =============================================================
   BUILD VIDEO / PERFORMANCE SECTIONS
   ============================================================= */
(function buildPerformances() {
  const mount = document.getElementById("videos");
  if (!mount) return;

  // Released sets lead the page; within each group (released /
  // still-coming), keep the real live set order.
  const ordered = performances
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const aOut = isReleased(a.p);
      const bOut = isReleased(b.p);
      if (aOut !== bOut) return aOut ? -1 : 1;
      return a.i - b.i;
    });

  ordered.forEach(({ p, i }) => {
    const section = document.createElement("section");
    section.className = "section performance";
    section.id = `performance-${i}`;
    section.dataset.section = p.band;
    // Tie section background to its photo (falls back to a base bg).
    section.dataset.bg = p.bg || "hero.jpg";

    // Use the band's own logo (in its own typeface) when provided,
    // otherwise fall back to a plain text band name.
    const heading = p.logo
      ? `<img class="performance__logo${p.invert ? " performance__logo--invert" : ""}"
             src="${BAND_PATH}${p.logo}" alt="${p.band}" />`
      : `<h2 class="performance__band">${p.band}</h2>`;

    // Optional artwork mark, anchored to the bottom-right as an accent
    // so the wordmark typeface stays untouched.
    const accent = p.accent
      ? `<img class="performance__accent${p.invert ? " performance__accent--invert" : ""}" src="${BAND_PATH}${p.accent}" alt="" aria-hidden="true" />`
      : "";

    section.innerHTML = `
      <div class="performance__inner reveal">
        <div class="performance__meta">
          ${heading}
          <div class="performance__sub">
            <span class="performance__song">${p.song}</span>
            <span class="performance__date">${formatDate(p.releaseDate)} · 5pm</span>
          </div>
        </div>
        <div class="media-frame" data-media></div>
        <p class="performance__desc">${p.description}</p>
        ${accent}
      </div>
    `;

    mount.appendChild(section);

    // Populate the media frame: countdown OR lazy video.
    const frame = section.querySelector("[data-media]");
    renderMedia(frame, p);
  });
})();

/* Render either a countdown or a lazy YouTube facade in a frame. */
function renderMedia(frame, performance) {
  // The band's own looping preview (static jpg/png or animated
  // webp/gif - animated ones just loop forever as a CSS background,
  // no player needed) sits behind the countdown/facade, dimmed.
  if (performance.bg) {
    frame.style.backgroundImage = `url('${IMG_PATH}${performance.bg}')`;
  }

  if (isReleased(performance)) {
    // Released -> show the lazy-loaded video facade.
    renderVideoFacade(frame, performance);
  } else {
    // Future release -> show a countdown scoped to THIS frame only.
    renderCountdown(frame, performance, getReleaseTimestamp(performance.releaseDate));
  }
}

/* Build a lazy YouTube facade (thumbnail + play). The heavy iframe
   is only injected once the user clicks play. */
function renderVideoFacade(frame, performance) {
  const id = performance.youtube;

  // note: took out thumbnail fetch because its ugly
  frame.innerHTML = `
    <div class="yt-facade"
         role="button" tabindex="0" aria-label="Play ${performance.band} - ${performance.song}">
      <span class="yt-facade__play" aria-hidden="true"></span>
    </div>
  `;

  const facade = frame.querySelector(".yt-facade");
  const load = () => {
    frame.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0"
        title="${performance.band} - ${performance.song}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
    `;
  };
  facade.addEventListener("click", load);
  facade.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      load();
    }
  });
}

/* Build a live countdown inside a frame. When it hits zero it
   automatically swaps itself for the video - no code change needed. */
function renderCountdown(frame, performance, release) {
  frame.innerHTML = `
    <div class="countdown">
      <span class="countdown__label">Next upload<span class="countdown__time" data-cd-time hidden> · drops 5pm</span></span>
      <div class="countdown__grid">
        ${countdownCell("days", "Days")}
        ${countdownCell("hours", "Hours")}
        ${countdownCell("minutes", "Minutes")}
        ${countdownCell("seconds", "Seconds")}
      </div>
    </div>
  `;

  const els = {
    days: frame.querySelector('[data-cd="days"]'),
    hours: frame.querySelector('[data-cd="hours"]'),
    minutes: frame.querySelector('[data-cd="minutes"]'),
    seconds: frame.querySelector('[data-cd="seconds"]'),
    time: frame.querySelector("[data-cd-time]"),
  };

  // Only surface the "drops 5pm" time once it's actually the drop
  // day - otherwise it's just noise this many days out.
  els.time.hidden = !isDropDay(performance.releaseDate);

  const tick = () => {
    const diff = release - Date.now();

    if (diff <= 0) {
      // Time's up - replace the countdown with the video.
      window.clearInterval(timer);
      renderVideoFacade(frame, performance);
      return;
    }

    els.time.hidden = !isDropDay(performance.releaseDate);

    const s = Math.floor(diff / 1000);
    els.days.textContent = pad(Math.floor(s / 86400));
    els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    els.seconds.textContent = pad(s % 60);
  };

  tick();
  const timer = window.setInterval(tick, 1000);
}

function countdownCell(key, unit) {
  return `
    <div class="countdown__cell">
      <span class="countdown__num" data-cd="${key}">00</span>
      <span class="countdown__unit">${unit}</span>
    </div>
  `;
}

/* =============================================================
   GALLERY (masonry + lazy loading + lightbox)
   ============================================================= */
(function buildGallery() {
  const grid = document.getElementById("masonry");
  if (!grid) return;

  galleryImages.forEach((photo, i) => {
    const item = document.createElement("div");
    item.className = "masonry__item";
    item.dataset.index = String(i);
    const credit = photo.photographer
      ? ` - photo by ${photo.photographer}`
      : "";
    item.innerHTML = `
      <img src="${IMG_PATH}${photo.file}" alt="Split The Bill photo ${i + 1}${credit}"
           loading="lazy" decoding="async" />
      ${photo.photographer ? `<span class="masonry__credit">${photo.photographer}</span>` : ""}
    `;
    // Graceful fallback: until the real photo exists, show a
    // placeholder tile so the masonry layout is still visible.
    const img = item.querySelector("img");
    img.addEventListener("error", () => {
      item.classList.add("masonry__item--placeholder");
      // Vary heights so the placeholder still demonstrates masonry.
      item.style.setProperty("--ph-h", `${180 + ((i * 47) % 160)}px`);
      img.remove();
    });
    grid.appendChild(item);
    // Stagger the reveal a touch for a nicer entrance.
    revealObserver.observe(item);
    item.addEventListener("click", () => openLightbox(i));
  });

  initLightbox();
})();

/* ---------------------- LIGHTBOX ---------------------- */
let lightboxIndex = 0;

function initLightbox() {
  const box = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => stepLightbox(-1));
  nextBtn.addEventListener("click", () => stepLightbox(1));

  // Click on the backdrop (but not the image) closes it.
  box.addEventListener("click", (e) => {
    if (e.target === box) closeLightbox();
  });

  // Keyboard controls.
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  document.getElementById("lightbox").classList.add("is-open");
  document.getElementById("lightbox").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("is-open");
  document.getElementById("lightbox").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function stepLightbox(dir) {
  lightboxIndex =
    (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
  updateLightbox();
}

function updateLightbox() {
  const photo = galleryImages[lightboxIndex];
  const img = document.getElementById("lightboxImg");
  const credit = document.getElementById("lightboxCredit");
  const link = document.getElementById("lightboxLink");

  img.src = IMG_PATH + photo.file;
  img.alt = photo.photographer
    ? `Split The Bill photo ${lightboxIndex + 1} - photo by ${photo.photographer}`
    : `Split The Bill photo ${lightboxIndex + 1}`;

  // Photographer credit.
  credit.textContent = photo.photographer
    ? `Photo by ${photo.photographer}`
    : "";

  // Link to the photographer's work (hidden if no URL provided).
  if (photo.url) {
    link.href = photo.url;
    link.hidden = false;
  } else {
    link.removeAttribute("href");
    link.hidden = true;
  }
}

/* =============================================================
   SCROLL REVEAL - observe all reveal elements once the DOM
   (including injected sections) is built.
   ============================================================= */
window.requestAnimationFrame(() => {
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
});

/* =============================================================
   DYNAMIC BACKGROUND - crossfade tied to visible section
   ============================================================= */
(function initBackground() {
  const stack = document.getElementById("bgStack");
  if (!stack) return;

  // Create one slide element per background image.
  const slides = backgrounds.map((file) => {
    const slide = document.createElement("div");
    slide.className = "bg-slide";
    slide.style.backgroundImage = `url('${IMG_PATH}${file}')`;
    stack.appendChild(slide);
    return slide;
  });

  // Resolve a section's data-bg (index or filename) to a slide index.
  const resolveBg = (value) => {
    if (value == null) return 0;
    const asNum = Number(value);
    if (!Number.isNaN(asNum) && backgrounds[asNum]) return asNum;
    const byName = backgrounds.indexOf(value);
    return byName >= 0 ? byName : 0;
  };

  let current = -1;
  const setActive = (index) => {
    if (index === current) return;
    current = index;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
  };

  // Watch which section is centered in the viewport.
  const sections = document.querySelectorAll(".section");
  const bgObserver = new IntersectionObserver(
    (entries) => {
      // Pick the most visible intersecting section.
      let best = null;
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          (!best || entry.intersectionRatio > best.intersectionRatio)
        ) {
          best = entry;
        }
      });
      if (best) setActive(resolveBg(best.target.dataset.bg));
    },
    { threshold: [0.25, 0.5, 0.75] }
  );

  sections.forEach((s) => bgObserver.observe(s));
  setActive(0); // show hero background immediately
})();

/* =============================================================
   ACTIVE NAV LINK HIGHLIGHT
   ============================================================= */
(function initActiveLink() {
  const map = {
    home: document.querySelector('.nav__link[href="#home"]'),
    videos: document.querySelector('.nav__link[href="#videos"]'),
    gallery: document.querySelector('.nav__link[href="#gallery"]'),
    about: document.querySelector('.nav__link[href="#about"]'),
  };

  // Map every section to the nav item it belongs to.
  const groupFor = (id) => {
    if (id === "home") return "home";
    if (id.startsWith("performance")) return "videos";
    if (id === "gallery") return "gallery";
    if (id === "about") return "about";
    return null;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = groupFor(entry.target.id);
        Object.values(map).forEach((l) => l && l.classList.remove("is-active"));
        if (group && map[group]) map[group].classList.add("is-active");
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".section").forEach((s) => observer.observe(s));
})();

/* =============================================================
   HELPERS
   ============================================================= */
function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
