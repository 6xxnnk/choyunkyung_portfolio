(function(){
  const cards = document.querySelectorAll('.device[data-images]');
  if(!cards.length) return;

  // 화면 진입/이탈로 슬라이드 시작·중지
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const card = entry.target;
      if(entry.isIntersecting){
        startSlide(card);
      } else {
        stopSlide(card);
      }
    });
  }, { threshold: 0.25 });

  cards.forEach(card => io.observe(card));

  function startSlide(card){
    if(card._slideTimer) return;
    const imgEl = card.querySelector('.device__screen img');
    const list = (card.dataset.images || '').split(',').map(s=>s.trim()).filter(Boolean);
    if(!imgEl || list.length <= 1) return;

    let idx = 0;
    card._slideTimer = setInterval(()=>{
      idx = (idx + 1) % list.length;
      imgEl.style.opacity = '0';
      setTimeout(()=>{
        imgEl.src = list[idx];
        imgEl.onload = ()=> (imgEl.style.opacity = '1');
      }, 180);
    }, 2600);
  }

  function stopSlide(card){
    if(card._slideTimer){
      clearInterval(card._slideTimer);
      card._slideTimer = null;
    }
  }

  // (옵션) iMac 약간의 tilt
  document.querySelectorAll('.imac__bezel').forEach(bezel=>{
    bezel.addEventListener('mousemove', (e)=>{
      const r = bezel.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      bezel.style.transform = `rotateX(${(-y*2)}deg) rotateY(${(x*2)}deg)`;
    });
    bezel.addEventListener('mouseleave', ()=>{ bezel.style.transform = 'none'; });
  });
})();