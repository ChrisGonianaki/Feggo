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

  /* ---------- Projects carousel dots (phones) ---------- */
  var track = document.querySelector(".projects");
  var dotsBox = document.getElementById("projectDots");
  if (track && dotsBox) {
    var cards = track.querySelectorAll(".project");
    cards.forEach(function (card, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Project " + (i + 1));
      d.addEventListener("click", function () { track.scrollTo({ left: card.offsetLeft - track.offsetLeft - 20, behavior: "smooth" }); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll("button");
    function syncDots() {
      var first = cards[0].offsetLeft - track.offsetLeft;
      var step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      var i = Math.round((track.scrollLeft + 20 - (first - 0)) / step);
      i = Math.max(0, Math.min(cards.length - 1, i));
      dots.forEach(function (d, k) { d.setAttribute("aria-current", String(k === i)); });
    }
    track.addEventListener("scroll", syncDots, { passive: true });
    window.addEventListener("resize", syncDots);
    syncDots();
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
