/* ---------- Tab handling ---------- */
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');
function showTab(name){
  tabs.forEach(t=>{
    const isActive = t.dataset.tab===name;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  panels.forEach(p=>p.classList.toggle('active', p.id==='panel-'+name));
}
tabs.forEach(t=>t.addEventListener('click', ()=>showTab(t.dataset.tab)));