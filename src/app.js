import { loadContent, sampleQuestions } from './questions.js';
import { examScore, penaltyFraction } from './scoring.js';
import { progressStore } from './progress-store.js';
import { allowedEmail, getInitialSession, loadCloudProgress, onAuthStateChange, saveCloudProgress, sendMagicLink, signOut } from './supabase-client.js';

const state = {
  content: null,
  progress: progressStore.load(),
  mode: null,
  topicId: null,
  unitId: null,
  examType: 'aleatorio',
  questions: [],
  responses: [],
  sessionNotice: '',
  reviewKind: 'inteligente',
  auth: { user: null, email: '', cloudEnabled: false, error: null },
  index: 0,
  correct: 0,
  answered: 0,
  blank: 0,
  expandedUnits: new Set(),
  storyExpansionInitialized: false
};

const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
})[character]);

let cloudSaveTimer = null;

function renderSessionUser() {
  const user = $('#session-user');
  const logout = $('#sign-out');
  if (!user || !logout) return;
  user.textContent = state.auth.email || '';
  user.hidden = !state.auth.user;
  logout.hidden = !state.auth.user;
}

function scheduleCloudSave(progress) {
  if (!state.auth.user || !state.auth.cloudEnabled) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(async () => {
    try {
      await saveCloudProgress(state.auth.user.id, progress);
    } catch (error) {
      state.auth.cloudEnabled = false;
      progressStore.setRemoteSync(null);
      state.auth.error = error;
      announce('No se pudo sincronizar el progreso. Se mantiene guardado localmente.');
    }
  }, 350);
}

async function hydrateCloudProgress(user) {
  if (!user) return;
  progressStore.setRemoteSync(null);
  try {
    const remoteProgress = await loadCloudProgress(user.id);
    if (remoteProgress) {
      state.progress = progressStore.save(remoteProgress);
    } else {
      await saveCloudProgress(user.id, state.progress);
    }
    state.auth.cloudEnabled = true;
    progressStore.setRemoteSync(scheduleCloudSave);
  } catch (error) {
    state.auth.cloudEnabled = false;
    state.auth.error = error;
    progressStore.setRemoteSync(null);
  }
}

async function acceptAuthSession(session) {
  state.auth.user = session?.user || null;
  state.auth.email = session?.user?.email || '';
  if (state.auth.user) await hydrateCloudProgress(state.auth.user);
  else {
    state.auth.cloudEnabled = false;
    progressStore.setRemoteSync(null);
  }
  renderSessionUser();
  if (state.content && state.auth.user) {
    renderProgress();
    renderStory();
    show('home');
  }
}

async function initAuth() {
  const { session, error } = await getInitialSession();
  state.auth.error = error || null;
  await acceptAuthSession(session);
  onAuthStateChange(async (_event, nextSession) => {
    await acceptAuthSession(nextSession);
    if (!nextSession && state.content) show('auth');
  });
}

function sessionLabel(session) {
  if (!session) return '';
  if (session.mode === 'examen') return session.examType === 'historico' ? 'examen histórico' : 'examen aleatorio';
  if (session.mode === 'historia-tema') return 'test de Historia';
  if (session.mode === 'historia-unidad') return 'cuestionario final de Historia';
  if (session.mode === 'repaso') return 'repaso';
  return 'práctica libre';
}

function activeSessionSnapshot() {
  return {
    mode: state.mode,
    topicId: state.topicId,
    unitId: state.unitId,
    examType: state.examType,
    questionIds: state.questions.map(question => question.id),
    responses: state.responses,
    index: state.index,
    correct: state.correct,
    answered: state.answered,
    blank: state.blank,
    sessionNotice: state.sessionNotice,
    updatedAt: new Date().toISOString()
  };
}

function persistActiveSession() {
  if (!state.questions.length || !state.mode) return;
  state.progress.activeSession = activeSessionSnapshot();
  state.progress = progressStore.save(state.progress);
  renderResumeControl();
}

function clearActiveSession() {
  state.progress.activeSession = null;
  state.progress = progressStore.save(state.progress);
  renderResumeControl();
}

function renderResumeControl() {
  const button = $('#resume-session');
  const discard = $('#discard-session');
  const session = state.progress?.activeSession;
  if (!button) return;
  button.hidden = !session?.questionIds?.length;
  if (discard) discard.hidden = !session?.questionIds?.length;
  if (session?.questionIds?.length) {
    const answered = session.responses?.filter(Boolean).length || 0;
    button.textContent = `Continuar ${sessionLabel(session)} (${answered}/${session.questionIds.length})`;
  }
}

function reviewCandidates() {
  const stats = state.progress.questionStats || {};
  const doubtful = new Set(state.progress.doubtfulQuestionIds || []);
  const saved = new Set(state.progress.savedQuestionIds || []);
  const active = state.content.questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true));
  return active
    .filter(question => {
      const item = stats[question.id] || {};
      return Number(item.incorrect) > 0 || Number(item.blank) > 0 || doubtful.has(question.id) || saved.has(question.id);
    })
    .sort((a, b) => {
      const sa = stats[a.id] || {};
      const sb = stats[b.id] || {};
      const scoreA = (Number(sa.incorrect) || 0) * 3 + (Number(sa.blank) || 0) * 2 + (doubtful.has(a.id) ? 1 : 0) + (saved.has(a.id) ? 1 : 0);
      const scoreB = (Number(sb.incorrect) || 0) * 3 + (Number(sb.blank) || 0) * 2 + (doubtful.has(b.id) ? 1 : 0) + (saved.has(b.id) ? 1 : 0);
      return scoreB - scoreA;
    });
}

function sampleReviewQuestions() {
  const candidates = reviewCandidates();
  const selected = candidates.slice(0, Math.min(20, candidates.length));
  return {
    questions: shuffledOptions(selected),
    notice: candidates.length
      ? `Repaso inteligente: ${candidates.length} preguntas marcadas por fallos, blancos, dudas o guardado.`
      : ''
  };
}

function recordQuestionResponse(question, response) {
  const stats = state.progress.questionStats || {};
  const previous = stats[question.id] || { attempts: 0, correct: 0, incorrect: 0, blank: 0 };
  const next = { ...previous, attempts: (Number(previous.attempts) || 0) + 1, lastAnsweredAt: new Date().toISOString() };
  if (response.blank) next.blank = (Number(previous.blank) || 0) + 1;
  else if (response.correct) next.correct = (Number(previous.correct) || 0) + 1;
  else next.incorrect = (Number(previous.incorrect) || 0) + 1;
  state.progress.questionStats = { ...stats, [question.id]: next };
}

function toggleQuestionList(listName, questionId) {
  const current = new Set(state.progress[listName] || []);
  if (current.has(questionId)) current.delete(questionId);
  else current.add(questionId);
  state.progress[listName] = [...current];
  state.progress = progressStore.save(state.progress);
  renderQuestionTools();
}

function renderQuestionTools() {
  const question = state.questions[state.index];
  if (!question) return;
  const saved = state.progress.savedQuestionIds.includes(question.id);
  const doubtful = state.progress.doubtfulQuestionIds.includes(question.id);
  $('#save-question').textContent = saved ? 'Quitar de guardadas' : 'Guardar pregunta';
  $('#doubt-question').textContent = doubtful ? 'Quitar marca dudosa' : 'Marcar dudosa';
  $('#save-question').classList.toggle('is-selected', saved);
  $('#doubt-question').classList.toggle('is-selected', doubtful);
}

function shuffledOptions(options) {
  const result = options.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function show(screen) {
  document.querySelectorAll('[data-screen]').forEach(node => {
    node.hidden = node.dataset.screen !== screen;
  });
}

function orderedUnits() {
  return state.content.studyPlan.units.slice().sort((a, b) => a.order - b.order);
}

function unitIsUnlocked(index) {
  if (index === 0) return true;
  return state.progress.completedUnits.includes(orderedUnits()[index - 1].id);
}

function unitReading(unit) {
  return state.content.historyReading?.units?.[unit.id] || { lawIds: [] };
}

function unitIsRead(unit) {
  return unitReading(unit).lawIds.length === 0 || state.progress.readUnits.includes(unit.id);
}

function topicIsUnlocked(unit, unitIndex, topicIndex) {
  if (!unitIsUnlocked(unitIndex)) return false;
  if (!unitIsRead(unit)) return false;
  if (topicIndex === 0) return true;
  return state.progress.completedTopics.includes(unit.topicIds[topicIndex - 1]);
}

function topicQuestionCount(topicId) {
  return (state.content.byTopic[topicId] || [])
    .filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true))
    .length;
}

function unitQuestionCount(unit) {
  return unit.topicIds.reduce((total, topicId) => total + topicQuestionCount(topicId), 0);
}

function unitTopicsCompleted(unit) {
  return unit.topicIds.every(topicId => state.progress.completedTopics.includes(topicId));
}

function unitStatus(unit, index) {
  if (state.progress.completedUnits.includes(unit.id)) return 'completed';
  return unitIsUnlocked(index) ? 'active' : 'locked';
}

function topicLabel(topic) {
  return `${topic.part === 'comun' ? 'Común' : 'Específico'} · Tema ${topic.number}`;
}

function renderGuide() {
  const guide = state.content.orientationGuide;
  $('#guide-title').textContent = guide.title;
  $('#guide-subtitle').textContent = guide.subtitle;
  const distributionRows = orderedUnits().map(unit => `
    <tr>
      <td>${escapeHtml(unit.title)}</td>
      <td>${escapeHtml(unit.weight.toFixed(2).replace('.', ','))}</td>
    </tr>`).join('');
  const sections = guide.sections.map(section => `
    <section class="guide-section" id="guide-${escapeHtml(section.id)}">
      <h3>${escapeHtml(section.title)}</h3>
      ${(section.paragraphs || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      ${section.bullets?.length ? `<ul>${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      ${(section.subsections || []).map(subsection => `
        <div class="guide-subsection">
          <h4>${escapeHtml(subsection.title)}</h4>
          ${(subsection.paragraphs || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
          ${subsection.bullets?.length ? `<ul>${subsection.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
        </div>`).join('')}
    </section>`).join('');
  const legalNotices = state.content.editorialRules.rules.map(rule => `
    <article class="guide-legal-notice is-${escapeHtml(rule.severity)}">
      <strong>${escapeHtml(rule.title)}</strong>
      <p>${escapeHtml(rule.summary)}</p>
      <div class="guide-sources">${rule.officialSources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`).join('')}</div>
    </article>`).join('');
  $('#guide-content').innerHTML = `
    <p class="guide-intro">${escapeHtml(guide.intro)}</p>
    ${sections}
    <section class="guide-section">
      <h3>Distribución utilizada por la app</h3>
      <p>Estos pesos se usan para organizar el recorrido y equilibrar los futuros simulacros.</p>
      <div class="guide-table-wrap"><table><thead><tr><th>Unidad</th><th>Peso</th></tr></thead><tbody>${distributionRows}</tbody></table></div>
    </section>
    <section class="guide-section">
      <h3>Avisos de vigencia</h3>
      ${legalNotices}
    </section>
    <p class="guide-reviewed">Revisada: ${escapeHtml(guide.lastReviewed)}</p>`;
}

const studyDocuments = [
  { id: 'readme', title: 'Léeme antes de empezar', summary: 'Qué contiene la app, cómo avanzar y cómo interpretar los resultados.', file: 'docs/LEEME.md' },
  { id: 'practico', title: 'Dossier del supuesto práctico', summary: 'Supuesto histórico, hipótesis probables, plantillas de respuesta y entrenamiento.', file: 'docs/practico_dossier_estudio.md' },
  { id: 'formato', title: 'Cómo es el examen', summary: 'Formato, puntuación, penalización y estrategia de respuesta.', file: 'docs/FORMATO_EXAMEN.md' },
  { id: 'fuentes', title: 'Fuentes sin corpus legal', summary: 'Cómo estudiar historia, gestión cultural y técnica sin forzar anclas jurídicas.', file: 'docs/FUENTES_SIN_CORPUS.md' },
  { id: 'tecnico', title: 'Fuentes técnicas del INAEM', summary: 'Cualificaciones y estándares profesionales para el bloque escénico.', file: 'docs/FUENTE_TEMARIOS_TECNICOS_M1.md' }
];

const studyCategories = [
  { id: 'readme', icon: '?', title: 'Léeme', summary: 'Orientación rápida para empezar a estudiar.' },
  { id: 'practico', icon: '◆', title: 'Supuesto práctico', summary: 'Casos, protocolos, normativa y entrenamiento escrito.' },
  { id: 'examen', icon: '✓', title: 'Examen y estrategia', summary: 'Formato, puntuación y cómo organizar el estudio.' },
  { id: 'fuentes', icon: '▤', title: 'Fuentes y temario', summary: 'Materiales para estudiar lo que no procede de una ley.' },
  { id: 'oficial', icon: '▣', title: 'Material oficial', summary: 'Cuestionarios y documentos de convocatorias anteriores.' }
];
let activeStudyCategory = 'practico';
const documentCategory = documentId => ({ readme: 'readme', practico: 'practico', formato: 'examen', fuentes: 'fuentes', tecnico: 'fuentes' }[documentId] || 'fuentes');
let activeLawId = null;
let activeLawAnchorId = null;
let lawReturnToStory = false;
let lawReferencePreviousFocus = null;
let studyTocCleanup = null;

function renderHomeMenu() {
  $('#home-menu').innerHTML = `
    <button class="home-menu-card menu-guide" type="button" data-home-action="guide"><span class="home-menu-icon">G</span><span class="home-menu-label">Gu&#237;a</span><small>La ruta de estudio preparada para Mar&#237;a.</small></button>
    <button class="home-menu-card menu-story" type="button" data-home-action="story"><span class="home-menu-icon">H</span><span class="home-menu-label">Modo historia</span><small>Avanza por unidades y desbloquea cada cuestionario.</small></button>
    <button class="home-menu-card menu-free is-primary" id="start-free" type="button"><span class="home-menu-icon">P</span><span class="home-menu-label">Pr&#225;ctica libre</span><small>Preguntas del banco completo, sin orden obligatorio.</small></button>
    <button class="home-menu-card menu-exam" id="start-exam" type="button"><span class="home-menu-icon">E</span><span class="home-menu-label">Modo examen</span><small>Simulacro proporcional con la configuraci&#243;n elegida.</small></button>
    <button class="home-menu-card menu-review" type="button" data-home-action="review"><span class="home-menu-icon">R</span><span class="home-menu-label">Repaso</span><small>Fallos, blancos y preguntas marcadas como dudosas.</small></button>
    <button class="home-menu-card menu-practical" type="button" data-home-action="practico"><span class="home-menu-icon">◆</span><span class="home-menu-label">Supuesto pr&#225;ctico</span><small>Qu&#233; es, hist&#243;rico y supuestos para entrenar.</small></button>
    <button class="home-menu-card menu-laws" type="button" data-home-action="laws"><span class="home-menu-icon">L</span><span class="home-menu-label">Leyes</span><small>Normas completas, anclas y fuentes oficiales.</small></button>
    <button class="home-menu-card menu-official" type="button" data-home-action="official"><span class="home-menu-icon">M</span><span class="home-menu-label">Material oficial</span><small>Ex&#225;menes anteriores y documentos de referencia.</small></button>`;
}

function renderPracticalPanel() {
  $('#home-practical').innerHTML = `
    <div class="panel-back-row"><button class="secondary" type="button" data-practical-back>&#8592; Inicio</button></div>
    <h2>Supuesto pr&#225;ctico</h2>
    <p>Empieza por uno de estos tres caminos. Cada tarjeta abre el apartado correspondiente del dossier.</p>
    <div class="practical-menu" aria-label="Apartados del supuesto pr&#225;ctico">
      <button class="practical-menu-card practical-menu-0" type="button" data-practical-anchor="study-0-que-es-esta-prueba-y-como-se-puntua"><span class="practical-menu-icon">0</span><strong>Qu&#233; es</strong><small>Prueba, tiempo, puntuaci&#243;n y criterios.</small></button>
      <button class="practical-menu-card practical-menu-1" type="button" data-practical-anchor="study-1-supuesto-historico-el-practico-real-de-mayo-de-2022"><span class="practical-menu-icon">1</span><strong>Hist&#243;rico</strong><small>El supuesto real de La Gatita en 2022.</small></button>
      <button class="practical-menu-card practical-menu-2" type="button" data-practical-anchor="study-2-que-cambia-con-el-temario-2023-24"><span class="practical-menu-icon">2</span><strong>Supuesto actual</strong><small>Qu&#233; puede cambiar con el temario vigente.</small></button>
    </div>
    <h3 class="practical-subtitle">Supuestos para entrenar</h3>
    <div class="practical-subcases" aria-label="Supuestos pr&#225;cticos de entrenamiento">
      <button class="practical-subcase-card" type="button" data-practical-anchor="study-3-supuesto-probable-1-incidente-en-funcion-probabilidad-alta"><span class="practical-subcase-icon">1</span><strong>Incidente en funci&#243;n</strong><small>Parada, asistencia, emergencia y evacuaci&#243;n.</small></button>
      <button class="practical-subcase-card" type="button" data-practical-anchor="study-4-supuesto-probable-2-montaje-o-gira-con-la-seguridad-integrada-probabilidad-media-alta"><span class="practical-subcase-icon">2</span><strong>Montaje o gira</strong><small>Coordinaci&#243;n de empresas y prevenci&#243;n.</small></button>
      <button class="practical-subcase-card" type="button" data-practical-anchor="study-5-supuesto-probable-3-gestion-pura-probabilidad-media-baja-pero-preparable-y-rentable"><span class="practical-subcase-icon">3</span><strong>Gesti&#243;n cultural</strong><small>Programaci&#243;n, p&#250;blicos, presupuesto e indicadores.</small></button>
    </div>
    <h3 class="practical-subtitle">Material visual</h3>
    <p>Planos y esquemas para reconocer el espacio esc&#233;nico y leer un supuesto.</p>
    <div class="practical-grid">
      <figure><img src="assets/practico/esquema_teatro_italiana.svg" alt="Esquema de un teatro a la italiana con vocabulario t&#233;cnico" loading="lazy"><figcaption>Esquema did&#225;ctico &#183; teatro a la italiana</figcaption></figure>
      <figure><img src="assets/practico/esquema_configuracion_invertida.svg" alt="Esquema de configuraci&#243;n invertida con evacuaci&#243;n y tel&#243;n cortafuegos" loading="lazy"><figcaption>Esquema did&#225;ctico &#183; configuraci&#243;n invertida</figcaption></figure>
      <figure><img src="assets/practico/plano_zarzuela_normal_2022.png" alt="Plano del Teatro de la Zarzuela en configuraci&#243;n normal" loading="lazy"><figcaption>Plano real &#183; configuraci&#243;n normal</figcaption></figure>
      <figure><img src="assets/practico/plano_zarzuela_la_gatita_2022.png" alt="Plano del Teatro de la Zarzuela durante La Gatita" loading="lazy"><figcaption>Plano real &#183; configuraci&#243;n de La Gatita</figcaption></figure>
    </div>
    <p class="practical-note">Los planos reales se conservan para uso personal y como ejercicio de lectura del supuesto pr&#225;ctico. Los esquemas did&#225;cticos son material original.</p>`;
  $('#home-practical').querySelector('[data-practical-back]').addEventListener('click', returnHome);
  $('#home-practical').querySelectorAll('[data-practical-anchor]').forEach(button => {
    button.addEventListener('click', () => openStudyDocument('practico', button.dataset.practicalAnchor));
  });
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|#[^)]+|(?:docs|data|assets)\/[^)]+)\)/g, (match, label, url) => url.startsWith('http')
      ? `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`
      : `<a href="${url}">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const output = [];
  const toc = [];
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (!list) return;
    output.push(`</${list}>`);
    list = null;
  };
  for (const line of lines) {
    if (!line.trim()) { flushParagraph(); closeList(); continue; }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      const text = heading[2].replace(/[*_`]/g, '').trim();
      const id = `study-${text.toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      toc.push({ id, level: heading[1].length, text });
      output.push(`<h${heading[1].length} id="${id}">${inlineMarkdown(heading[2])}</h${heading[1].length}>`);
      continue;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) { flushParagraph(); closeList(); output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`); continue; }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const kind = unordered ? 'ul' : 'ol';
      if (list !== kind) { closeList(); output.push(`<${kind}>`); list = kind; }
      output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      continue;
    }
    closeList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  closeList();
  return { html: output.join(''), toc };
}

function renderStudyLibrary() {
  $('#study-category-grid').innerHTML = studyCategories.map(category => `
    <button class="study-category-card" type="button" data-study-category="${escapeHtml(category.id)}">
      <span class="study-category-icon" aria-hidden="true">${escapeHtml(category.icon)}</span>
      <strong>${escapeHtml(category.title)}</strong>
      <small>${escapeHtml(category.summary)}</small>
    </button>`).join('');
}

function openStudyCategory(categoryId) {
  const category = studyCategories.find(item => item.id === categoryId) || studyCategories[0];
  activeStudyCategory = category.id;
  $('#study-category-title').textContent = category.title;
  $('#study-category-subtitle').textContent = category.summary;
  const documents = studyDocuments.filter(item => documentCategory(item.id) === category.id);
  $('#study-catalog-list').innerHTML = documents.length
    ? documents.map(document => `
      <article class="study-doc-card">
        <h3>${escapeHtml(document.title)}</h3>
        <p>${escapeHtml(document.summary)}</p>
        <button class="secondary study-doc-open" type="button" data-study-doc="${escapeHtml(document.id)}">Leer ahora</button>
      </article>`).join('')
    : '<p class="study-empty">Todavía no hay documentos en esta categoría.</p>';
  $('#study-document-view').hidden = true;
  $('#study-catalog-view').hidden = false;
  show('study');
  window.scrollTo(0, 0);
}

async function openStudyDocument(documentId, focusId = null) {
  const document = studyDocuments.find(item => item.id === documentId);
  if (!document) return;
  activeStudyCategory = documentCategory(document.id);
  const categoryDocuments = studyDocuments.filter(item => documentCategory(item.id) === activeStudyCategory);
  const index = categoryDocuments.findIndex(item => item.id === documentId);
  $('#study-page-title').textContent = document.title;
  $('#study-page-subtitle').textContent = document.summary;
  $('#study-page-content').innerHTML = '<p>Cargando documento…</p>';
  $('#study-toc-list').innerHTML = '';
  $('#study-prev').disabled = index <= 0;
  $('#study-prev-bottom').disabled = index <= 0;
  $('#study-next').disabled = index >= categoryDocuments.length - 1;
  $('#study-next-bottom').disabled = index >= categoryDocuments.length - 1;
  $('#study-prev').dataset.studyNavigate = categoryDocuments[index - 1]?.id || '';
  $('#study-prev-bottom').dataset.studyNavigate = categoryDocuments[index - 1]?.id || '';
  $('#study-next').dataset.studyNavigate = categoryDocuments[index + 1]?.id || '';
  $('#study-next-bottom').dataset.studyNavigate = categoryDocuments[index + 1]?.id || '';
  $('#study-catalog-view').hidden = true;
  $('#study-document-view').hidden = false;
  show('study');
  try {
    const response = await fetch(document.file);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rendered = markdownToHtml(await response.text());
    $('#study-page-content').innerHTML = rendered.html;
    $('#study-toc-list').innerHTML = rendered.toc
      .filter(item => item.level <= 3)
      .map(item => `<a class="study-toc-link level-${item.level}" href="#${item.id}">${escapeHtml(item.text)}</a>`)
      .join('');
    if (studyTocCleanup) studyTocCleanup();
    const tocItems = rendered.toc.filter(item => item.level <= 3);
    const updateToc = () => {
      const current = tocItems
        .map(item => ({ item, node: document.getElementById(item.id) }))
        .filter(entry => entry.node && entry.node.getBoundingClientRect().top <= 150)
        .pop()?.item;
      $('#study-toc-list').querySelectorAll('.study-toc-link').forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${current?.id || ''}`);
      });
    };
    window.addEventListener('scroll', updateToc, { passive: true });
    studyTocCleanup = () => window.removeEventListener('scroll', updateToc);
    $('#study-page-content').scrollTop = 0;
    window.scrollTo(0, 0);
    if (focusId) window.requestAnimationFrame(() => document.getElementById(focusId)?.scrollIntoView({ block: 'start' }));
    updateToc();
  } catch (error) {
    $('#study-page-content').innerHTML = `<p>No se pudo cargar este documento: ${escapeHtml(error.message)}</p>`;
  }
}

function renderLawCatalog() {
  const laws = Object.values(state.content.lawsById || {})
    .filter(law => law.lawId !== 'norma-demo')
    .sort((a, b) => String(a.title).localeCompare(String(b.title), 'es'));
  $('#law-catalog-grid').innerHTML = laws.map(law => `
    <button class="law-catalog-card" type="button" data-law-id="${escapeHtml(law.lawId)}">
      <span class="law-catalog-icon" aria-hidden="true">§</span>
      <strong>${escapeHtml(law.title)}</strong>
      <small>${escapeHtml(law.legalReference || '')}</small>
    </button>`).join('');
}

function openLawCatalog() {
  $('#law-document-view').hidden = true;
  $('#law-catalog-view').hidden = false;
  show('law');
  window.scrollTo(0, 0);
}

function lawNavigationItems() {
  return Object.values(state.content.lawsById || {})
    .filter(law => law.lawId !== 'norma-demo')
    .sort((a, b) => String(a.title).localeCompare(String(b.title), 'es'));
}

function ensureLawNavigation() {
  const nav = $('#law-document-view .study-reader-toolbar .study-reader-nav');
  if (!nav || $('#law-prev')) return;
  nav.insertAdjacentHTML('beforeend', '<button id="law-prev" class="secondary" type="button" aria-label="Norma anterior" title="Norma anterior">←</button><button id="law-next" class="secondary" type="button" aria-label="Norma siguiente" title="Norma siguiente">→</button>');
  $('#law-prev').addEventListener('click', () => openLawDocument($('#law-prev').dataset.lawNavigate, null, lawReturnToStory));
  $('#law-next').addEventListener('click', () => openLawDocument($('#law-next').dataset.lawNavigate, null, lawReturnToStory));
}

async function openLawDocument(lawId, anchorId = null, fromStory = false) {
  const law = state.content.lawsById?.[lawId];
  if (!law) return;
  ensureLawNavigation();
  const laws = lawNavigationItems();
  const lawIndex = laws.findIndex(item => item.lawId === lawId);
  const previousLaw = laws[lawIndex - 1];
  const nextLaw = laws[lawIndex + 1];
  $('#law-prev').disabled = !previousLaw;
  $('#law-next').disabled = !nextLaw;
  $('#law-prev').dataset.lawNavigate = previousLaw?.lawId || '';
  $('#law-next').dataset.lawNavigate = nextLaw?.lawId || '';
  activeLawId = lawId;
  activeLawAnchorId = anchorId;
  lawReturnToStory = fromStory;
  $('#law-back-catalog').textContent = fromStory ? '← Historia' : '← Leyes';
  $('#law-page-title').textContent = law.title;
  $('#law-page-subtitle').textContent = `${law.legalReference || ''}${law.versionDate ? ` · versión ${law.versionDate}` : ''}`;
  $('#law-page-content').innerHTML = '<p>Cargando texto jurídico…</p>';
  $('#law-catalog-view').hidden = true;
  $('#law-document-view').hidden = false;
  show('law');
  try {
    const response = await fetch(`data/laws/${law.file}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const source = await response.text();
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    const main = parsed.querySelector('main') || parsed.body;
    main.querySelectorAll('script, style').forEach(node => node.remove());
    $('#law-page-content').innerHTML = main.innerHTML;
    const target = activeLawAnchorId && document.getElementById(activeLawAnchorId);
    if (target) window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    else window.scrollTo(0, 0);
  } catch (error) {
    $('#law-page-content').innerHTML = `<p>No se pudo cargar esta ley: ${escapeHtml(error.message)}</p>`;
  }
}

function closeLawReferenceModal() {
  const modal = $('#law-reference-modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('law-reference-open');
  $('#law-reference-body').innerHTML = '';
  const previousFocus = lawReferencePreviousFocus;
  lawReferencePreviousFocus = null;
  if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
}

async function openLawReferenceModal(lawId, anchorId = null, trigger = null) {
  const law = state.content.lawsById?.[lawId];
  const modal = $('#law-reference-modal');
  const body = $('#law-reference-body');
  if (!law || !modal || !body) return;
  lawReferencePreviousFocus = trigger || document.activeElement;
  $('#law-reference-title').textContent = law.title;
  $('#law-reference-subtitle').textContent = `${law.legalReference || ''}${law.versionDate ? ` · versión ${law.versionDate}` : ''}`;
  body.innerHTML = '<p>Cargando texto jurídico…</p>';
  modal.hidden = false;
  document.body.classList.add('law-reference-open');
  $('#law-reference-close').focus();
  try {
    const response = await fetch(`data/laws/${law.file}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const source = await response.text();
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    const main = parsed.querySelector('main') || parsed.body;
    main.querySelectorAll('script, style').forEach(node => node.remove());
    body.innerHTML = main.innerHTML;
    const target = anchorId
      ? Array.from(body.querySelectorAll('[id]')).find(node => node.id === anchorId)
      : null;
    body.querySelectorAll('.law-ref-highlight').forEach(node => node.classList.remove('law-ref-highlight'));
    if (target) {
      target.classList.add('law-ref-highlight');
      window.requestAnimationFrame(() => target.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    } else body.scrollTop = 0;
  } catch (error) {
    body.innerHTML = `<p>No se pudo cargar esta ley: ${escapeHtml(error.message)}</p>`;
  }
}

function navigateStudyDocument(event) {
  const id = event.currentTarget.dataset.studyNavigate;
  if (id) openStudyDocument(id);
}

function openGuide() {
  const dialog = $('#orientation-guide');
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeGuide() {
  const dialog = $('#orientation-guide');
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function renderStory() {
  const units = orderedUnits();
  if (!state.storyExpansionInitialized) {
    const activeUnit = units.find((unit, index) => unitIsUnlocked(index) && !state.progress.completedUnits.includes(unit.id));
    if (activeUnit) state.expandedUnits.add(activeUnit.id);
    state.storyExpansionInitialized = true;
  }
  const completedOfficialTopics = state.progress.completedTopics
    .filter(topicId => state.content.topicsById[topicId]).length;
  $('#story-progress-summary').textContent = `${state.progress.completedUnits.length}/19 unidades · ${completedOfficialTopics}/60 temas`;

  $('#unit-list').innerHTML = units.map((unit, unitIndex) => {
    const status = unitStatus(unit, unitIndex);
    const completedTopics = unit.topicIds.filter(topicId => state.progress.completedTopics.includes(topicId)).length;
    const expanded = state.expandedUnits.has(unit.id);
    const topics = unit.topicIds.map((topicId, topicIndex) => {
      const topic = state.content.topicsById[topicId];
      const completed = state.progress.completedTopics.includes(topicId);
      const unlocked = topicIsUnlocked(unit, unitIndex, topicIndex);
      const questionCount = topicQuestionCount(topicId);
      const editorialRules = state.content.rulesByTopic[topicId] || [];
      const available = unlocked && questionCount > 0;
      const stateLabel = completed
        ? 'Superado'
        : unitIsUnlocked(unitIndex) && !unitIsRead(unit)
          ? 'Lee la legislación primero'
        : !unlocked
          ? 'Bloqueado'
          : questionCount
            ? `${questionCount} preguntas disponibles`
            : 'Contenido y preguntas pendientes';
      return `
        <li class="story-topic ${completed ? 'is-complete' : ''} ${!unlocked ? 'is-locked' : ''}">
          <div>
            <span>${escapeHtml(topicLabel(topic))}</span>
            <strong>${escapeHtml(topic.title)}</strong>
            <small>${escapeHtml(stateLabel)}</small>
            ${editorialRules.map(rule => `
              <aside class="editorial-alert is-${escapeHtml(rule.severity)}">
                <strong>${escapeHtml(rule.title)}</strong>
                <span>${escapeHtml(rule.summary)}</span>
              </aside>`).join('')}
          </div>
          <button
            class="topic-action"
            data-story-topic="${escapeHtml(topicId)}"
            data-unit-id="${escapeHtml(unit.id)}"
            ${available ? '' : 'disabled'}
          >${completed ? 'Repetir' : 'Empezar'}</button>
        </li>`;
    }).join('');
    const reading = unitReading(unit);
    const readingLaws = reading.lawIds
      .map(lawId => state.content.lawsById[lawId])
      .filter(Boolean);
    const readingBlock = readingLaws.length
      ? `<div class="unit-reading ${unitIsRead(unit) ? 'is-complete' : ''}">
          <div><strong>1. Lee la legislación</strong><small>${unitIsRead(unit) ? 'Lectura marcada como completada.' : 'Abre las normas antes de contestar el test.'}</small></div>
          <div class="unit-law-links">${readingLaws.map(law => `<button class="unit-law-link" type="button" data-story-law="${escapeHtml(law.lawId)}">§ ${escapeHtml(law.title)}</button>`).join('')}</div>
          <button class="secondary" type="button" data-mark-unit-read="${escapeHtml(unit.id)}" ${unitIsUnlocked(unitIndex) && !unitIsRead(unit) ? '' : 'disabled'}>${unitIsRead(unit) ? 'Legislación leída' : 'He leído la legislación'}</button>
        </div>`
      : `<div class="unit-reading is-reference"><div><strong>Material de estudio</strong><small>Esta unidad es principalmente bibliográfica o técnica; no tiene una ley única que leer.</small></div></div>`;
    const finalAvailable = unitTopicsCompleted(unit) && unitQuestionCount(unit) > 0;
    const statusLabel = status === 'completed' ? 'Superada' : status === 'active' ? 'En curso' : 'Bloqueada';
    return `
      <article class="story-unit is-${status}">
        <button class="unit-toggle" data-toggle-unit="${escapeHtml(unit.id)}" aria-expanded="${expanded}">
          <span class="unit-order">${unitIndex + 1}</span>
          <span class="unit-title">
            <small>${escapeHtml(unit.weight.toFixed(2).replace('.', ','))} preguntas de cada 100 · ${statusLabel}</small>
            <strong>${escapeHtml(unit.title)}</strong>
            <span>${escapeHtml(unit.description)}</span>
          </span>
          <span class="unit-progress">${completedTopics}/${unit.topicIds.length}</span>
        </button>
        <div class="unit-body" ${expanded ? '' : 'hidden'}>
          ${readingBlock}
          <ol class="story-topics">${topics}</ol>
          <div class="unit-final">
            <div>
              <strong>Cuestionario final de la unidad</strong>
              <small>${state.progress.completedUnits.includes(unit.id) ? 'Unidad superada; puedes repetirlo.' : finalAvailable ? 'Todos los temas superados; prueba final disponible.' : 'Se desbloquea al superar todos los temas.'}</small>
            </div>
            <button
              class="secondary"
              data-unit-quiz="${escapeHtml(unit.id)}"
              ${finalAvailable ? '' : 'disabled'}
            >${state.progress.completedUnits.includes(unit.id) ? 'Repetir final' : 'Hacer final'}</button>
          </div>
        </div>
      </article>`;
  }).join('');

  document.querySelectorAll('[data-toggle-unit]').forEach(button => button.addEventListener('click', () => {
    const unitId = button.dataset.toggleUnit;
    if (state.expandedUnits.has(unitId)) state.expandedUnits.delete(unitId);
    else state.expandedUnits.add(unitId);
    renderStory();
  }));
  document.querySelectorAll('[data-story-topic]:not(:disabled)').forEach(button => button.addEventListener('click', () => {
    start('historia-tema', button.dataset.storyTopic, 'aleatorio', button.dataset.unitId);
  }));
  document.querySelectorAll('[data-story-law]').forEach(button => button.addEventListener('click', () => {
    openLawDocument(button.dataset.storyLaw, null, true);
  }));
  document.querySelectorAll('[data-mark-unit-read]:not(:disabled)').forEach(button => button.addEventListener('click', () => {
    if (!state.progress.readUnits.includes(button.dataset.markUnitRead)) state.progress.readUnits.push(button.dataset.markUnitRead);
    state.progress = progressStore.save(state.progress);
    renderStory();
  }));
  document.querySelectorAll('[data-unit-quiz]:not(:disabled)').forEach(button => button.addEventListener('click', () => {
    start('historia-unidad', button.dataset.unitQuiz, 'aleatorio', button.dataset.unitQuiz);
  }));
}

function announce(message) {
  const notice = $('#home-notice');
  notice.textContent = message;
  notice.hidden = !message;
}

function modeLabel() {
  if (state.mode === 'historia-tema') {
    const topic = state.content.topicsById[state.topicId];
    return `Historia · ${topicLabel(topic)}`;
  }
  if (state.mode === 'historia-unidad') {
    return `Historia · Final · ${state.content.unitsById[state.unitId].title}`;
  }
  if (state.mode === 'examen') {
    return state.examType === 'historico' ? 'Exámenes históricos oficiales' : 'Examen aleatorio';
  }
  if (state.mode === 'repaso') return 'Repaso inteligente';
  return 'Libre';
}

function resumeActiveSession() {
  const saved = state.progress.activeSession;
  if (!saved?.questionIds?.length) return;
  const questionById = Object.fromEntries(state.content.questions.map(question => [question.id, question]));
  const questions = saved.questionIds.map(id => questionById[id]).filter(Boolean);
  if (!questions.length || questions.length !== saved.questionIds.length) {
    clearActiveSession();
    announce('La sesión guardada ya no coincide con el banco actual y se ha descartado.');
    return;
  }
  state.mode = saved.mode;
  state.topicId = saved.topicId || null;
  state.unitId = saved.unitId || null;
  state.examType = saved.examType || 'aleatorio';
  state.questions = questions;
  state.responses = Array.isArray(saved.responses) ? saved.responses : [];
  state.sessionNotice = saved.sessionNotice || '';
  state.index = Math.min(Number(saved.index) || 0, questions.length - 1);
  state.correct = Number(saved.correct) || 0;
  state.answered = Number(saved.answered) || 0;
  state.blank = Number(saved.blank) || 0;
  $('#mode-label').textContent = modeLabel();
  renderQuestion();
  show('quiz');
}

function start(mode, targetId = null, examType = 'aleatorio', unitId = null) {
  state.mode = mode;
  state.topicId = mode === 'historia-tema' ? targetId : null;
  state.unitId = unitId;
  state.examType = examType;
  const sampled = mode === 'repaso'
    ? sampleReviewQuestions()
    : sampleQuestions(state.content, mode, targetId, examType);
  state.questions = sampled.questions;
  state.responses = [];
  state.sessionNotice = sampled.notice || '';
  state.index = 0;
  state.correct = 0;
  state.answered = 0;
  state.blank = 0;
  if (mode === 'examen' && sampled.blocked) {
    announce(`El simulacro parcial se desbloquea al alcanzar el 50 % de cobertura. Ahora hay ${Math.round((sampled.coverage || 0) * 100)} % con preguntas de cuatro opciones.`);
    show('home');
    return;
  }
  if (!state.questions.length || (mode === 'examen' && sampled.blocked)) {
    announce(mode === 'repaso'
      ? 'Todavia no hay preguntas para repasar. Responde algunas en Libre o Historia y marca las dudosas.'
      : mode === 'libre' || mode === 'examen'
      ? 'Todavía no hay preguntas activas para este modo. El examen histórico oficial sigue disponible como opción independiente.'
      : 'Este tema todavía no tiene cuestionario. Queda visible en el itinerario para completarlo cuando incorporemos su corpus.');
    show('home');
    return;
  }
  announce('');
  $('#mode-label').textContent = modeLabel();
  renderQuestion();
  persistActiveSession();
  show('quiz');
}

function renderQuestion() {
  const question = state.questions[state.index];
  const quizNotice = $('#quiz-notice');
  quizNotice.textContent = state.sessionNotice;
  quizNotice.hidden = !state.sessionNotice;
  $('#question-count').textContent = `${state.index + 1} / ${state.questions.length}`;
  const origin = $('#question-origin');
  if (question.origin) {
    origin.textContent = `${question.origin.label} · Pregunta ${question.origin.questionNumber} · material histórico de comparación`;
    origin.hidden = false;
  } else {
    origin.textContent = '';
    origin.hidden = true;
  }
  $('#question-text').textContent = question.prompt;
  $('#options').innerHTML = shuffledOptions(question.options)
    .map(option => `<button class="option" data-option="${escapeHtml(option.id)}">${escapeHtml(option.text)}</button>`)
    .join('');
  $('#feedback').hidden = true;
  $('#next').hidden = true;
  $('#blank').hidden = false;
  $('#options').classList.remove('answered');
  $('#options').querySelectorAll('[data-option]').forEach(button => {
    button.addEventListener('click', () => answer(button.dataset.option));
  });
  renderQuestionTools();
  if (state.responses[state.index]) applyResponse(state.responses[state.index]);
}

function renderFeedback(response) {
  const question = state.questions[state.index];
  if (response.blank) {
    $('#feedback').innerHTML = `<strong>En blanco</strong><p>${escapeHtml(question.explanation || '')}</p>`;
    $('#feedback').hidden = false;
    return;
  }
  const right = response.optionId === question.correctOptionId;
  const reference = question.origin ? `${question.origin.questionnaire} · página ${question.origin.page}` : question.source?.reference;
  const law = question.source ? state.content.lawsById[question.source.lawId] : null;
  const localSourceUrl = question.source?.file ? `data/${question.source.file}#${question.source.anchorId}` : null;
  const externalSourceLabel = question.source?.kind === 'referencia' ? 'Referencia externa' : 'Fuente oficial';
  let sourceLinks = law
    ? `<a href="data/laws/${escapeHtml(law.file)}#${escapeHtml(question.source.anchorId || '')}" data-law-id="${escapeHtml(question.source.lawId)}" data-law-anchor="${escapeHtml(question.source.anchorId || '')}">Ver ley</a>${question.source.url ? ` · <a href="${escapeHtml(question.source.url)}" target="_blank" rel="noreferrer">${externalSourceLabel}</a>` : ''}`
    : question.source?.url
      ? `${localSourceUrl ? `<a href="${escapeHtml(localSourceUrl)}" target="_blank" rel="noreferrer">Ver fuente</a> · ` : ''}<a href="${escapeHtml(question.source.url)}" target="_blank" rel="noreferrer">${externalSourceLabel}</a>`
      : '';
  if (question.origin?.questionnaire) sourceLinks = `<a href="${escapeHtml(question.origin.questionnaire)}" target="_blank" rel="noreferrer">Cuestionario oficial</a>${question.origin.answerKey ? ` · <a href="${escapeHtml(question.origin.answerKey)}" target="_blank" rel="noreferrer">Plantilla oficial</a>` : ''}`;
  const displayReference = question.origin ? `${question.origin.label || 'Examen oficial'} - pregunta ${question.origin.questionNumber || ''}` : reference;
  $('#feedback').innerHTML = `
    <strong>${right ? 'Correcto' : 'Revisa esta respuesta'}</strong>
    <p>${escapeHtml(question.explanation || '')}</p>
    ${displayReference ? `<small>${escapeHtml(displayReference)}${sourceLinks ? ` · ${sourceLinks}` : ''}</small>` : sourceLinks ? `<small>${sourceLinks}</small>` : ''}`;
  $('#feedback').hidden = false;
}

function applyResponse(response) {
  $('#options').classList.add('answered');
  $('#blank').hidden = true;
  $('#options').querySelectorAll('.option').forEach(button => {
    button.disabled = true;
    if (!response.blank && button.dataset.option === state.questions[state.index].correctOptionId) button.classList.add('correct');
    if (!response.blank && button.dataset.option === response.optionId && response.optionId !== state.questions[state.index].correctOptionId) button.classList.add('wrong');
  });
  renderFeedback(response);
  $('#next').hidden = false;
}

function answer(optionId) {
  if ($('#options').classList.contains('answered')) return;
  const question = state.questions[state.index];
  const right = optionId === question.correctOptionId;
  state.answered += 1;
  if (right) state.correct += 1;
  state.responses[state.index] = { questionId: question.id, optionId, blank: false, correct: right };
  recordQuestionResponse(question, state.responses[state.index]);
  applyResponse(state.responses[state.index]);
  persistActiveSession();
}

function blankAnswer() {
  if ($('#options').classList.contains('answered')) return;
  const question = state.questions[state.index];
  state.answered += 1;
  state.blank += 1;
  state.responses[state.index] = { questionId: question.id, optionId: null, blank: true, correct: false };
  recordQuestionResponse(question, state.responses[state.index]);
  applyResponse(state.responses[state.index]);
  persistActiveSession();
}

function finish() {
  const threshold = state.content.studyPlan.historyRules.passThreshold;
  const wrong = state.answered - state.correct - state.blank;
  const examConfig = state.content.examConfig.firstExercise;
  const isRandomExam = state.mode === 'examen' && state.examType !== 'historico';
  const points = isRandomExam
    ? examScore({ correct: state.correct, wrong, expectedQuestions: examConfig.questions, maximumPoints: examConfig.maximumPoints, penaltyFraction: penaltyFraction(examConfig.wrongAnswerPenalty) })
    : null;
  const accuracy = state.questions.length ? state.correct / state.questions.length : 0;
  const passed = state.mode.startsWith('historia')
    ? state.answered === state.questions.length && accuracy >= threshold
    : isRandomExam
      ? !state.sessionNotice && state.answered === state.questions.length && points >= examConfig.minimumPoints
      : true;
  let detail = '';

  if (state.mode === 'historia-tema' && passed && state.topicId) {
    if (!state.progress.completedTopics.includes(state.topicId)) {
      state.progress.completedTopics.push(state.topicId);
    }
    detail = 'Has desbloqueado el siguiente tema de esta unidad.';
  } else if (state.mode === 'historia-unidad' && passed && state.unitId) {
    if (!state.progress.completedUnits.includes(state.unitId)) {
      state.progress.completedUnits.push(state.unitId);
    }
    const unitIndex = orderedUnits().findIndex(unit => unit.id === state.unitId);
    detail = unitIndex + 1 < orderedUnits().length
      ? `Has desbloqueado la unidad ${unitIndex + 2}.`
      : 'Has completado todo el modo Historia.';
  } else if (state.mode.startsWith('historia')) {
    detail = `Necesitas al menos un ${Math.round(threshold * 100)} % y responder todas las preguntas para avanzar.`;
  }

  state.progress.answered += state.answered;
  state.progress.correct += state.correct;
  state.progress.incorrect += wrong;
  state.progress.currentTopicId = state.topicId;
  state.progress.currentUnitId = state.unitId;
  state.progress.lastMode = state.mode;
  state.progress.activeSession = null;
  state.progress = progressStore.save(state.progress);
  $('#result-title').textContent = passed ? 'Bloque superado' : 'Bloque para repasar';
  $('#result-summary').textContent = isRandomExam
    ? `${state.correct} aciertos, ${wrong} fallos y ${state.blank} en blanco. Puntuación: ${points.toFixed(2)} / ${examConfig.maximumPoints}.`
    : `${state.correct} aciertos de ${state.questions.length}.`;
  $('#result-detail').textContent = detail;
  $('#result-notice').textContent = state.sessionNotice;
  $('#result-notice').hidden = !state.sessionNotice;
  renderProgress();
  renderStory();
  show('result');
}

function returnHome() {
  document.querySelectorAll('.home-panel').forEach(panel => { panel.hidden = true; });
  renderStory();
  renderProgress();
  show('home');
}

function pauseSessionAndReturnHome() {
  persistActiveSession();
  announce('Sesión guardada. Puedes continuarla desde la portada.');
  returnHome();
}

function openHomePanel(panelId) {
  document.querySelectorAll('.home-panel').forEach(panel => { panel.hidden = panel.id !== panelId; });
  const panel = document.getElementById(panelId);
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderProgress() {
  $('#progress').textContent = `${state.progress.correct} aciertos · ${state.progress.completedUnits.length}/19 unidades`;
  renderResumeControl();
}

renderHomeMenu();
renderPracticalPanel();
document.querySelector('.app-header h1').textContent = 'M3 - Industrias culturales';

$('#start-free').addEventListener('click', () => start('libre'));
$('#start-exam').addEventListener('click', () => start('examen', null, $('#exam-type').value));
$('#auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  const email = $('#auth-email').value.trim().toLowerCase();
  const message = $('#auth-message');
  if (email !== allowedEmail) {
    message.textContent = 'Este correo no está autorizado para esta aplicación.';
    return;
  }
  message.textContent = 'Enviando el enlace de acceso…';
  try {
    await sendMagicLink(email);
    message.textContent = 'Enlace enviado. Revisa tu correo y vuelve a esta aplicación.';
  } catch (error) {
    message.textContent = `No se pudo enviar el enlace: ${error.message}`;
  }
});
$('#sign-out').addEventListener('click', async () => {
  await signOut();
});
$('#save-question').addEventListener('click', () => {
  const question = state.questions[state.index];
  if (question) toggleQuestionList('savedQuestionIds', question.id);
});
$('#doubt-question').addEventListener('click', () => {
  const question = state.questions[state.index];
  if (question) toggleQuestionList('doubtfulQuestionIds', question.id);
});
$('#resume-session').addEventListener('click', resumeActiveSession);
$('#discard-session').addEventListener('click', () => {
  clearActiveSession();
  announce('Sesión guardada descartada. El progreso acumulado se mantiene.');
});
$('#next').addEventListener('click', () => {
  if (state.index + 1 < state.questions.length) {
    state.index += 1;
    renderQuestion();
  } else finish();
});
$('#blank').addEventListener('click', blankAnswer);
$('#pause-session').addEventListener('click', pauseSessionAndReturnHome);
$('#back-home-result').addEventListener('click', returnHome);
$('#reset-progress').addEventListener('click', () => {
  state.progress = progressStore.reset();
  state.expandedUnits.clear();
  state.storyExpansionInitialized = false;
  announce('Progreso borrado.');
  renderProgress();
  renderStory();
});
$('#open-guide').addEventListener('click', () => openStudyDocument('readme'));
$('#close-guide').addEventListener('click', closeGuide);
$('#orientation-guide').addEventListener('click', event => {
  if (event.target === $('#orientation-guide')) closeGuide();
});
$('#study-category-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-study-category]');
  if (button) openStudyCategory(button.dataset.studyCategory);
});
$('#study-catalog-list').addEventListener('click', event => {
  const button = event.target.closest('[data-study-doc]');
  if (button) openStudyDocument(button.dataset.studyDoc);
});
document.addEventListener('click', event => {
  const lawLink = event.target.closest('a[data-law-id]');
  if (lawLink) {
    event.preventDefault();
    openLawReferenceModal(lawLink.dataset.lawId, lawLink.dataset.lawAnchor || null, lawLink);
    return;
  }
  const link = event.target.closest('a[href^="docs/"]');
  const documentItem = link && studyDocuments.find(item => item.file === link.getAttribute('href'));
  if (documentItem) {
    event.preventDefault();
    openStudyDocument(documentItem.id);
  }
});
$('#law-reference-close').addEventListener('click', closeLawReferenceModal);
$('#law-reference-modal').addEventListener('click', event => {
  if (event.target === $('#law-reference-modal')) closeLawReferenceModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#law-reference-modal').hidden) closeLawReferenceModal();
});
$('#back-home-study-catalog').addEventListener('click', returnHome);
$('#study-back-catalog').addEventListener('click', () => openStudyCategory(activeStudyCategory));
$('#back-home-study').addEventListener('click', returnHome);
$('#study-prev').addEventListener('click', navigateStudyDocument);
$('#study-prev-bottom').addEventListener('click', navigateStudyDocument);
$('#study-next').addEventListener('click', navigateStudyDocument);
$('#study-next-bottom').addEventListener('click', navigateStudyDocument);
$('#law-catalog-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-law-id]');
  if (button) openLawDocument(button.dataset.lawId);
});
$('#back-home-laws').addEventListener('click', returnHome);
$('#law-back-catalog').addEventListener('click', () => {
  if (lawReturnToStory) {
    lawReturnToStory = false;
    returnHome();
    openHomePanel('home-story');
  } else openLawCatalog();
});
$('#back-home-law').addEventListener('click', returnHome);
document.querySelectorAll('[data-home-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.homeAction;
  if (action === 'guide') openGuide();
  else if (action === 'readme') openStudyDocument('readme');
  else if (action === 'practico') openHomePanel('home-practical');
  else if (action === 'back') returnHome();
  else if (action === 'story') openHomePanel('home-story');
  else if (action === 'review') start('repaso');
  else if (action === 'laws') { renderLawCatalog(); openLawCatalog(); }
  else if (action === 'official') openHomePanel('home-official');
}));

Promise.all([loadContent(), initAuth()])
  .then(([content]) => {
    state.content = content;
    const appVersion = content.syllabus.app?.version || '0.0.0';
    $('#app-version').textContent = `v${appVersion}`;
    document.title = `M3 - Industrias culturales · v${appVersion}`;
    renderGuide();
    renderStudyLibrary();
    renderLawCatalog();
    renderStory();
    renderProgress();
    renderSessionUser();
    if (state.auth.user) show('home');
    else {
      if (state.auth.error) $('#auth-message').textContent = 'Necesitas iniciar sesión para sincronizar tu progreso.';
      show('auth');
    }
  })
  .catch(error => {
    $('#load-error').textContent = `No se pudo cargar el contenido: ${error.message}`;
    show('error');
  });
