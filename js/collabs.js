// ===========================
// SECTION 4 — Instagram Collabs
// ===========================
(function(){
  const tiles = document.querySelectorAll('.collab-tile');
  if(!tiles.length) return;

  tiles.forEach(tile=>{
    // hover 효과를 살짝 강조 (CSS 기반)
    tile.addEventListener('mouseenter', ()=>{
      tile.classList.add('is-hovered');
    });
    tile.addEventListener('mouseleave', ()=>{
      tile.classList.remove('is-hovered');
    });

    // 클릭 시 콘솔에 브랜드명 표시 (나중에 모달 연결)
    tile.addEventListener('click', ()=>{
      const brand = tile.dataset.brand || 'Brand';
      console.log(`👉 Open modal for: ${brand}`);
      // 이후 여기에 모달 열기 함수 연결 가능
    });
  });
})();
