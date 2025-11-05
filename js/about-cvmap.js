// js/about-cvmap.js
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.about-cvmap');
  if (!section) return;

  const targets = [
    ...section.querySelectorAll('.cv-center'),
    ...section.querySelectorAll('.bubble')
  ];
  if (!targets.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // 초기 상태 정리
  targets.forEach(el => el.classList.remove('is-visible'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
      } else {
        // 화면에서 벗어나면 다시 숨김 → 재스크롤 시 재생
        el.classList.remove('is-visible');
      }
    });
  }, {
    root: null,
    threshold: 0.05,            // 트리거 빠르게
    rootMargin: '0px 0px -5% 0px'
  });

  targets.forEach(el => io.observe(el));
});
