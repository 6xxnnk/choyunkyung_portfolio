// =========================================================
// draggable-meta.smooth.js — 초기 우하단 배치 + 부드러운 드래그
//  • .floating-window--imac-br 요소는 최초에 아이맥(view bound) 우하단 16px로 배치
//  • 이후엔 translate3d 기반으로 드래그 (경계는 가장 가까운 .device--imac 내부)
//  • 버튼(.meta-actions) 위에서는 드래그/툴팁 비활성
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const wins = document.querySelectorAll('[data-draggable]');

  // ----- tooltip (간단 버전) -----
  const tt = document.createElement('div');
  Object.assign(tt.style, {
    position:'fixed', top:'0', left:'0', transform:'translate(-50%,-100%)',
    padding:'8px 10px', fontSize:'12px', fontWeight:'700', letterSpacing:'0.02em',
    color:'#111', background:'linear-gradient(180deg,#fffdf4,#fff7cc)',
    border:'1px solid rgba(0,0,0,.12)', borderRadius:'10px',
    boxShadow:'0 10px 24px rgba(0,0,0,.12), inset 0 1px 0 #fff',
    pointerEvents:'none', zIndex:'99999', opacity:'0',
    transition:'opacity .15s ease, transform .15s ease', whiteSpace:'nowrap'
  });
  document.body.appendChild(tt);
  const showTT = (el,x=null,y=null)=>{
    if(el.matches(':has(.meta-actions:hover)')) return;
    tt.textContent = el.getAttribute('data-tooltip') || '드래그해서 위치를 바꿔보세요';
    tt.style.opacity = '1';
    if(x!=null&&y!=null){ tt.style.left=`${x}px`; tt.style.top=`${y-14}px`; tt.style.transform='translate(-50%,-100%)'; }
    else { const r=el.getBoundingClientRect(); tt.style.left=`${r.left+r.width/2}px`; tt.style.top=`${Math.max(8,r.top-10)}px`; tt.style.transform='translate(-50%,-100%)'; }
  };
  const moveTT=(x,y)=>{ tt.style.left=`${x}px`; tt.style.top=`${y-14}px`; tt.style.transform='translate(-50%,-100%)'; };
  const hideTT=()=> tt.style.opacity='0';

  wins.forEach(win=>{
    const bound = win.closest('.device--imac') || win.closest('section') || document.body;
    if(getComputedStyle(bound).position === 'static') bound.style.position = 'relative';
    const handle = win.querySelector('[data-drag-handle]') || win;

    let dragging=false, startX=0, startY=0, startTx=0, startTy=0;
    let minL=0, minT=0, maxL=0, maxT=0;
    let raf=0, nextTx=0, nextTy=0, needs=false;
    let zSeed=1000;

    const parseTxTy = (el)=>{
      const t = getComputedStyle(el).transform;
      if(!t || t==='none') return {tx:0, ty:0};
      const m2d = t.match(/matrix\(([^)]+)\)/);
      const m3d = t.match(/matrix3d\(([^)]+)\)/);
      if(m2d){ const n=m2d[1].split(',').map(parseFloat); return {tx:n[4], ty:n[5]}; }
      if(m3d){ const n=m3d[1].split(',').map(parseFloat); return {tx:n[12], ty:n[13]}; }
      return {tx:0, ty:0};
    };

    const updateBounds = ()=>{
      const br = bound.getBoundingClientRect();
      const ww = win.offsetWidth, wh = win.offsetHeight;
      minL = 0; minT = 0;
      maxL = Math.max(0, br.width  - ww);
      maxT = Math.max(0, br.height - wh);
    };

    // 초기 우하단 배치(아이맥 내부)
    const placeBottomRight = (margin=16)=>{
      const br = bound.getBoundingClientRect();
      const ww = win.offsetWidth, wh = win.offsetHeight;
      const x = Math.max(0, br.width  - ww - margin);
      const y = Math.max(0, br.height - wh - margin);
      // translate3d 기준 좌표로 전환
      win.style.left='0'; win.style.top='0';
      win.style.right='auto'; win.style.bottom='auto';
      win.style.transform=`translate3d(${x}px, ${y}px, 0)`;
      startTx = x; startTy = y;
      win.dataset.initialPlaced = '1';
    };

    // right/bottom으로 배치되어 있으면 translate로 전환
    const ensureTranslatePosition = ()=>{
      const br = bound.getBoundingClientRect();
      const wr = win.getBoundingClientRect();
      const style = getComputedStyle(win);
      const usingRB = (style.right !== 'auto' || style.bottom !== 'auto');
      if(usingRB || style.left !== '0px' || style.top !== '0px'){
        const left = wr.left - br.left;
        const top  = wr.top  - br.top;
        win.style.left = '0'; win.style.top = '0';
        win.style.right = 'auto'; win.style.bottom = 'auto';
        win.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      }
    };

    // 최초 세팅
    updateBounds();

    // ★ 여기서 클래스가 있으면 우하단으로 초기 배치
    if (win.classList.contains('floating-window--imac-br') && win.dataset.initialPlaced !== '1'){
      placeBottomRight(16);
    } else {
      ensureTranslatePosition();
      // startTx/startTy 동기화
      const p = parseTxTy(win); startTx = p.tx; startTy = p.ty;
    }

    window.addEventListener('resize', ()=>{
      updateBounds();
      // 리사이즈 시 현재 좌표를 경계로 클램프
      const p = parseTxTy(win);
      const clampedX = Math.min(Math.max(p.tx, minL), maxL);
      const clampedY = Math.min(Math.max(p.ty, minT), maxT);
      win.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      startTx = clampedX; startTy = clampedY;
    }, {passive:true});

    const render = ()=>{ raf=0; if(!needs) return; needs=false; win.style.transform = `translate3d(${nextTx}px, ${nextTy}px, 0)`; };

    const onDown = (e)=>{
      if(e.target.closest('.meta-actions')) return;
      dragging=true; win.classList.add('dragging'); win.style.zIndex=String(++zSeed); hideTT();
      const p = parseTxTy(win); startTx=p.tx; startTy=p.ty; startX=e.clientX; startY=e.clientY;
      handle.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e)=>{
      if(!dragging) return; e.preventDefault();
      let tx = startTx + (e.clientX - startX);
      let ty = startTy + (e.clientY - startY);
      tx = Math.min(Math.max(tx, minL), maxL);
      ty = Math.min(Math.max(ty, minT), maxT);
      nextTx=tx; nextTy=ty; needs=true;
      if(!raf) raf = requestAnimationFrame(render);
      hideTT();
    };
    const onUp = ()=>{
      if(!dragging) return;
      dragging=false; win.classList.remove('dragging');
      cancelAnimationFrame(raf); raf=0;
      const p = parseTxTy(win); startTx=p.tx; startTy=p.ty;
    };

    handle.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, {passive:false});
    window.addEventListener('pointerup', onUp, {passive:true});
    window.addEventListener('pointercancel', onUp, {passive:true});

    // tooltip
    win.addEventListener('mouseenter', (e)=>{ if(dragging||e.target.closest('.meta-actions')) return; showTT(win); });
    win.addEventListener('mousemove', (e)=>{ if(dragging||e.target.closest('.meta-actions')) return; moveTT(e.clientX,e.clientY); });
    win.addEventListener('mouseleave', hideTT);
    win.addEventListener('focusin', ()=> showTT(win));
    win.addEventListener('focusout', hideTT);
  });
});
