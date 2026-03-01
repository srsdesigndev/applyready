/* main.js — Job Lens Landing Page */

(function () {
  'use strict';

  // ── NAVBAR SCROLL SHADOW ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ── MOBILE HAMBURGER ──────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // animate bars
    const bars = hamburger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      bars[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
      bars[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => b.style.cssText = '');
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(b => b.style.cssText = '');
    });
  });


  // ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ── SCROLL REVEAL ─────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  // ── TICKER DUPLICATE (seamless loop) ─────────────────────────────
  const track = document.getElementById('tickerTrack');
  if (track) {
    // Clone the content and append for seamless infinite scroll
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
  }


  // ── OUTREACH TABS ─────────────────────────────────────────────────
  const outTabs = document.querySelectorAll('.out-tab');
  const outCards = document.querySelectorAll('.out-card');

  outTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      outTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show matching card
      outCards.forEach(card => {
        if (card.id === `tab-${target}`) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ── COPY TO CLIPBOARD ─────────────────────────────────────────────
  window.copyText = function (btn) {
    const card = btn.closest('.out-card');
    const body = card.querySelector('.out-card-body');
    const text = body.innerText.trim();

    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy to clipboard';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy to clipboard';
        btn.classList.remove('copied');
      }, 2000);
    });
  };


  // ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────────
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.style.color = '';
            link.style.background = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--g)';
              link.style.background = 'var(--g-light)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  // ── STATS COUNTER ANIMATION ───────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();

        // Only animate numeric stats
        const numMatch = raw.match(/^(\d+)/);
        if (!numMatch) return;

        const target = parseInt(numMatch[1]);
        const suffix = raw.replace(/^\d+/, '');
        let start = 0;
        const duration = 1200;
        const step = 16;
        const increment = target / (duration / step);

        const timer = setInterval(() => {
          start = Math.min(start + increment, target);
          el.textContent = Math.round(start) + suffix;
          if (start >= target) clearInterval(timer);
        }, step);

        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );

  statNums.forEach(el => counterObserver.observe(el));

})();