
(function(){
  // ---- 안전 가드: Swiper 없으면 조용히 종료
  if (typeof window.Swiper === "undefined") return;

  const root = document.querySelector('.proj--zigzag-v2');
  if (!root) return; // 이 섹션이 없는 페이지에선 아무 것도 안 함

  const left    = root.querySelector('#zzThumbs');
  const right   = root.querySelector('#zzRight');
  const thumbs  = Array.from(root.querySelectorAll('.zz-thumb'));
  const panels  = Array.from(root.querySelectorAll('.zz-swiper'));

  // 패널별 Swiper 인스턴스 보관
  const swipers = new Map();

  // 공통 옵션 (부드러운 전환 & 포트폴리오 무드 유지)
  const SWIPER_OPTS = (panel)=>({
    slidesPerView: 1,
    spaceBetween: 8,
    speed: 700,                 // 전환 더 부드럽게
    resistanceRatio: 0.9,
    longSwipesRatio: 0.2,
    followFinger: true,
    allowTouchMove: true,
    loop: false,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: panel.querySelector('.swiper-button-next'),
      prevEl: panel.querySelector('.swiper-button-prev'),
    }
  });

  // 패널 내 Swiper 1회 생성
  panels.forEach(panel => {
    const id = panel.dataset.id;
    const el = panel.querySelector('.swiper');
    if (!id || !el) return;
    // 혹시 중복 실행 방지
    if (swipers.has(id)) return;
    swipers.set(id, new Swiper(el, SWIPER_OPTS(panel)));
  });

  // 오른쪽 영역 높이를 왼쪽 2x2 총 높이에 맞추기
  function syncRightHeight(){
    if (!left || !right) return;
    const h = Math.round(left.getBoundingClientRect().height);
    // CSS var과 실제 height 둘 다 지정(브라우저별 안정성)
    right.style.setProperty('--zzH', h + 'px');
    right.style.height = h + 'px';
  }
  const rafSync = ()=>requestAnimationFrame(syncRightHeight);

  // 초기/리사이즈 동기화
  window.addEventListener('resize', rafSync);
  // 썸네일 이미지 로드 후 보정
  thumbs.forEach(t=>{
    const img = t.querySelector('img');
    if (img && !img.complete){
      img.addEventListener('load', rafSync, {once:true});
      img.addEventListener('error', rafSync, {once:true});
    }
  });
  rafSync();
  setTimeout(syncRightHeight, 220);

  // 패널 활성화 토글 (display:none 대신 opacity/visibility 사용)
  function activate(key){
    // 왼쪽 썸네일 상태
    thumbs.forEach(btn=>{
      const on = btn.dataset.target === key;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // 오른쪽 패널 전환
    panels.forEach(panel=>{
      const on = panel.dataset.id === key;
      panel.classList.toggle('is-active', on);
    });

    // 활성 패널의 Swiper 치수/상태 갱신
    requestAnimationFrame(()=>{
      const sw = swipers.get(key);
      if (sw){
        sw.updateSize();
        sw.updateSlides();
        sw.updateProgress();
        sw.update();            // 내부 옵저버 반영
        // 필요 시 처음 슬라이드로 이동 (유지 원하면 주석)
        sw.slideTo(0, 0);
      }
      syncRightHeight();
    });
  }

  // 썸네일 클릭/키보드 접근성
  thumbs.forEach(btn=>{
    if (!btn.hasAttribute('tabindex')) btn.setAttribute('tabindex','0');
    btn.setAttribute('role','button');

    const run = (e)=>{
      if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))){
        e.preventDefault?.();
        const key = btn.dataset.target;
        if (key) activate(key);
      }
    };
    btn.addEventListener('click', run);
    btn.addEventListener('keydown', run);
  });

  // 최초 활성화(마크업에 is-active가 있으면 그걸, 없으면 1번)
  const first = thumbs.find(t=>t.classList.contains('is-active')) || thumbs[0];
  activate(first?.dataset.target || '1');
})();

