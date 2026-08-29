/* ---------- 4. Results ---------- */
document.getElementById('retry-btn').addEventListener('click', ()=>{
  document.getElementById('json-input').value='';
  document.getElementById('import-feedback').innerHTML='';
  document.getElementById('results-live').style.display='none';
  document.getElementById('results-empty').style.display='block';
  document.getElementById('exam-live').style.display='none';
  document.getElementById('exam-empty').style.display='block';
  showTab('import');
});

/* ---------- Results History ---------- */
function renderHistory(){
  const el = document.getElementById('history-list');
  if(!el) return;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem('quizpop_history') || '[]');
  } catch(e) {}
  if(history.length === 0){
    el.innerHTML = '<p class="muted" style="padding:8px 0;">No past results yet.</p>';
    return;
  }
  el.innerHTML = history.map(r=>{
    const stars = r.pct >= 80 ? '⭐⭐⭐' : r.pct >= 50 ? '⭐⭐' : '⭐';
    return `<div class="review-item">
      <div class="review-q">${r.examTitle}</div>
      <div class="review-line">${r.subject || ''} · ${r.date}</div>
      <div class="review-line" style="color:var(--purple);margin-top:4px;">${r.scored} / ${r.total} · ${r.pct}% &nbsp;${stars}</div>
    </div>`;
  }).join('');
}

document.getElementById('clear-history-btn').addEventListener('click', ()=>{
  if(window.confirm('Clear all past results?')){
    try { localStorage.removeItem('quizpop_history'); } catch(e) {}
    renderHistory();
  }
});

// Render history on initial page load
renderHistory();

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/QuizPop-Kids/sw.js').catch(() => {}));
}