document.documentElement.classList.add("js");

/* Sections and cards fade in as they scroll into view */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* Nav gets a thin line once you scroll */
const nav = document.querySelector("nav");
const onNav = () => nav.classList.toggle("scrolled", scrollY > 8);
onNav(); addEventListener("scroll", onNav, { passive: true });

/* Hero glides away as you scroll: it fades, drifts and shrinks slightly */
const hero = document.querySelector(".hero-grid");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (hero && !reduce) {
  const photo = hero.querySelector(".photo");
  let ticking = false;
  const update = () => {
    const p = Math.min(Math.max(scrollY / (innerHeight * 0.75), 0), 1);
    hero.style.opacity = 1 - p;
    hero.style.transform = `translateY(${p * 70}px) scale(${1 - p * 0.04})`;
    if (photo) photo.style.transform = `translateY(${p * 30}px)`;   /* photo drifts a touch faster */
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* Light follows the pointer across glass surfaces */
document.querySelectorAll(".glass, .card, .photo, nav .wrap").forEach(el => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

/* Top bar glides away when scrolling down and returns when scrolling up */
let lastY = scrollY, navTick = false;
addEventListener("scroll", () => {
  if (navTick) return;
  navTick = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    if (y < 80 || y < lastY - 4) nav.classList.remove("hide");
    else if (y > lastY + 4) nav.classList.add("hide");
    lastY = y;
    navTick = false;
  });
}, { passive: true });
