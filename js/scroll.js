// 스크롤 리빌 / 간단 패럴랙스 등
(function(){
  const els = document.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el=> obs.observe(el));
})();
