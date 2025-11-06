/* File: js/cm29-mockups.js (scoped to #cm29) */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('cm29');
  if (!section) return;

  const phones = Array.from(section.querySelectorAll('.cm-phone'));

  // --- helpers ---
  const setPlay = (state) => phones.forEach(p => { p.style.animationPlayState = state; });

  // Add a soft glow once the screen image is ready
  const addGlow = (el) => {
    // If the computed filter is 'none', don't concatenate it (invalid: "none drop-shadow(...)")
    const current = getComputedStyle(el).filter;
    if (!current || current === 'none') {
      el.style.filter = 'drop-shadow(0 24px 40px rgba(255,185,94,.25)) drop-shadow(0 4px 18px rgba(15,23,42,.15)) drop-shadow(0 0 24px rgba(255,205,130,.18))';
    } else if (!current.includes('drop-shadow(0 0 24px')) {
      el.style.filter = `${current} drop-shadow(0 0 24px rgba(255,205,130,.18))`;
    }
  };

  // Pause when out of view, play when in view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      setPlay(entry && entry.isIntersecting ? 'running' : 'paused');
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    io.observe(section);
  } else {
    setPlay('running'); // very old browsers
  }

  // Also pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    setPlay(document.hidden ? 'paused' : 'running');
  });

  // Hover to pause / leave to play, add glow after img load
  phones.forEach((phone) => {
    phone.addEventListener('mouseenter', () => (phone.style.animationPlayState = 'paused'));
    phone.addEventListener('mouseleave', () => (phone.style.animationPlayState = 'running'));

    const img = phone.querySelector('img');
    if (img) {
      if (img.complete) addGlow(phone);
      else img.addEventListener('load', () => addGlow(phone), { once: true });
    }
  });

  // Kick it on first paint
  requestAnimationFrame(() => setPlay('running'));
});
