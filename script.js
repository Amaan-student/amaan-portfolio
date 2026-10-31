/* ===== EDIT THESE: leave empty to hide that link/feature ===== */
const CONFIG = {
  email: "",                 // e.g. "yourname@gmail.com"
  linkedin: "",              // full URL of your LinkedIn profile
  x: "",                     // full URL of your X profile
  formEndpoint: ""           // Formspree URL, e.g. "https://formspree.io/f/xxxxxxx"
};

/* ---------- Theme (dark by default) ---------- */
const body = document.body;
const themeIcon = document.getElementById("themeIcon");
function applyTheme(dark) {
  body.classList.toggle("dark-mode", dark);
  themeIcon.className = dark ? "fas fa-sun" : "fas fa-moon";
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
applyTheme(saved !== "light");
document.getElementById("themeToggle").addEventListener("click", () => {
  const dark = !body.classList.contains("dark-mode");
  applyTheme(dark);
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
});

/* ---------- Mobile menu ---------- */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
function toggleMenu() { hamburger.classList.toggle("active"); navMenu.classList.toggle("active"); }
function closeMenu() { hamburger.classList.remove("active"); navMenu.classList.remove("active"); }
hamburger.addEventListener("click", toggleMenu);
hamburger.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMenu(); } });
navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
document.addEventListener("click", e => {
  if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
});

/* ---------- Typing effect ---------- */
const roles = ["Amaan Khan", "a BCA Student", "a Full-Stack Developer", "Co-founder of CodeMates"];
const typingEl = document.getElementById("typing");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  let r = 0, c = roles[0].length, deleting = true;
  (function tick() {
    const word = roles[r];
    typingEl.textContent = word.slice(0, c);
    let delay = deleting ? 45 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    else { c += deleting ? -1 : 1; }
    setTimeout(tick, delay);
  })();
}

/* ---------- Particles ---------- */
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  let w, h, pts = [];
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: Math.min(60, Math.floor(w / 25)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,186,255,.6)";
    ctx.strokeStyle = "rgba(0,186,255,.12)";
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.283); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
        if (d < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  }
  resize(); draw();
  window.addEventListener("resize", resize);
})();

/* ---------- Config-driven links ---------- */
function setLink(id, href, hideId) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = document.getElementById(hideId || id);
  if (!href) { target.hidden = true; return; }
  el.href = href; target.hidden = false;
}
setLink("lnLinkedin", CONFIG.linkedin);
setLink("lnX", CONFIG.x);
if (CONFIG.email) {
  const a = document.getElementById("emailLink");
  a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email;
  document.getElementById("emailItem").hidden = false;
}

/* ---------- Contact form ---------- */
document.getElementById("contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const status = document.getElementById("formStatus");
  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim()
  };
  if (CONFIG.formEndpoint) {
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      status.textContent = "Message sent. I'll reply soon.";
      e.target.reset();
    } catch (err) {
      status.textContent = "Could not send the message. Please try again or use the links here.";
    }
  } else if (CONFIG.email) {
    location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Portfolio message from " + data.name) +
      "&body=" + encodeURIComponent(data.message + "\n\n" + data.email);
  } else {
    status.textContent = "The contact form is not connected yet. Please use the GitHub link.";
  }
});

/* ---------- Misc ---------- */
const backBtn = document.getElementById("backToTop");
function scrollToTop() { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }
backBtn.addEventListener("click", scrollToTop);
window.addEventListener("scroll", () => backBtn.classList.toggle("visible", window.scrollY > 500));
document.getElementById("year").textContent = new Date().getFullYear();
