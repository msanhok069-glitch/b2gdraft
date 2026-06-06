/* ═══════════════════════════════════════════════
   B2GROWTH MEDIA — SCRIPT.JS
   Interactions: Nav, Mobile Menu, FAQ, Counters,
   Scroll Reveal, Form Submit
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     PRELOADER / OPENING ANIMATION
  ══════════════════════════════════════════ */
  const preloader  = document.getElementById('preloader');
  const barEl      = document.getElementById('preloaderBar');

  // 9s CSS animation — JS timer synced to match
  let progress = 0;
  const totalDuration = 9000;
  const interval      = 18;
  const steps         = totalDuration / interval;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  let tick = 0;
  const timer = setInterval(() => {
    tick++;
    const t = Math.min(tick / steps, 1);
    progress = Math.floor(easeOutCubic(t) * 100);
    barEl.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('open');
        document.body.classList.remove('loading');
        setTimeout(() => { preloader.classList.add('done'); }, 1000);
      }, 300);
    }
  }, interval);

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── FAQ ACCORDION ── */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq__q');
    const answer = item.querySelector('.faq__a');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(i => {
        i.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq__a').classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.section-label, .hero__content, .hero__image-row, ' +
    '.about-strip__grid, .about-strip__logos, ' +
    '.work__header, .work__card, ' +
    '.services__header, .services__tags, .services__item, ' +
    '.profile__grid, ' +
    '.experience__title-wrap, .experience__grid, ' +
    '.testimonials__card, ' +
    '.stats__item, .stats__banner, ' +
    '.pricing__title-wrap, .pricing__card, ' +
    '.faq__grid, ' +
    '.contact__grid'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings in same parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx === 1) el.classList.add('reveal-delay-1');
    if (idx === 2) el.classList.add('reveal-delay-2');
    if (idx === 3) el.classList.add('reveal-delay-3');
    if (idx >= 4)  el.classList.add('reveal-delay-4');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stats__num[data-target]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step   = 16;
      const steps  = duration / step;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);

      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));

  /* ── CONTACT FORM ── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form__submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate async send
      setTimeout(() => {
        form.reset();
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  /* ── SMOOTH ANCHOR SCROLL (offset for fixed nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── CURSOR GLOW (subtle) ── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,184,160,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });

  /* ── SERVICES ITEM HOVER EXPAND ── */
  const serviceItems = document.querySelectorAll('.services__item');
  serviceItems.forEach(item => {
    const p = item.querySelector('p');
    if (p) {
      p.style.maxHeight = '0';
      p.style.overflow  = 'hidden';
      p.style.transition = 'max-height 0.4s ease, opacity 0.3s ease';
      p.style.opacity   = '0';

      item.addEventListener('mouseenter', () => {
        p.style.maxHeight = '200px';
        p.style.opacity   = '1';
      });
      item.addEventListener('mouseleave', () => {
        p.style.maxHeight = '0';
        p.style.opacity   = '0';
      });
    }
  });

  /* ── WORK CARD TILT ── */
  const workCards = document.querySelectorAll('.work__card');
  workCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── PRICING CARD HOVER LIFT ── */
  const pricingCards = document.querySelectorAll('.pricing__card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
      card.style.transition = 'transform 0.3s ease, background 0.3s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});


/* ============================================================
   WORD / LINE REVEAL  (GSAP + ScrollTrigger)
   ============================================================ */
(function initWordReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* Wrap a single element's inner HTML in a .word-inner span */
  function wrapInner(el) {
    el.innerHTML = '<span class="word-inner">' + el.innerHTML + '</span>';
    return el.querySelector('.word-inner');
  }

  /* Split element text into word-wrap > word-inner spans */
  function splitWords(el) {
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    el.innerHTML = words.map(function(w) {
      return '<span class="word-wrap"><span class="word-inner">' + w + '</span></span>';
    }).join(' ');
    return el.querySelectorAll('.word-inner');
  }

  /* 1. HERO headline — each .line slides up on load */
  var heroLines = document.querySelectorAll('.hero__headline .line');
  heroLines.forEach(function(line, i) {
    var inner = wrapInner(line);
    gsap.from(inner, {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out',
      delay: 0.7 + i * 0.15
    });
  });

  /* 2. Big section h2 headings — word by word on scroll */
  var headings = document.querySelectorAll(
    '.about-strip__headline, .services__title, ' +
    '.experience__big-title, .pricing__big-title, .contact__headline'
  );
  headings.forEach(function(el) {
    var words = splitWords(el);
    gsap.from(words, {
      yPercent: 100,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* 3. Service card h3s */
  var serviceH3s = document.querySelectorAll('.service-card h3');
  serviceH3s.forEach(function(el) {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none'
      }
    });
  });

})();
