import { loadContent, sampleQuestions } from './questions.js';
import { examScore, penaltyFraction } from './scoring.js';
import { progressStore } from './progress-store.js';

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

async function openStudyDocument(documentId) {
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
    $('#study-page-content').scrollTop = 0;
    window.scrollTo(0, 0);
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

async function openLawDocument(lawId, anchorId = null, fromStory = false) {
  const law = state.content.lawsById?.[lawId];
  if (!law) return;
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

$('#start-free').addEventListener('click', () => start('libre'));
$('#start-exam').addEventListener('click', () => start('examen', null, $('#exam-type').value));
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
    openLawDocument(lawLink.dataset.lawId, lawLink.dataset.lawAnchor || null);
    return;
  }
  const link = event.target.closest('a[href^="docs/"]');
  const documentItem = link && studyDocuments.find(item => item.file === link.getAttribute('href'));
  if (documentItem) {
    event.preventDefault();
    openStudyDocument(documentItem.id);
  }
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
  if (action === 'readme') openStudyDocument('readme');
  else if (action === 'practico') openStudyCategory('practico');
  else if (action === 'story') openHomePanel('home-story');
  else if (action === 'review') start('repaso');
  else if (action === 'laws') { renderLawCatalog(); openLawCatalog(); }
  else if (action === 'official') openHomePanel('home-official');
}));

loadContent()
  .then(content => {
    state.content = content;
    const appVersion = content.syllabus.app?.version || '0.0.0';
    $('#app-version').textContent = `v${appVersion}`;
    document.title = `${content.syllabus.app?.name || 'M3'} · v${appVersion}`;
    renderGuide();
    renderStudyLibrary();
    renderLawCatalog();
    renderStory();
    renderProgress();
    show('home');
  })
  .catch(error => {
    $('#load-error').textContent = `No se pudo cargar el contenido: ${error.message}`;
    show('error');
  });
