// Hero 섹션: 타자 애니메이션 + Search → Works 스크롤
(function(){
  const ghost = document.getElementById('typingGhost');
  const input = document.getElementById('q');
  const form  = document.getElementById('searchForm');
  const phrase = 'Do you love vintage?';
  let i = 0, dir = 1, stop = false;

  function tick(){
    if (stop) return;
    if (document.activeElement === input || input.value.length){
      ghost.classList.add('hidden');
    } else {
      ghost.classList.remove('hidden');
      ghost.textContent = phrase.slice(0, i);
      i += dir;
      if (i > phrase.length + 4) dir = -1;
      if (i <= 0) dir = 1;
    }
    setTimeout(tick, 80);
  }
  tick();

  input.addEventListener('focus', ()=> ghost.classList.add('hidden'));
  input.addEventListener('blur', ()=> { if(!input.value) ghost.classList.remove('hidden'); });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    document.getElementById('works').scrollIntoView({ behavior:'smooth', block:'start' });
  });

  document.addEventListener('visibilitychange', ()=> {
    stop = document.hidden;
    if (!stop) tick();
  });
})();
