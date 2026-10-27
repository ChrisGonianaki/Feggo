(function () {
  "use strict";

  // English translations. Greek is the default text written in index.html.
  var EN = {
    "nav.about": "Company",
    "nav.study": "Lighting design",
    "nav.projects": "Projects",
    "nav.process": "Process",
    "nav.contact": "Contact",

    "hero.eyebrow": "Lighting design · Custom luminaires",
    "hero.sub": "From architectural vision<br>to high-quality craftsmanship",
    "hero.cta": "Discuss your project",
    "hero.more": "Lighting design",
    "hero.hint": "Move the light",

    "about.years": "years of lighting expertise",
    "about.crete": "Design and production of custom luminaires in the company's own factory",
    "about.teamTitle": "One project, one team",
    "about.team": "Lighting design, production, inspection and delivery",

    "study.eyebrow": "Lighting design",
    "study.title": "Light is designed before it is built",
    "study.lead": "Technical selection of light sources, optics and positions before production.",
    "study.r1t": "Linear lighting",
    "study.r1": "seamless integration into the architecture",
    "study.r2t": "Accent and framing",
    "study.r2": "precise highlighting of objects and materials",
    "study.r3": "discreet general and functional light levels",
    "study.r4t": "Acoustic integration",
    "study.r4": "light and comfort in a single construction",
    "study.label": "Intensity",
    "study.color": "Light colour",
    "study.warm": "Warm white",
    "study.neutral": "White",
    "study.cool": "Cool white",
    "study.hint": "Choose a colour and drag to light the space",

    "services.title": "What FEGGO delivers",
    "services.s1t": "Custom luminaires",
    "services.s1": "Unique pieces made for a specific space, scale and aesthetic.",
    "services.s3t": "Special constructions",
    "services.s3": "Metal, wood, glass and composite materials.",
    "services.s4t": "Production and delivery",
    "services.s4": "Manufacturing, quality control and delivery.",

    "projects.title": "Selected projects",
    "projects.c1": "Architect: Stavros Peppas",
    "projects.c3": "Architecture office: Omikron Design Verde",
    "projects.c4": "Architecture office: Liakos & Associates Architects",
    "projects.c6": "Architect: Vangelis Chourdakis",


    "process.title": "From design to production",
    "process.p1": "Architectural intent",
    "process.p2": "Feasibility review",
    "process.p3": "Technical development",
    "process.p4": "Prototype and production",
    "process.p5": "Inspection and delivery",

    "contact.title": "Have a design<br>waiting to be realised?",
    "contact.sub": "Let's review the feasibility, the detail and the right way to build it — together.",
    "contact.addressLabel": "Address",
    "contact.address": "17 Ikarou Ave., Heraklion, Crete"
  };

  var META = {
    el: { description: "FEGGO: Φωτοτεχνική μελέτη και παραγωγή custom φωτιστικών στην Κρήτη. Από το αρχιτεκτονικό όραμα στην κατασκευή υψηλής ποιότητας." },
    en: { description: "FEGGO: lighting design and custom luminaires manufactured in Crete. From architectural vision to high-quality craftsmanship." }
  };

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Language ---------- */
  var nodes = document.querySelectorAll("[data-i18n]");
  var EL = {};
  nodes.forEach(function (n) { EL[n.getAttribute("data-i18n")] = n.innerHTML; });

  function setLang(lang) {
    var dict = lang === "en" ? EN : EL;
    nodes.forEach(function (n) {
      var key = n.getAttribute("data-i18n");
      if (dict[key] != null) n.innerHTML = dict[key];
    });
    document.documentElement.lang = lang;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", META[lang].description);
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    try { localStorage.setItem("feggo-lang", lang); } catch (e) {}
  }

  var initial = "el";
  try {
    var saved = localStorage.getItem("feggo-lang");
    if (saved === "el" || saved === "en") initial = saved;
  } catch (e) {}
  if (/[?&]lang=en\b/.test(location.search)) initial = "en";
  if (/[?&]lang=el\b/.test(location.search)) initial = "el";
  setLang(initial);

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Header and menu ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById("menuToggle");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- Hero: a light that drifts, or follows the pointer ---------- */
  var hero = document.getElementById("hero");
  var photo = hero.querySelector(".hero-photo");
  var IMG_W = 1332, IMG_H = 596;
  // A route along the ribbons (image pixels) that the light follows when nobody is pointing.
  var ROUTE = [[40, 330], [240, 255], [430, 150], [560, 70], [650, 150], [820, 300], [960, 360], [1120, 280], [1300, 140]];
  var heroVisible = true;
  var pointerActive = false;
  var cur = { x: 0.6, y: 0.3 };
  var target = { x: 0.6, y: 0.3 };
  var t0 = performance.now();

  // Position of an image pixel inside the hero photo box (matches background-size: cover).
  function imgToBox(ix, iy, r) {
    var scale = Math.max(r.width / IMG_W, r.height / IMG_H);
    var posX = parseFloat(getComputedStyle(photo.querySelector(".hero-layer")).backgroundPositionX) / 100;
    if (isNaN(posX)) posX = 0.5;
    return { x: ix * scale + (r.width - IMG_W * scale) * posX, y: iy * scale };
  }

  function routePoint(u) {
    var n = ROUTE.length - 1, f = u * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
    return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * k, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * k];
  }

  function paintLight() {
    var r = photo.getBoundingClientRect();
    hero.style.setProperty("--mx", (cur.x * r.width).toFixed(1) + "px");
    hero.style.setProperty("--my", (cur.y * r.height).toFixed(1) + "px");
  }

  function placeOnRoute(u) {
    var r = photo.getBoundingClientRect();
    var p = routePoint(u), b = imgToBox(p[0], p[1], r);
    target.x = b.x / r.width;
    target.y = b.y / r.height;
  }

  if (reduceMotion) {
    hero.style.setProperty("--r", "460px");
    placeOnRoute(0.4);
    cur.x = target.x; cur.y = target.y;
    paintLight();
    window.addEventListener("resize", function () { placeOnRoute(0.4); cur.x = target.x; cur.y = target.y; paintLight(); });
  } else {
    hero.addEventListener("pointermove", function (e) {
      var r = photo.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      pointerActive = true;
    });
    hero.addEventListener("pointerleave", function () { pointerActive = false; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    }

    (function frame(now) {
      if (heroVisible) {
        if (!pointerActive) placeOnRoute(0.5 + 0.5 * Math.sin((now - t0) / 1000 * 0.28 - 1.2));
        cur.x += (target.x - cur.x) * 0.06;
        cur.y += (target.y - cur.y) * 0.06;
        paintLight();
      }
      requestAnimationFrame(frame);
    })(t0);
  }

  /* ---------- Lighting study: choose lamp colour, drag the intensity ---------- */
  var dimmer = document.getElementById("dimmer");
  var dimOut = document.getElementById("dimOut");
  var stage = document.getElementById("studyPhoto");
  var mBase = document.getElementById("mBase");
  var mLit = document.getElementById("mLit");
  var mCore = document.getElementById("mCore");
  var layers = {
    lit: stage.querySelector(".ls-lit"),
    core: stage.querySelector(".ls-core"),
    bloom: stage.querySelector(".ls-bloom")
  };
  // Per-channel gains that move the photo's warm light to each lamp colour,
  // plus the colour of the glow.
  var TONES = {
    warm:  { gain: [1.00, 1.00, 1.00], glow: "255,176,86" },
    white: { gain: [0.95, 1.04, 1.10], glow: "255,240,224" },
    cool:  { gain: [0.83, 1.03, 1.42], glow: "200,222,255" }
  };
  var tone = "warm";
  var level = 12;
  var userTouched = false;

  function matrix(el, g, b) {
    el.setAttribute("values",
      (g[0] * b).toFixed(3) + " 0 0 0 0 0 " + (g[1] * b).toFixed(3) + " 0 0 0 0 0 " + (g[2] * b).toFixed(3) + " 0 0 0 0 0 1 0");
  }

  function render() {
    var s = level / 100;
    var g = TONES[tone].gain;
    matrix(mBase, g, 0.05 + 0.8 * Math.pow(s, 1.1));
    matrix(mLit, g, 0.4 + 0.75 * s);
    matrix(mCore, g, 1.25);
    layers.lit.style.opacity = Math.pow(s, 0.9).toFixed(3);
    layers.core.style.opacity = Math.pow(s, 0.7).toFixed(3);
    layers.bloom.style.opacity = (0.3 * s).toFixed(3);
    stage.style.setProperty("--l", s.toFixed(3));
    stage.style.setProperty("--lamp", TONES[tone].glow);
    dimmer.style.setProperty("--fill", level + "%");
    dimOut.textContent = Math.round(level) + "%";
    dimmer.value = level;
  }

  function setLevel(v) { level = Math.max(0, Math.min(100, v)); render(); }

  dimmer.addEventListener("input", function () { userTouched = true; setLevel(Number(dimmer.value)); });
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      userTouched = true;
      tone = chip.getAttribute("data-tone");
      document.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      if (level < 35) setLevel(70); else render();
    });
  });
  render();

  // The lights come on once when the section scrolls into view.
  if (!reduceMotion && "IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (es, obs) {
      if (!es[0].isIntersecting || started) return;
      started = true;
      obs.disconnect();
      var from = level, to = 78, dur = 2200, s0 = performance.now();
      (function step(now) {
        if (userTouched) return;
        var p = Math.min(1, (now - s0) / dur);
        setLevel(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(s0);
    }, { threshold: 0.45 }).observe(stage);
  } else if (reduceMotion) {
    setLevel(78);
  }

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
