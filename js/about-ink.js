// js/about-ink.js
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector('.about-cvmap .ink-title-svg');
  const section = document.querySelector('.about-cvmap');
  if (!svg || !section) return;

  const textEl = svg.querySelector('text');
  if (!textEl) return;

  const svgns = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(svgns, 'defs');
  const clip = document.createElementNS(svgns, 'clipPath');
  const rect = document.createElementNS(svgns, 'rect');

  const clipId = 'inkClip-' + Math.random().toString(36).slice(2);
  clip.setAttribute('id', clipId);
  clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', '0');  // 시작은 0
  rect.setAttribute('height', '0');
  clip.appendChild(rect);
  defs.appendChild(clip);
  svg.insertBefore(defs, svg.firstChild);

  textEl.setAttribute('clip-path', `url(#${clipId})`);

  function syncRectToText() {
    try {
      const bb = textEl.getBBox();
      rect.setAttribute('x', bb.x);
      rect.setAttribute('y', bb.y);
      rect.setAttribute('height', bb.height);
      return bb;
    } catch(e) {
      return null;
    }
  }

  // 초기 동기화
  let bb = syncRectToText();
  // 폰트 로딩 후 보정
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { bb = syncRectToText(); });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const io = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    if (entry.isIntersecting) {
      bb = syncRectToText() || bb;
      if (!bb) return;

      if (prefersReduced || !('animate' in rect)) {
        rect.setAttribute('width', bb.width);
        return;
      }
      rect.animate(
        [{ width: '0' }, { width: `${bb.width}px` }],
        { duration: 900, easing: 'ease-out', fill: 'forwards' }
      );
    } else {
      rect.setAttribute('width', '0'); // 재진입 재생
    }
  }, { threshold: 0.1 });

  io.observe(section);

  // 리사이즈/회전 시 bbox 재계산
  window.addEventListener('resize', () => { bb = syncRectToText() || bb; });
});
