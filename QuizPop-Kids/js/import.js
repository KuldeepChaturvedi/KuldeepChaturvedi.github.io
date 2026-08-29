/* ---------- 2. Import ---------- */
const DEMOS = {
  math: {
    examTitle: "Grade 2 Math — Addition & Subtraction",
    subject: "Math",
    difficulty: "easy",
    timer: { mode: "perQuestion", totalSeconds: null, perQuestionSeconds: 20 },
    questions: [
      { id:"q1", question:"What is 4 + 5?", options:["7","8","9","10"], correctAnswerIndex:2, marks:1 },
      { id:"q2", question:"What is 10 - 3?", options:["6","7","8","9"], correctAnswerIndex:1, marks:1 },
      { id:"q3", question:"What is 2 + 2?", options:["3","4","5","6"], correctAnswerIndex:1, marks:1 },
      { id:"q4", question:"What is 9 - 5?", options:["2","3","4","5"], correctAnswerIndex:2, marks:1 },
      { id:"q5", question:"What is 6 + 3?", options:["8","9","10","11"], correctAnswerIndex:1, marks:1 }
    ]
  },
  animals: {
    examTitle: "Animal Friends Quiz",
    subject: "Science",
    difficulty: "easy",
    timer: { mode: "total", totalSeconds: 120, perQuestionSeconds: null },
    questions: [
      { id:"q1", question:"Which animal says 'Moo'?", options:["Dog","Cow","Cat","Duck"], correctAnswerIndex:1, marks:1 },
      { id:"q2", question:"Which animal has a long neck?", options:["Giraffe","Pig","Frog","Mouse"], correctAnswerIndex:0, marks:1 },
      { id:"q3", question:"Which animal lives in water?", options:["Lion","Fish","Camel","Eagle"], correctAnswerIndex:1, marks:1 },
      { id:"q4", question:"Which animal can fly?", options:["Elephant","Bird","Snail","Turtle"], correctAnswerIndex:1, marks:1 }
    ]
  }
};

document.querySelectorAll('[data-demo]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById('json-input').value = JSON.stringify(DEMOS[btn.dataset.demo], null, 2);
  });
});

function validateExam(data){
  if(!data || typeof data !== 'object') return "JSON must be an object.";
  if(!data.examTitle) return "Missing 'examTitle'.";
  if(!data.timer || !['total','perQuestion'].includes(data.timer.mode)) return "Missing/invalid 'timer.mode' (must be 'total' or 'perQuestion').";
  if(!Array.isArray(data.questions) || data.questions.length===0) return "Missing or empty 'questions' array.";
  for(const q of data.questions){
    if(!q.question || !Array.isArray(q.options) || q.options.length<2) return `Question '${q.id||'?'}' needs a question and at least 2 options.`;
    if(typeof q.correctAnswerIndex !== 'number' || q.correctAnswerIndex<0 || q.correctAnswerIndex>=q.options.length) return `Question '${q.id||'?'}' has an invalid correctAnswerIndex.`;
  }
  return null;
}

let examData = null;

document.getElementById('btn-load-json').addEventListener('click', ()=>{
  let raw = document.getElementById('json-input').value.trim();
  const fb = document.getElementById('import-feedback');
  fb.innerHTML = '';

  // Normalize curly/smart quotes to straight ASCII quotes (common when copying from AI chatbots on mobile)
  raw = raw
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  const fencesRemoved = stripped !== raw;
  if(fencesRemoved){
    raw = stripped;
    fb.innerHTML = '<div class="success-box" style="background:#FFF8E7;border-color:#FFD400;color:#6B5000;">✂️ Markdown code fences were automatically removed before parsing.</div>';
  }
  let parsed;
  try{
    parsed = JSON.parse(raw);
  }catch(e){
    fb.innerHTML = `<div class="error-box">Couldn't parse JSON: ${e.message}</div>`;
    return;
  }
  const err = validateExam(parsed);
  if(err){
    fb.innerHTML = `<div class="error-box">${err}</div>`;
    return;
  }
  examData = parsed;
  fb.innerHTML = `<div class="success-box">Loaded "${parsed.examTitle}" — ${parsed.questions.length} questions. Go to <strong>3. Live Exam</strong> to start.</div>`;
  setupExam();
});