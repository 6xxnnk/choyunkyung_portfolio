
(function(){
  const phone = document.querySelector('.phone-glossier');
  if(!phone) return;
  const stack = phone.querySelector('.stack');
  const io = new IntersectionObserver(([ent])=>{
    if(!ent) return;
    if(ent.isIntersecting){
      phone.classList.add('in-view');
      stack.classList.remove('reset');
      // 끝나면 원위치 → 재진입 시 다시 스크롤
      const total = 14000; // CSS와 동일(14s)
      clearTimeout(stack._t);
      stack._t = setTimeout(()=>{
        stack.classList.add('reset'); // 부드럽게 0으로
        phone.classList.remove('in-view');
      }, total + 200);
    }else{
      phone.classList.remove('in-view');
    }
  }, { threshold: 0.4 });
  io.observe(phone);
})();

