// 탭 기반 UX (Projects / Instagram Seeding)
(function(){
  const sets = document.querySelectorAll('[data-tabset]');
  sets.forEach(set=>{
    const btns = set.querySelectorAll('.tabset__btn');
    const panels = set.querySelectorAll('.tabset__panel');

    btns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const target = btn.dataset.tabTarget;

        btns.forEach(b=> b.classList.remove('is-active'));
        panels.forEach(p=> p.classList.remove('is-active'));

        btn.classList.add('is-active');
        set.querySelector(`[data-tab-panel="${target}"]`).classList.add('is-active');
      });
    });
  });
})();
