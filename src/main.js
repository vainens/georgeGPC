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
let profile = 'gpc-1.5 preview';
let messages = [];

function openModal(modal) { modal.classList.remove('hidden'); overlay.classList.add('visible'); }
function closeEverything() { document.querySelectorAll('.modal, .model-menu').forEach((item) => item.classList.add('hidden')); overlay.classList.remove('visible'); $('#sidebar').classList.remove('open'); }
function resize() { prompt.style.height = 'auto'; prompt.style.height = `${Math.min(prompt.scrollHeight, 140)}px`; }
function createElement(tag, className, text) { const element = document.createElement(tag); element.className = className; if (text) element.textContent = text; return element; }
function addMessage(content, role, pending = false) {
  const message = createElement('article', `message ${role}${pending ? ' pending' : ''}`);
  message.append(createElement('div', 'message-avatar', role === 'user' ? 'U' : 'g'));
  const messageContent = createElement('div', 'message-content');
  if (pending) messageContent.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
  else messageContent.textContent = content;
  message.append(messageContent); conversation.append(message); message.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return message;
}
function setComposerBusy(busy) { send.disabled = busy; prompt.disabled = busy; }
function showSetupError(error) {
  const text = error || 'Il server AI non è disponibile. Avvia `npm run dev:full` e configura OPENAI_API_KEY.';
  addMessage(`⚠ ${text}`, 'assistant');
}
async function submit() {
  const text = prompt.value.trim(); if (!text) return;
  hero?.remove(); messages.push({ role: 'user', content: text }); addMessage(text, 'user'); prompt.value = ''; resize(); setComposerBusy(true);
  const pending = addMessage('', 'assistant', true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, profile, irony: ironic.checked }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    pending.querySelector('.message-content').textContent = data.content;
    pending.classList.remove('pending'); messages.push({ role: 'assistant', content: data.content });
  } catch (error) {
    pending.remove(); showSetupError(error.message); messages.pop();
  } finally { setComposerBusy(false); prompt.focus(); }
}
prompt.addEventListener('input', resize);
prompt.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); } });
send.addEventListener('click', submit);
document.querySelectorAll('.suggestions button').forEach((button) => button.addEventListener('click', () => { prompt.value = button.dataset.prompt; submit(); }));
$('#settings-button').addEventListener('click', () => openModal(settings));
$('#profile-button').addEventListener('click', () => openModal(auth));
$('#connect-openai').addEventListener('click', () => { $('#connect-openai').textContent = 'Configura OPENAI_API_KEY nel server'; $('#connect-openai').classList.add('connected'); });
document.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', closeEverything));
overlay.addEventListener('click', closeEverything);
$('#model-picker').addEventListener('click', () => $('#model-menu').classList.toggle('hidden'));
document.querySelectorAll('#model-menu button').forEach((button) => button.addEventListener('click', () => { profile = button.dataset.model; $('#current-model').textContent = profile; document.querySelectorAll('#model-menu button').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); $('#model-menu').classList.add('hidden'); }));
$('#open-menu').addEventListener('click', () => { $('#sidebar').classList.add('open'); overlay.classList.add('visible'); });
$('#close-menu').addEventListener('click', closeEverything);
$('#new-chat').addEventListener('click', () => { messages = []; conversation.querySelectorAll('.message').forEach((message) => message.remove()); window.location.reload(); });
$('#auth-form').addEventListener('submit', (event) => { event.preventDefault(); $('#auth-title').textContent = 'Benvenuto, George'; $('#auth-form').innerHTML = '<p class="success">Accesso completato. La tua cronologia è pronta.</p>'; });
$('#register-button').addEventListener('click', (event) => { event.preventDefault(); $('#auth-title').textContent = 'Crea il tuo account'; });
