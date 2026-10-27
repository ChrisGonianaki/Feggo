(function () {
  "use strict";

  // English translations. Greek is the default text written in index.html.
  var EN = {
    "nav.about": "Company",
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.materials": "Materials",
    "nav.applications": "Applications",
    "nav.contact": "Contact",

    "hero.sub": "From architectural vision<br>to high-quality craftsmanship",
    "hero.cta": "Discuss your project",
    "hero.more": "What we do",

    "about.title": "FEGGO at a glance",
    "about.years": "years of lighting expertise",
    "about.crete": "Design and production of custom luminaires in the company's own factory",
    "about.teamTitle": "One project, one team",
    "about.team": "Lighting design, technical development, production, inspection, delivery and after-sales",
    "about.statement": "FEGGO turns architectural intent into precision manufacturing, from the first sketch to the final detail.",

    "services.title": "What FEGGO delivers",
    "services.s1t": "Custom luminaires",
    "services.s1": "Unique pieces made for a specific space, scale and aesthetic.",
    "services.s2t": "Lighting design",
    "services.s2": "Technical selection of light sources, optics and positions before production.",
    "services.s3t": "Special constructions",
    "services.s3": "Metal, wood, glass and composite materials, developed together with the design.",
    "services.s4t": "Production and delivery",
    "services.s4": "Manufacturing, quality control and preparation for delivery.",

    "process.title": "From design to production",
    "process.p1": "Architectural intent",
    "process.p2": "Feasibility review",
    "process.p3": "Technical development",
    "process.p4": "Prototype and production",
    "process.p5": "Inspection and delivery",
    "process.calloutTitle": "The critical moment comes before production",
    "process.callout": "The team reviews dimensions, materials, thermal behaviour, visual comfort, driver access and maintainability. Timelines are committed realistically.",

    "craft.title": "Built with technical discipline",
    "craft.eng": "Every detail is examined before it goes into production.",
    "craft.craft": "The craftsman's experience complements engineering precision.",
    "craft.integrity": "When a solution cannot be built properly, we say so early and propose an alternative.",

    "system.title": "Custom as a unified system",
    "system.lead": "One architectural language can serve different functions without visual discontinuity.",
    "system.r1t": "Linear lighting",
    "system.r1": "seamless integration into the architecture",
    "system.r2t": "Accent and framing",
    "system.r2": "precise highlighting of objects and materials",
    "system.r3": "discreet general and functional light levels",
    "system.r4t": "Acoustic integration",
    "system.r4": "light and comfort in a single construction",

    "materials.title": "Materials, finishes and scale",
    "materials.m1t": "Metal",
    "materials.m1": "Curves, profiles, suspensions and special mounts with controlled tolerances.",
    "materials.m2t": "Glass and diffusion",
    "materials.m2": "Materiality and luminous comfort are designed together.",
    "materials.m3t": "Wood and composites",
    "materials.m3": "Combinations for projects that call for a specific texture, weight or acoustic performance.",

    "io.title": "Indoor and outdoor, one identity",
    "io.lead": "Aesthetic continuity demands different technical construction.",
    "io.r1t": "Interior",
    "io.r1": "visual comfort, accurate material rendering, glare control",
    "io.r2t": "Exterior",
    "io.r2": "water tightness, mechanical strength, operating temperatures",
    "io.r3t": "Seaside projects",
    "io.r3": "anti-corrosion treatment, fasteners, wiring, salt spray test",
    "io.note": "For villas, boutique hotels, resorts, restaurants and public spaces",

    "tech.title": "Technology that serves the project",
    "tech.t1": "A smaller visible footprint with proper glare control and service access.",
    "tech.t1tag": "Optics · tolerances",
    "tech.t2": "Scenes, sensors and dynamic light, checked for compatibility and cloud dependency.",
    "tech.t2tag": "Protocol · commissioning",
    "tech.t3": "Replaceable driver, LED module and spare parts wherever the construction allows.",
    "tech.t3tag": "Service · lifespan",

    "apps.title": "Where custom adds value",
    "apps.a1": "statement luminaires, guest rooms, reception, restaurants",
    "apps.a2t": "Premium residential",
    "apps.a2": "staircases, dining rooms, special lengths and finishes",
    "apps.a3t": "Retail and art",
    "apps.a3": "framing, accent, light installations and brand moments",
    "apps.a4t": "Outdoor and landscape",
    "apps.a4": "entrances, pathways, pergolas and wayfinding elements",
    "apps.closing": "Lighting shapes a space's identity, its night-time image and the way it is experienced.",

    "arch.title": "What the architect gains",
    "arch.b1t": "Fidelity to intent",
    "arch.b1": "The design evolves technically without losing its character.",
    "arch.b2t": "Realistic decisions, early",
    "arch.b2": "Feasibility, cost, time and maintenance are discussed before commitment.",
    "arch.b3t": "One accountable partner",
    "arch.b3": "The team connects design, production, quality control and delivery.",
    "arch.quote": "Collaboration succeeds when the detail is solved before it reaches the site.",

    "contact.title": "Have a design<br>waiting to be realised?",
    "contact.sub": "Let's review the feasibility, the detail and the right way to build it — together.",
    "contact.addressLabel": "Address",
    "contact.address": "17 Ikarou Ave., Heraklion, Crete"
  };

  var META = {
    el: {
      title: "FEGGO — Custom designs come to light",
      description: "FEGGO: Σχεδιασμός και παραγωγή custom φωτιστικών στην Κρήτη. Από το αρχιτεκτονικό όραμα στην κατασκευή υψηλής ποιότητας."
    },
    en: {
      title: "FEGGO — Custom designs come to light",
      description: "FEGGO: custom lighting designed and manufactured in Crete. From architectural vision to high-quality craftsmanship."
    }
  };

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
    document.title = META[lang].title;
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

  // Header background on scroll
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
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

  // Reveal on scroll
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
