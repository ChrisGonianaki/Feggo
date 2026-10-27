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
  var canvas = document.getElementById("heroWave");
  var IMG_W = 1332, IMG_H = 596;
  var ctx = canvas.getContext && canvas.getContext("2d");
  var heroVisible = true;

  if (ctx) {
    var lines = new Image();
    var linesReady = false;
    lines.onload = function () { linesReady = true; };
    lines.src = canvas.getAttribute("data-lines");

    var mask = document.createElement("canvas"), mctx = mask.getContext("2d");
    var glow = document.createElement("canvas"), gctx = glow.getContext("2d");
    var W = 1, H = 1, S = 1, OFFX = 0, DPR = 1, boxLeft = 0, boxTop = 0;

    function measure() {
      var r = photo.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 1.25);
      W = Math.max(1, Math.round(r.width * DPR));
      H = Math.max(1, Math.round(r.height * DPR));
      canvas.width = mask.width = W;
      canvas.height = mask.height = H;
      glow.width = Math.max(1, Math.round(W / 6));
      glow.height = Math.max(1, Math.round(H / 6));
      var posX = parseFloat(getComputedStyle(hero.querySelector(".hero-layer")).backgroundPositionX) / 100;
      if (isNaN(posX)) posX = 0.5;
      S = Math.max(W / IMG_W, H / IMG_H);
      OFFX = (W - IMG_W * S) * posX;
      boxLeft = r.left; boxTop = r.top;
    }
    measure();
    window.addEventListener("resize", measure);

    // The wave runs along the ribbons: their direction is about 18 degrees uphill.
    var ANG = -18 * Math.PI / 180;
    var DX = Math.cos(ANG), DY = Math.sin(ANG);     // along the ribbons
    var PX = -DY, PY = DX;                          // across them (the wave front)
    var U_MIN = -420, U_MAX = 1450;                 // extent of the installation along its length
    var speed = reduceMotion ? 160 : 330;           // image px per second
    var u0 = U_MIN, wait = 0.6;
    var pointerActive = false, pointerU = 0, uCur = U_MIN, amp = 0, ampTarget = 1, lastMove = 0;
    var last = performance.now();

    function pointerToU(clientX, clientY) {
      var ix = ((clientX - boxLeft) * DPR - OFFX) / S, iy = ((clientY - boxTop) * DPR) / S;
      return ix * DX + iy * DY;
    }

    hero.addEventListener("pointermove", function (e) {
      pointerU = pointerToU(e.clientX, e.clientY);
      if (!pointerActive) uCur = pointerU;
      pointerActive = true;
      lastMove = performance.now();
    });
    hero.addEventListener("pointerleave", function () { pointerActive = false; u0 = uCur; wait = 0.4; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    }

    // One soft wave front: a wavy line across the ribbons, stroked from wide and faint to thin and strong.
    function crest(u, strength, phase, t) {
      if (strength < 0.01) return;
      var pts = [];
      for (var s = -760; s <= 760; s += 40) {
        var warp = 46 * Math.sin(s / 120 + phase + t * 1.2);
        var ix = DX * (u + warp) + PX * s + IMG_W * 0.5 - DX * 560;
        var iy = DY * (u + warp) + PY * s + IMG_H * 0.5 - DY * 560;
        pts.push([ix * S + OFFX, iy * S]);
      }
      var W0 = 230 * S;
      for (var k = 0; k < 7; k++) {
        mctx.lineWidth = W0 * (1 - k / 7);
        mctx.strokeStyle = "rgba(255,255,255," + (strength * 0.2).toFixed(3) + ")";
        mctx.beginPath();
        for (var i = 0; i < pts.length; i++) { if (i) mctx.lineTo(pts[i][0], pts[i][1]); else mctx.moveTo(pts[i][0], pts[i][1]); }
        mctx.stroke();
      }
    }

    (function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (heroVisible && linesReady) {
        var t = now / 1000;
        // If nobody has moved for a moment (or a finger lifted), the wave carries on by itself.
        if (pointerActive && now - lastMove > 2000) { pointerActive = false; u0 = uCur; wait = 0.3; }
        if (pointerActive) {
          uCur += (pointerU - uCur) * 0.14;
          ampTarget = 1;
        } else if (wait > 0) {
          wait -= dt;
          ampTarget = 0;
          if (wait <= 0) { uCur = U_MIN; ampTarget = 1; }
        } else {
          uCur += speed * dt;
          if (uCur > U_MAX) { wait = 1.1; ampTarget = 0; }
        }
        amp += (ampTarget - amp) * Math.min(1, dt * 6);

        mctx.setTransform(1, 0, 0, 1, 0, 0);
        mctx.clearRect(0, 0, W, H);
        mctx.globalCompositeOperation = "lighter";
        mctx.lineCap = "round"; mctx.lineJoin = "round";
        // leading crest, then smaller ripples behind it
        crest(uCur, amp, 0, t);
        crest(uCur - 300, amp * 0.5, 1.7, t);
        crest(uCur - 600, amp * 0.22, 3.1, t);

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(lines, OFFX, 0, IMG_W * S, IMG_H * S);
        ctx.globalCompositeOperation = "destination-in";     // keep the strands only where the wave is
        ctx.drawImage(mask, 0, 0);
        ctx.globalCompositeOperation = "source-atop";        // warm gold
        ctx.fillStyle = "rgba(226,160,70,.42)";
        ctx.fillRect(0, 0, W, H);
        gctx.clearRect(0, 0, glow.width, glow.height);       // soft bloom around the lit strands
        gctx.drawImage(canvas, 0, 0, glow.width, glow.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.9;
        ctx.drawImage(glow, 0, 0, W, H);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      requestAnimationFrame(frame);
    })(last);
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
