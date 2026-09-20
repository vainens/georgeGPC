import './style.css';

const $ = (selector) => document.querySelector(selector);
const conversation = $('#conversation');
const prompt = $('#prompt');
const send = $('#send');
const hero = $('#hero');
const overlay = $('#overlay');
const settings = $('#settings-modal');
const auth = $('#auth-modal');
const ironic = $('#irony-toggle');

function openModal(modal) { modal.classList.remove('hidden'); overlay.classList.add('visible'); }
function closeEverything() { document.querySelectorAll('.modal, .model-menu').forEach((item) => item.classList.add('hidden')); overlay.classList.remove('visible'); $('#sidebar').classList.remove('open'); }
function resize() { prompt.style.height = 'auto'; prompt.style.height = `${Math.min(prompt.scrollHeight, 140)}px`; }
function replyFor(text) {
  const prefix = ironic.checked ? 'Ottima domanda — non l’ho scritta io sulla lavagna, promesso. ' : 'Certo. ';
  return `${prefix}Posso aiutarti a esplorare “${text}”. Per iniziare, chiarirei l’obiettivo, le persone coinvolte e il risultato che vuoi ottenere. Poi trasformiamo tutto in un piano concreto, un passo alla volta.`;
}
function addMessage(content, role, pending = false) {
  const message = document.createElement('article');
  message.className = `message ${role}${pending ? ' pending' : ''}`;
  message.innerHTML = `<div class="message-avatar">${role === 'user' ? 'U' : 'g'}</div><div class="message-content">${content}</div>`;
  conversation.append(message); message.scrollIntoView({ behavior: 'smooth', block: 'end' }); return message;
}
function submit() {
  const text = prompt.value.trim(); if (!text) return;
  hero?.remove(); addMessage(text, 'user'); prompt.value = ''; resize(); send.disabled = true;
  const pending = addMessage('<span class="typing"><i></i><i></i><i></i></span>', 'assistant', true);
  window.setTimeout(() => { pending.classList.remove('pending'); pending.querySelector('.message-content').textContent = replyFor(text); send.disabled = false; }, 700);
}
prompt.addEventListener('input', resize);
prompt.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } });
send.addEventListener('click', submit);
document.querySelectorAll('.suggestions button').forEach((button) => button.addEventListener('click', () => { prompt.value = button.dataset.prompt; submit(); }));
$('#settings-button').addEventListener('click', () => openModal(settings));
$('#profile-button').addEventListener('click', () => openModal(auth));
$('#connect-openai').addEventListener('click', () => { $('#connect-openai').textContent = 'Provider connesso ✓'; $('#connect-openai').classList.add('connected'); });
$('.close-modal').addEventListener('click', closeEverything);
document.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', closeEverything));
overlay.addEventListener('click', closeEverything);
$('#model-picker').addEventListener('click', () => $('#model-menu').classList.toggle('hidden'));
document.querySelectorAll('#model-menu button').forEach((button) => button.addEventListener('click', () => { $('#current-model').textContent = button.dataset.model; document.querySelectorAll('#model-menu button').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); $('#model-menu').classList.add('hidden'); }));
$('#open-menu').addEventListener('click', () => { $('#sidebar').classList.add('open'); overlay.classList.add('visible'); });
$('#close-menu').addEventListener('click', closeEverything);
$('#new-chat').addEventListener('click', () => window.location.reload());
$('#auth-form').addEventListener('submit', (event) => { event.preventDefault(); $('#auth-title').textContent = 'Benvenuto, George'; $('#auth-form').innerHTML = '<p class="success">Accesso completato. La tua cronologia è pronta.</p>'; });
$('#register-button').addEventListener('click', (event) => { event.preventDefault(); $('#auth-title').textContent = 'Crea il tuo account'; });
