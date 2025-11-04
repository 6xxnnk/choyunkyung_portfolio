// js/about-cvmap.js
document.addEventListener('DOMContentLoaded', () => {
  /* ========= 1) 반복 재생되는 버블 리빌 ========= */
  const revealTargets = [
    ...document.querySelectorAll('.about-cvmap .cv-center'),
    ...document.querySelectorAll('.about-cvmap .bubble')
  ];

  if (revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          // 들어올 때 보이게
          el.classList.add('is-visible');
        } else {
          // 나갈 때 초기화 → 다시 들어오면 애니메이션 재생
          el.classList.remove('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

    revealTargets.forEach((el) => io.observe(el));
  }

  /* ========= 2) ink-title 손글씨 드로잉 (반복 재생) =========
     - .ink-title(H2)을 동등한 SVG로 치환
     - stroke-dash 애니메이션 → 채우기(fill) 순서로 진행
  */
  const title = document.querySelector('.about-cvmap .ink-title');
  if (title) {
    const text = (title.textContent || '').trim() || 'About me';

    // SVG 생성
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'ink-title-svg');
    svg.setAttribute('viewBox', '0 0 1200 200'); // 가변 레이아웃용 큰 캔버스

    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', '50%');
    t.setAttribute('y', '50%');
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('class', 'ink-title-stroke');
    t.textContent = text;
    svg.appendChild(t);

    // 먼저 DOM에 붙여서 길이 계산
    title.replaceWith(svg);

    // 길이 계산 후 대시 적용
    // getComputedTextLength는 요소가 렌더된 뒤에 정확함 → rAF로 보장
    requestAnimationFrame(() => {
      const len = t.getComputedTextLength ? t.getComputedTextLength() : 1400;
      t.style.strokeDasharray = `${len}`;
      t.style.strokeDashoffset = `${len}`;
    });

    // IO로 뷰포트 진입/이탈 시 애니메이션 토글 (반복 재생)
    const inkIO = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        svg.classList.add('is-drawn');
      } else {
        // 초기화 → 다시 들어오면 처음부터 그려짐
        svg.classList.remove('is-drawn');
      }
    }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.2 });

    inkIO.observe(svg);
  }
});
