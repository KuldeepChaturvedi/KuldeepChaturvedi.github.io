/* ---------- 1. Prompt Library ---------- */
function buildPrompt(){
  const subject = document.getElementById('p-subject').value || 'General Knowledge';
  const grade = document.getElementById('p-grade').value || 'a young student';
  const topic = document.getElementById('p-topic').value.trim();
  const difficulty = document.getElementById('p-difficulty').value;
  const count = document.getElementById('p-count').value || 8;
  const options = document.getElementById('p-options').value || 4;
  const marks = document.getElementById('p-marks').value || 1;
  const seconds = document.getElementById('p-seconds').value || 30;

  const topicLine = topic ? ` focused on the topic "${topic}"` : '';

  return `Create ${count} multiple-choice questions for a ${subject} exam${topicLine}, suitable for ${grade}. Difficulty: ${difficulty}. Each question should have ${options} answer options and be worth ${marks} mark(s). Use simple, friendly language.

Return ONLY valid JSON, with no extra commentary or markdown fences, in exactly this structure:

{
  "examTitle": "string",
  "subject": "${subject}",
  "difficulty": "${difficulty}",
  "timer": { "mode": "perQuestion", "totalSeconds": null, "perQuestionSeconds": ${seconds} },
  "questions": [
    { "id": "q1", "question": "string", "options": ["string", "string"], "correctAnswerIndex": 0, "marks": ${marks} }
  ]
}`;
}
document.getElementById('btn-build-prompt').addEventListener('click', ()=>{
  document.getElementById('prompt-preview').textContent = buildPrompt();
  document.getElementById('copy-msg').style.display='none';
});
document.getElementById('btn-copy-prompt').addEventListener('click', ()=>{
  const text = document.getElementById('prompt-preview').textContent || buildPrompt();
  document.getElementById('prompt-preview').textContent = text;
  navigator.clipboard.writeText(text).then(()=>{
    document.getElementById('copy-msg').style.display='block';
  }).catch(()=>{
    document.getElementById('copy-msg').textContent = 'Select the text above and copy manually.';
    document.getElementById('copy-msg').style.display='block';
  });
});
document.getElementById('prompt-preview').textContent = buildPrompt();