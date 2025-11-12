(function(){
  // ---- 안전 가드
  if (typeof window.Swiper === "undefined") return;

  const root   = document.querySelector('.proj--zigzag-v2');
  if (!root) return;

  const left    = root.querySelector('#zzThumbs');
  const right   = root.querySelector('#zzRight');
  const thumbs  = Array.from(root.querySelectorAll('.zz-thumb'));
  const panels  = Array.from(root.querySelectorAll('.zz-swiper'));

  // ====== 반응형 모드 감지
  const mqStack = window.matchMedia('(max-width: 834px)'); // 이 이하면 세로 스택
  const isStacked = () => mqStack.matches;

  // ====== Swiper 인스턴스 보관
  const swipers = new Map();

  // 공통 옵션
  const SWIPER_OPTS = (panel)=>({
    slidesPerView: 1,
    spaceBetween: 8,
    speed: 700,
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
    if (!id || !el || swipers.has(id)) return;
    swipers.set(id, new Swiper(el, SWIPER_OPTS(panel)));
  });

  // ====== 레이아웃 높이 동기화 (데스크탑 그리드 전용)
  function syncRightHeight(){
    if (!left || !right) return;
    if (isStacked()){
      // 스택형에선 자율 레이아웃
      right.style.height = '';
      right.style.removeProperty('--zzH');
      return;
    }
    const h = Math.round(left.getBoundingClientRect().height);
    right.style.setProperty('--zzH', h + 'px');
    right.style.height = h + 'px';
  }
  const rafSync = ()=>requestAnimationFrame(syncRightHeight);

  // 좌측 썸네일 영역이 변할 때도 동기화 (이미지 로드/리플로우 대응)
  if ('ResizeObserver' in window && left){
    const ro = new ResizeObserver(rafSync);
    ro.observe(left);
  }

  // 이미지 로드 후 보정
  thumbs.forEach(t=>{
    const img = t.querySelector('img');
    if (img && !img.complete){
      img.addEventListener('load', rafSync, {once:true, passive:true});
      img.addEventListener('error', rafSync, {once:true, passive:true});
    }
  });

  // 초기 + 리사이즈 + 미디어쿼리 변경 시 보정
  window.addEventListener('resize', rafSync, {passive:true});
  mqStack.addEventListener?.('change', rafSync);

  // ====== 패널 활성화
  function activate(key){
    // 왼쪽 썸네일 상태
    thumbs.forEach(btn=>{
      const on = btn.dataset.target === key;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // 오른쪽 패널 전환 (opacity/visibility로)
    let activePanel = null;
    panels.forEach(panel=>{
      const on = panel.dataset.id === key;
      panel.classList.toggle('is-active', on);
      if (on) activePanel = panel;
    });

    // 활성 패널 Swiper 갱신
    requestAnimationFrame(()=>{
      const sw = swipers.get(key);
      if (sw){
        sw.updateSize();
        sw.updateSlides();
        sw.updateProgress();
        sw.update();
        sw.slideTo(0, 0); // 필요 없으면 주석
      }
      syncRightHeight();

      // 스택형(모바일/태블릿)에서는 활성 패널로 부드럽게 스크롤
      if (isStacked() && activePanel){
        activePanel.scrollIntoView({behavior:'smooth', block:'nearest'});
      }
    });
  }

  // ====== 접근성: 키보드/클릭
  thumbs.forEach(btn=>{
    if (!btn.hasAttribute('tabindex')) btn.setAttribute('tabindex','0');
    btn.setAttribute('role','button');

    const run = (e)=>{
      if (
        e.type === 'click' ||
        (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))
      ){
        e.preventDefault?.();
        const key = btn.dataset.target;
        if (key) activate(key);
      }
    };
    btn.addEventListener('click', run);
    btn.addEventListener('keydown', run);
  });

  // ====== 초기 활성화
  const first = thumbs.find(t=>t.classList.contains('is-active')) || thumbs[0];
  activate(first?.dataset.target || '1');

  // 첫 페인트 안정화
  requestAnimationFrame(rafSync);
  setTimeout(syncRightHeight, 220);
})();
