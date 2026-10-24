(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const header = $(".site-header");
  const progress = $("#scrollProgress");
  const menu = $("#menuToggle");
  const navLinks = $("#navLinks");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 15);
    if (progress) {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    if (!menu || !navLinks) return;
    navLinks.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menu");
  }
  if (menu && navLinks) {
    menu.addEventListener("click", () => {
      const open = !navLinks.classList.contains("open");
      navLinks.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    $$("#navLinks a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!navLinks.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
  }

  const revealElements = $$(".reveal");
  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    revealElements.forEach(el => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealElements.forEach(el => observer.observe(el));
  }

  const filterButtons = $$(".filter[data-filter]");
  const cards = $$(".project-card[data-category]");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      cards.forEach(card => {
        const matches = category === "all" || card.dataset.category === category;
        card.hidden = !matches;
        if (matches) card.classList.add("is-visible");
      });
    });
  });

  const showcase = $(".tilt-card");
  const heroArt = $(".hero-art");
  if (showcase && heroArt && finePointer.matches && !reducedMotion.matches) {
    heroArt.addEventListener("pointermove", event => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      showcase.style.transform = "rotate(-3deg) rotateY(" + (x * 7).toFixed(2) + "deg) rotateX(" + (-y * 6).toFixed(2) + "deg) translateY(-4px)";
    }, { passive: true });
    heroArt.addEventListener("pointerleave", () => { showcase.style.transform = ""; });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mantém a navegação simples e previsível: nenhum formulário envia dados sem consentimento.
})();