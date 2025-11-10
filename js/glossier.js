// phones-embed-fit.js
document.addEventListener('DOMContentLoaded', () => {
  const wraps = document.querySelectorAll('.phone-embed-wrap');

  const fit = () => {
    wraps.forEach(wrap => {
      const iframe = wrap.querySelector('.phone-embed');
      if (!iframe) return;

      const DW = 390;
      const DH = 880;

      const PW = wrap.clientWidth;
      const PH = wrap.clientHeight;

      // cover 방식 유지
      const scaleW = PW / DW;
      const scaleH = PH / DH;
      let scale = Math.max(scaleW, scaleH);

      // ✨ 살짝 확대 (프레임 꽉 채우기)
      scale *= 1.025; // ← 이 비율 조정 (1.02~1.04 추천)

      const x = (PW - DW * scale) / 2;
      const y = 0;

      iframe.style.width = `${DW}px`;
      iframe.style.height = `${DH}px`;
      iframe.style.transformOrigin = 'top left';
      iframe.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    });
  };

  fit();
  window.addEventListener('resize', fit);
});
