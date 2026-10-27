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

    // Each ribbon of the installation is its own lane: a centre line (image pixels) and its half thickness.
    var LANES = [
      [[0, 247, 62], [100, 224, 66], [200, 190, 70], [300, 152, 72], [400, 112, 72], [470, 70, 66], [525, 28, 50], [552, -10, 40]],
      [[585, 175, 56], [620, 130, 60], [680, 96, 60], [760, 68, 56], [860, 45, 46], [960, 30, 40], [1085, 12, 34]],
      [[110, 348, 58], [200, 338, 62], [300, 324, 66], [400, 310, 66], [500, 296, 60], [600, 276, 60], [700, 242, 58], [790, 205, 50]],
      [[40, 520, 40], [250, 525, 42], [400, 522, 44], [550, 507, 42], [700, 490, 42], [820, 470, 44], [900, 442, 52], [960, 402, 58], [1010, 352, 66], [1070, 312, 70], [1150, 276, 72], [1250, 236, 72], [1340, 192, 70]]
    ].map(function (pts) {
      var dense = [], len = [0];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        for (var k = 0; k < 16; k++) {
          var t = k / 16, t2 = t * t, t3 = t2 * t, row = [];
          for (var d = 0; d < 3; d++) {
            row.push(0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3));
          }
          dense.push(row);
        }
      }
      dense.push(pts[pts.length - 1].slice());
      for (var m = 1; m < dense.length; m++) len.push(len[m - 1] + Math.hypot(dense[m][0] - dense[m - 1][0], dense[m][1] - dense[m - 1][1]));
      return { pts: dense, len: len, total: len[len.length - 1] };
    });

    function laneAt(lane, s) {
      var d = Math.max(0, Math.min(lane.total, s)), i = 1;
      while (i < lane.len.length - 1 && lane.len[i] < d) i++;
      var span = lane.len[i] - lane.len[i - 1] || 1, k = (d - lane.len[i - 1]) / span, a = lane.pts[i - 1], b = lane.pts[i];
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }

    // Resting state: every line is on, and its brightness ripples gently along the ribbons.
    var ANG = -18 * Math.PI / 180, DX = Math.cos(ANG), DY = Math.sin(ANG);
    var RIPPLE_L = 2300, RIPPLE_LAMBDA = 340, RIPPLE_SPEED = reduceMotion ? 40 : 95;   // image px, px/s

    function ripple(t) {
      var cx = W / 2, cy = H / 2, half = RIPPLE_L / 2 * S;
      var g = mctx.createLinearGradient(cx - DX * half, cy - DY * half, cx + DX * half, cy + DY * half);
      var steps = Math.round(RIPPLE_L / RIPPLE_LAMBDA * 12);
      var ph = t * RIPPLE_SPEED / RIPPLE_LAMBDA * Math.PI * 2;
      for (var i = 0; i <= steps; i++) {
        var f = i / steps, a = f * RIPPLE_L / RIPPLE_LAMBDA * Math.PI * 2;
        var v = 0.3 + 0.13 * Math.sin(a - ph) + 0.06 * Math.sin(a * 0.55 + ph * 0.6 + 1.3);
        g.addColorStop(f, "rgba(255,255,255," + Math.max(0, Math.min(1, v)).toFixed(3) + ")");
      }
      mctx.fillStyle = g;
      mctx.fillRect(0, 0, W, H);
    }

    var SIGMA = 105;                                // width of the wave crest along a ribbon
    var speed = reduceMotion ? 170 : 430;           // image px per second
    var laneIx = 0, sCur = -250, wait = 0.5, amp = 0, ampTarget = 1;
    var pointerActive = false, pointerLane = 0, pointerS = 0, lastMove = 0;
    var last = performance.now();

    function nearestLane(clientX, clientY) {
      var ix = ((clientX - boxLeft) * DPR - OFFX) / S, iy = ((clientY - boxTop) * DPR) / S, best = { d: 1e9, lane: 0, s: 0 };
      LANES.forEach(function (lane, li) {
        for (var i = 0; i < lane.pts.length; i += 2) {
          var p = lane.pts[i], dd = Math.hypot(ix - p[0], (iy - p[1]) * 0.8);
          if (dd < best.d) best = { d: dd, lane: li, s: lane.len[i] };
        }
      });
      return best;
    }

    hero.addEventListener("pointermove", function (e) {
      var n = nearestLane(e.clientX, e.clientY);
      if (!pointerActive || n.lane !== pointerLane) { pointerLane = n.lane; sCur = n.s; amp = 0; }
      pointerS = n.s;
      pointerActive = true;
      lastMove = performance.now();
    });
    hero.addEventListener("pointerleave", function () { pointerActive = false; laneIx = pointerLane; sCur = pointerS; wait = 0.2; });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    }

    // Soft glow along one ribbon: a main crest with smaller ripples trailing behind it.
    function wave(lane, s0, strength) {
      if (strength < 0.01) return;
      var from = Math.max(0, s0 - 700), to = Math.min(lane.total, s0 + 330);
      for (var s = from; s <= to; s += 15) {
        var x = s - s0;
        var prof = Math.exp(-(x * x) / (SIGMA * SIGMA))
          + 0.5 * Math.exp(-((x + 260) * (x + 260)) / (SIGMA * SIGMA * 1.3))
          + 0.24 * Math.exp(-((x + 520) * (x + 520)) / (SIGMA * SIGMA * 1.6));
        var a = Math.min(1, prof) * strength * 0.32;
        if (a < 0.004) continue;
        var p = laneAt(lane, s), cx = p[0] * S + OFFX, cy = p[1] * S, r = p[2] * 1.25 * S;
        var g = mctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, "rgba(255,255,255," + a.toFixed(3) + ")");
        g.addColorStop(0.6, "rgba(255,255,255," + (a * 0.55).toFixed(3) + ")");
        g.addColorStop(1, "rgba(255,255,255,0)");
        mctx.fillStyle = g;
        mctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }

    (function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (heroVisible && linesReady) {
        // If nobody has moved for a moment (or a finger lifted), the wave carries on by itself.
        if (pointerActive && now - lastMove > 2000) { pointerActive = false; laneIx = pointerLane; sCur = pointerS; wait = 0.2; }
        var lane;
        if (pointerActive) {
          lane = LANES[pointerLane];
          sCur += (pointerS - sCur) * 0.16;
          ampTarget = 1;
        } else {
          lane = LANES[laneIx];
          if (wait > 0) {
            wait -= dt;
            ampTarget = 0;
            if (wait <= 0) { sCur = -250; ampTarget = 1; }
          } else {
            sCur += speed * dt;
            if (sCur > lane.total + 330) { laneIx = (laneIx + 1) % LANES.length; wait = 0.35; ampTarget = 0; }
          }
        }
        amp += (ampTarget - amp) * Math.min(1, dt * 7);

        mctx.setTransform(1, 0, 0, 1, 0, 0);
        mctx.clearRect(0, 0, W, H);
        mctx.globalCompositeOperation = "source-over";
        ripple(now / 1000);
        mctx.globalCompositeOperation = "lighter";
        wave(lane, sCur, amp);

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(lines, OFFX, 0, IMG_W * S, IMG_H * S);
        ctx.globalCompositeOperation = "destination-in";     // keep the strands only where the wave is
        ctx.drawImage(mask, 0, 0);
        ctx.globalCompositeOperation = "source-atop";        // warm gold
        ctx.fillStyle = "rgba(226,160,70,.45)";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";            // brighter than the resting lines
        ctx.globalAlpha = 0.5;
        ctx.drawImage(canvas, 0, 0);
        ctx.globalAlpha = 1;
        gctx.clearRect(0, 0, glow.width, glow.height);       // soft bloom around the lit strands
        gctx.drawImage(canvas, 0, 0, glow.width, glow.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.7;
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
