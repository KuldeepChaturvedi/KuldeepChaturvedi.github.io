// main.js — lightweight interactions: mobile menu, theme toggle, smooth scroll, contact demo

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        if (nav && nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // Theme toggle (light/dark) with localStorage
  const themeToggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('site-theme');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '🌗';
    } else {
      root.removeAttribute('data-theme');
      themeToggle.textContent = '🌞';
    }
  };

  // initialize theme
  if (stored) {
    applyTheme(stored);
  } else {
    // respect system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('site-theme', next);
      applyTheme(next);
    });
  }

  // Basic contact form handler (demo)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const email = data.get('email').trim();
      const message = data.get('message').trim();
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      // Hook to email service can be added here (EmailJS, Azure Function)
      form.reset();
      alert('Thanks — your message was sent (demo).');
    });
  }

  // Intersection reveal for cards
  const reveals = document.querySelectorAll('.project-card, .skills-grid .skill, .hero-content');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('reveal');
    });
  }, { threshold: 0.08 });
  reveals.forEach(r => io.observe(r));
});

fetch('data/skills.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('skills-grid');

    Object.entries(data).forEach(([category, skills]) => {
      const card = document.createElement('div');
      card.className = 'skill-card';

      const title = document.createElement('h4');
      title.textContent = category;
      card.appendChild(title);

      const list = document.createElement('div');
      list.className = 'skill-chip-list';

      skills.forEach(skill => {
        const chip = document.createElement('div');
        chip.className = 'skill-chip';
        chip.innerHTML = `
          <span class="material-symbols-outlined">${skill.icon}</span>
          ${skill.name}
        `;
        list.appendChild(chip);
      });

      card.appendChild(list);
      container.appendChild(card);
    });
  });
