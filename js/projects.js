// 간단 필터 (data-type 기반)
(function(){
  const wrap = document.querySelector('.projects');
  if(!wrap) return;

  const btns = wrap.querySelectorAll('.filter');
  const items = wrap.querySelectorAll('.project');

  btns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btns.forEach(b=> b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const f = btn.dataset.filter;
      items.forEach(it=>{
        const show = (f === 'all') || (it.dataset.type === f);
        it.style.display = show ? '' : 'none';
      });
    });
  });
})();
