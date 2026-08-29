/* ---------- Web Audio utilities ---------- */
function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

function playJingle(pct) {
  if (pct >= 0.8) {
    setTimeout(() => playTone(523, 0.15), 0);
    setTimeout(() => playTone(659, 0.15), 150);
    setTimeout(() => playTone(784, 0.3), 300);
  } else if (pct < 0.5) {
    playTone(220, 0.5, 'sawtooth', 0.1);
  }
}

/* ---------- 3. Exam ---------- */
let state = {};

function setupExam(){
  document.getElementById('exam-empty').style.display='none';
  document.getElementById('exam-live').style.display='block';
  document.getElementById('exam-title').textContent = examData.examTitle;
  document.getElementById('exam-subtitle').textContent = `${examData.subject} · ${examData.difficulty}`;

  state = {
    idx: 0,
    answers: new Array(examData.questions.length).fill(null),
    flagged: new Array(examData.questions.length).fill(false),
    timerMode: examData.timer.mode,
    timeLeft: examData.timer.mode==='total' ? examData.timer.totalSeconds : examData.timer.perQuestionSeconds,
    intervalId: null
  };

  renderTrail();
  renderQuestion();
  startTimer();
  showTab('exam');
}

function startTimer(){
  clearInterval(state.intervalId);
  updateTimerBadge();
  state.intervalId = setInterval(()=>{
    state.timeLeft--;
    updateTimerBadge();
    if(state.timeLeft<=0){
      if(state.timerMode==='perQuestion'){
        goNext(true);
      } else {
        finishExam();
      }
    }
  },1000);
}

function updateTimerBadge(){
  const badge = document.getElementById('timer-badge');
  const m = Math.floor(Math.max(state.timeLeft,0)/60);
  const s = Math.max(state.timeLeft,0)%60;
  badge.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  const wasLow = badge.classList.contains('low');
  badge.classList.toggle('low', state.timeLeft<=10);
  if(state.timeLeft===10 && !wasLow) playTone(330, 0.1);
  const total = state.timerMode==='total' ? examData.timer.totalSeconds : examData.timer.perQuestionSeconds;
  document.getElementById('progress-fill').style.width = Math.max(0,(state.timeLeft/total)*100)+'%';
  const announce = document.getElementById('timer-announce');
  if(announce){
    if(state.timeLeft===10) announce.textContent = '10 seconds remaining';
    else if(state.timeLeft<=0) announce.textContent = 'Time is up!';
  }
}

function renderTrail(){
  const trail = document.getElementById('trail');
  trail.innerHTML = '';
  examData.questions.forEach((q,i)=>{
    if(i>0){
      const seg = document.createElement('div');
      seg.className='seg';
      trail.appendChild(seg);
    }
    const dot = document.createElement('div');
    dot.className='dot';
    dot.setAttribute('role','button');
    dot.setAttribute('tabindex','0');
    let statusLabel;
    if(i===state.idx) statusLabel = 'current';
    else if(state.flagged[i]) statusLabel = 'flagged';
    else if(state.answers[i]!==null) statusLabel = 'answered';
    else statusLabel = 'unanswered';
    const ariaLabel = `Question ${i+1} — ${statusLabel}`;
    dot.setAttribute('aria-label', ariaLabel);
    let titleText;
    if(state.flagged[i]) titleText = `Question ${i+1} — flagged for review`;
    else if(state.answers[i]!==null) titleText = `Question ${i+1} — answered`;
    else titleText = `Question ${i+1} — not yet answered`;
    dot.setAttribute('title', titleText);
    dot.textContent = i+1;
    if(state.flagged[i]) dot.classList.add('flagged');
    else if(state.answers[i]!==null) dot.classList.add('answered');
    if(i===state.idx) dot.classList.add('current');
    const clickHandler = ()=>{ state.idx=i; renderQuestion(); if(state.timerMode==='perQuestion'){ state.timeLeft=examData.timer.perQuestionSeconds; startTimer(); } renderTrail(); };
    dot.addEventListener('click', clickHandler);
    dot.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); clickHandler(); } });
    trail.appendChild(dot);
  });
}

function renderQuestion(){
  const q = examData.questions[state.idx];
  document.getElementById('q-meta').textContent = `Question ${state.idx+1} of ${examData.questions.length} · ${q.marks||1} mark(s)`;
  document.getElementById('q-text').textContent = q.question;
  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  const letters = ['A','B','C','D','E','F'];
  q.options.forEach((opt,i)=>{
    const b = document.createElement('button');
    const isSelected = state.answers[state.idx]===i;
    b.className = 'opt-btn' + (isSelected ? ' selected':'');
    b.setAttribute('role','radio');
    b.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    b.setAttribute('aria-label', `Option ${letters[i]}: ${opt}`);
    b.innerHTML = `<span class="letter">${letters[i]}</span><span>${opt}</span>`;
    b.addEventListener('click', ()=>{
      playTone(440, 0.12);
      b.classList.add('flash');
      b.addEventListener('animationend', () => b.classList.remove('flash'));
      state.answers[state.idx]=i;
      renderQuestion();
      renderTrail();
    });
    opts.appendChild(b);
  });
  const flagBtn = document.getElementById('flag-btn');
  flagBtn.textContent = state.flagged[state.idx] ? '🚩 Flagged — click to unflag' : '🚩 Flag for review';
  flagBtn.setAttribute('aria-pressed', state.flagged[state.idx] ? 'true' : 'false');
  document.getElementById('prev-btn').style.visibility = state.idx===0 ? 'hidden':'visible';
  const isLast = state.idx===examData.questions.length-1;
  document.getElementById('next-btn').style.display = isLast ? 'none':'inline-flex';
  document.getElementById('submit-btn').style.display = isLast ? 'inline-flex':'none';
}

document.getElementById('flag-btn').addEventListener('click', ()=>{
  state.flagged[state.idx] = !state.flagged[state.idx];
  renderQuestion();
  renderTrail();
});
document.getElementById('prev-btn').addEventListener('click', ()=>{
  if(state.idx>0){ state.idx--; renderQuestion(); renderTrail();
    if(state.timerMode==='perQuestion'){ state.timeLeft=examData.timer.perQuestionSeconds; startTimer(); } }
});
document.getElementById('next-btn').addEventListener('click', ()=>goNext(false));
document.getElementById('submit-btn').addEventListener('click', showSubmitModal);

function goNext(auto){
  if(state.idx < examData.questions.length-1){
    state.idx++;
    renderQuestion();
    renderTrail();
    if(state.timerMode==='perQuestion'){ state.timeLeft=examData.timer.perQuestionSeconds; startTimer(); }
  } else if(auto){
    finishExam();
  }
}

function showSubmitModal(){
  const total = examData.questions.length;
  const answered = state.answers.filter(a => a !== null).length;
  const unanswered = total - answered;
  const flagged = state.flagged.filter(Boolean).length;
  document.getElementById('modal-answered').textContent = `${answered} of ${total}`;
  document.getElementById('modal-unanswered').textContent = unanswered;
  document.getElementById('modal-flagged').textContent = flagged;
  document.getElementById('submit-modal').hidden = false;
}

function hideSubmitModal(){
  document.getElementById('submit-modal').hidden = true;
}

document.getElementById('modal-back-btn').addEventListener('click', hideSubmitModal);
document.getElementById('modal-submit-btn').addEventListener('click', ()=>{
  hideSubmitModal();
  finishExam();
});

function finishExam(){
  clearInterval(state.intervalId);
  let scored=0, total=0;
  const reviewHtml = [];
  examData.questions.forEach((q,i)=>{
    const marks = q.marks||1;
    total += marks;
    const userIdx = state.answers[i];
    const isCorrect = userIdx===q.correctAnswerIndex;
    if(isCorrect) scored += marks;
    reviewHtml.push(`
      <div class="review-item ${isCorrect?'correct':'incorrect'}">
        <div class="review-q">Q${i+1}. ${q.question} <span class="tag-pill ${isCorrect?'correct':'incorrect'}">${isCorrect?'Correct':'Incorrect'}</span></div>
        <div class="review-line your">Your answer: ${userIdx!==null ? q.options[userIdx] : '(no answer)'}</div>
        ${!isCorrect ? `<div class="review-line correct-ans">Correct answer: ${q.options[q.correctAnswerIndex]}</div>` : ''}
      </div>`);
  });

  const record = {
    id: Date.now(),
    examTitle: examData.examTitle,
    subject: examData.subject,
    date: new Date().toLocaleDateString(),
    scored,
    total,
    pct: total > 0 ? Math.round(scored / total * 100) : 0
  };
  try {
    const history = JSON.parse(localStorage.getItem('quizpop_history') || '[]');
    history.unshift(record);
    if (history.length > 20) history.pop();
    localStorage.setItem('quizpop_history', JSON.stringify(history));
  } catch(e) {}

  document.getElementById('score-big').textContent = `${scored} / ${total}`;
  const pct = total>0 ? scored/total : 0;
  playJingle(pct);
  document.getElementById('score-stars').textContent = pct>=0.8 ? '⭐⭐⭐' : pct>=0.5 ? '⭐⭐' : '⭐';
  document.getElementById('score-msg').textContent =
    pct>=0.8 ? "Amazing work! You're a superstar! 🌟" : pct>=0.5 ? "Nice try — keep practicing! 💪" : "Good effort! Let's practice more. 🙂";
  document.getElementById('review-list').innerHTML = reviewHtml.join('');
  document.getElementById('results-empty').style.display='none';
  document.getElementById('results-live').style.display='block';
  showTab('results');
  renderHistory();
}