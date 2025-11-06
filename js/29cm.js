c
/* 29CM mockup 섹션 전용 스크립트 (스코프: #cm29) */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('cm29');
  if (!section) return;                         // 섹션 없으면 바로 종료

  const phones = Array.from(section.querySelectorAll('.cm-phone'));

  // 공통: 애니메이션 재생/정지
  const setPlayState = (state) => {
    phones.forEach(p => (p.style.animationPlayState = state));
  };

  // 섹션이 화면에 있을 때만 회전 (없으면 정지)
  try {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      setPlayState(e.isIntersecting ? 'running' : 'paused');
    }, { threshold: 0.2 });
    io.observe(section);
  } catch (err) {
    // 구형 브라우저 대비: 항상 재생
    setPlayState('running');
  }

  // 각 폰: hover 시 일시정지 / 해제, 이미지 로드 후 은은한 글로우 추가
  phones.forEach((p) => {
    p.addEventListener('mouseenter', () => (p.style.animationPlayState = 'paused'));
    p.addEventListener('mouseleave', () => (p.style.animationPlayState = 'running'));

    const img = p.querySelector('img');
    if (!img) return;

    const addGlow = () => {
      // 기존 filter 유지 + glow만 추가
      const current = getComputedStyle(p).filter || '';
      if (!current.includes('drop-shadow(0 0 24px')) {
        p.style.filter = `${current} drop-shadow(0 0 24px rgba(255,205,130,.18))`;
      }
    };
    if (img.complete) addGlow();
    else img.addEventListener('load', addGlow, { once: true });
  });

  // 강제 초기 재생 (첫 렌더 타이밍 보정)
  requestAnimationFrame(() => setPlayState('running'));
});
