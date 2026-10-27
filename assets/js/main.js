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
    "study.label": "Light",
    "study.hint": "Drag to light the space",

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

    "craft.title": "Built with technical discipline",
    "craft.eng": "Every detail is examined before it goes into production.",
    "craft.craft": "The craftsman's experience complements engineering precision.",

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
  var heroVisible = true;
  var pointerActive = false;
  var target = { x: 0.6, y: 0.38 };
  var cur = { x: 0.6, y: 0.38 };
  var t0 = performance.now();

  function paintLight() {
    var r = photo.getBoundingClientRect();
    hero.style.setProperty("--mx", (cur.x * r.width).toFixed(1) + "px");
    hero.style.setProperty("--my", (cur.y * r.height).toFixed(1) + "px");
  }

  if (reduceMotion) {
    hero.style.setProperty("--r", "520px");
    paintLight();
    window.addEventListener("resize", paintLight);
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
        if (!pointerActive) {
          var t = (now - t0) / 1000;
          target.x = 0.52 + 0.38 * Math.sin(t * 0.32);
          target.y = 0.36 + 0.2 * Math.sin(t * 0.51 + 1.2);
        }
        cur.x += (target.x - cur.x) * 0.07;
        cur.y += (target.y - cur.y) * 0.07;
        paintLight();
      }
      requestAnimationFrame(frame);
    })(t0);
  }

  /* ---------- Lighting study: drag the light level ---------- */
  var dimmer = document.getElementById("dimmer");
  var dimOut = document.getElementById("dimOut");
  var studyPhoto = document.getElementById("studyPhoto");
  var userTouched = false;

  function setLevel(v) {
    var n = Math.max(0, Math.min(100, v));
    studyPhoto.style.setProperty("--l", (n / 100).toFixed(3));
    dimmer.style.setProperty("--fill", n + "%");
    dimOut.textContent = Math.round(n) + "%";
    dimmer.value = n;
  }
  setLevel(Number(dimmer.value));
  dimmer.addEventListener("input", function () { userTouched = true; setLevel(Number(dimmer.value)); });

  // The lights come on once when the section scrolls into view.
  if (!reduceMotion && "IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (es, obs) {
      if (!es[0].isIntersecting || started) return;
      started = true;
      obs.disconnect();
      var from = Number(dimmer.value), to = 72, dur = 2200, s = performance.now();
      (function step(now) {
        if (userTouched) return;
        var p = Math.min(1, (now - s) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        setLevel(from + (to - from) * e);
        if (p < 1) requestAnimationFrame(step);
      })(s);
    }, { threshold: 0.45 }).observe(studyPhoto);
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
