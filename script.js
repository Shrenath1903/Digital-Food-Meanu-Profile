document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hide'), 400);
  });
  // fallback in case load already fired
  setTimeout(() => preloader.classList.add('hide'), 1800);

  /* ---------- CURSOR GLOW (desktop only) ---------- */
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  } else {
    glow.style.display = 'none';
  }

  /* ---------- NAVBAR SCROLL STATE ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- SCROLL REVEAL ANIMATIONS ---------- */
  const aosElements = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  aosElements.forEach(el => aosObserver.observe(el));

  /* ---------- ANIMATED HERO COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let current = 0;
    const duration = 1400;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    const tick = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
      } else {
        el.textContent = Math.floor(current);
        requestAnimationFrame(() => setTimeout(tick, stepTime));
      }
    };
    tick();
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- BACK TO TOP ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- HERO PARTICLES ---------- */
  const particleContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 22;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-20px`;
    p.style.animationDuration = `${Math.random() * 10 + 8}s`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    particleContainer.appendChild(p);
  }

  /* ---------- SMOOTH ANCHOR SCROLL (offset for fixed navbar) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- LEAD FORM (WhatsApp + mailto handoff) ---------- */
  const leadForm = document.getElementById('leadForm');
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(leadForm);
    const name = data.get('name')?.trim();
    const restaurant = data.get('restaurant')?.trim();
    const phone = data.get('phone')?.trim();
    const email = data.get('email')?.trim();
    const need = data.get('need');
    const message = data.get('message')?.trim();

    if (!name || !restaurant || !phone) {
      showToast('Please fill in your name, restaurant, and phone number.', true);
      return;
    }

    const waMessage =
      `Hi! I'm ${name} from ${restaurant}.%0A` +
      `Phone: ${phone}${email ? `%0AEmail: ${email}` : ''}%0A` +
      `Need: ${need}%0A` +
      `${message ? `Details: ${message}` : ''}`;

    showToast(`Thanks ${name}! Opening WhatsApp to confirm your request...`);

    setTimeout(() => {
      window.open(`https://wa.me/910000000000?text=${waMessage}`, '_blank');
      leadForm.reset();
    }, 900);
  });

  function showToast(msg, isError = false) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '100px',
        right: '26px',
        background: isError ? '#e74c3c' : '#1c1c24',
        color: '#fff',
        padding: '14px 22px',
        borderRadius: '12px',
        boxShadow: '0 15px 35px rgba(0,0,0,.4)',
        fontSize: '.88rem',
        zIndex: '2000',
        maxWidth: '300px',
        border: `1px solid ${isError ? '#e74c3c' : 'rgba(212,168,87,.4)'}`,
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all .35s ease'
      });
    }
    toast.style.background = isError ? '#e74c3c' : '#1c1c24';
    toast.style.border = `1px solid ${isError ? '#e74c3c' : 'rgba(212,168,87,.4)'}`;
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 3500);
  }

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
