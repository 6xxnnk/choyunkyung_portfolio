// Glossier iPhone frame - live website auto-fit
(function(){
  const ready = document.readyState === "loading"
    ? new Promise(r => document.addEventListener("DOMContentLoaded", r, {once:true}))
    : Promise.resolve();

  ready.then(() => {
    const wraps = Array.from(document.querySelectorAll(".phone-embed-wrap"));
    if(!wraps.length) return;

    function fitOne(wrap){
      const iframe = wrap.querySelector(".phone-embed");
      if(!iframe) return;

      // 기준 해상도(HTML data-design="390x844"에서 읽고, 없으면 기본값)
      const ds = (wrap.getAttribute("data-design") || "390x844").toLowerCase();
      const [dw, dh] = ds.split("x").map(v => parseInt(v,10) || 0);
      if(!dw || !dh) return;

      // 프레임 실제 내부 크기
      const pw = wrap.clientWidth;
      const ph = wrap.clientHeight;

      // contain 방식: 기기 화면에 맞춰 축소/확대 (가로·세로 중 작은 비율)
      const scale = Math.min(pw/dw, ph/dh);

      // 가운데 정렬
      const x = (pw - dw*scale)/2;
      const y = (ph - dh*scale)/2;

      iframe.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    function fitAll(){
      wraps.forEach(fitOne);
    }

    // 처음 로드 시 깜빡임 최소화
    wraps.forEach(wrap => {
      const iframe = wrap.querySelector(".phone-embed");
      if(!iframe) return;
      iframe.style.visibility = "hidden";
      iframe.addEventListener("load", () => {
        iframe.style.visibility = "visible";
        fitOne(wrap);
      }, {once:true});

      // 포커스가 있어야 휠/트랙패드 스크롤이 바로 iframe에 먹히는 브라우저가 있어요.
      wrap.addEventListener("mouseenter", () => iframe.focus());
      wrap.addEventListener("touchstart", () => iframe.focus(), {passive:true});
    });

    // 리사이즈 대응
    window.addEventListener("resize", fitAll, {passive:true});
    if (window.ResizeObserver){
      const ro = new ResizeObserver(fitAll);
      wraps.forEach(w => ro.observe(w));
    }
  });
})();
