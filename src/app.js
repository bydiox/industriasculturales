import { loadContent, sampleQuestions } from './questions.js';
import { progressStore } from './progress-store.js';

const state = {
  content: null,
  progress: progressStore.load(),
  mode: null,
  topicId: null,
  unitId: null,
  examType: 'aleatorio',
  questions: [],
  index: 0,
  correct: 0,
  answered: 0,
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

function topicIsUnlocked(unit, unitIndex, topicIndex) {
  if (!unitIsUnlocked(unitIndex)) return false;
  if (topicIndex === 0) return true;
  return state.progress.completedTopics.includes(unit.topicIds[topicIndex - 1]);
}

function topicQuestionCount(topicId) {
  return (state.content.byTopic[topicId] || [])
    .filter(question => question.origin?.historical !== true)
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
    return state.examType === 'historico' ? 'Examen histórico oficial 2021' : 'Examen aleatorio';
  }
  return 'Libre';
}

function start(mode, targetId = null, examType = 'aleatorio', unitId = null) {
  state.mode = mode;
  state.topicId = mode === 'historia-tema' ? targetId : null;
  state.unitId = unitId;
  state.examType = examType;
  state.questions = sampleQuestions(state.content, mode, targetId, examType);
  state.index = 0;
  state.correct = 0;
  state.answered = 0;
  if (!state.questions.length) {
    announce(mode === 'libre' || mode === 'examen'
      ? 'Todavía no hay preguntas activas para este modo. El examen histórico oficial sigue disponible como opción independiente.'
      : 'Este tema todavía no tiene cuestionario. Queda visible en el itinerario para completarlo cuando incorporemos su corpus.');
    show('home');
    return;
  }
  announce('');
  $('#mode-label').textContent = modeLabel();
  renderQuestion();
  show('quiz');
}

function renderQuestion() {
  const question = state.questions[state.index];
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
  $('#options').innerHTML = question.options
    .map(option => `<button class="option" data-option="${escapeHtml(option.id)}">${escapeHtml(option.text)}</button>`)
    .join('');
  $('#feedback').hidden = true;
  $('#next').hidden = true;
  $('#options').classList.remove('answered');
  $('#options').querySelectorAll('[data-option]').forEach(button => {
    button.addEventListener('click', () => answer(button.dataset.option));
  });
}

function answer(optionId) {
  const question = state.questions[state.index];
  if ($('#options').classList.contains('answered')) return;
  $('#options').classList.add('answered');
  const right = optionId === question.correctOptionId;
  state.answered += 1;
  if (right) state.correct += 1;
  $('#options').querySelectorAll('.option').forEach(button => {
    button.disabled = true;
    if (button.dataset.option === question.correctOptionId) button.classList.add('correct');
    if (button.dataset.option === optionId && !right) button.classList.add('wrong');
  });
  const reference = question.origin
    ? `${question.origin.questionnaire} · página ${question.origin.page}`
    : question.source?.reference;
  const law = question.source ? state.content.lawsById[question.source.lawId] : null;
  const localLawUrl = law ? `data/laws/${law.file}#${question.source.anchorId}` : null;
  const sourceLinks = localLawUrl
    ? `<a href="${escapeHtml(localLawUrl)}" target="_blank" rel="noreferrer">Ver ley</a>${question.source.url ? ` · <a href="${escapeHtml(question.source.url)}" target="_blank" rel="noreferrer">BOE</a>` : ''}`
    : '';
  $('#feedback').innerHTML = `
    <strong>${right ? 'Correcto' : 'Revisa esta respuesta'}</strong>
    <p>${escapeHtml(question.explanation || '')}</p>
    ${reference ? `<small>${escapeHtml(reference)}${sourceLinks ? ` · ${sourceLinks}` : ''}</small>` : sourceLinks ? `<small>${sourceLinks}</small>` : ''}`;
  $('#feedback').hidden = false;
  $('#next').hidden = false;
}

function finish() {
  const threshold = state.content.studyPlan.historyRules.passThreshold;
  const score = state.questions.length ? state.correct / state.questions.length : 0;
  const passed = state.answered === state.questions.length && score >= threshold;
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
  state.progress.incorrect += state.answered - state.correct;
  state.progress.currentTopicId = state.topicId;
  state.progress.currentUnitId = state.unitId;
  state.progress.lastMode = state.mode;
  state.progress = progressStore.save(state.progress);
  $('#result-title').textContent = passed ? 'Bloque superado' : 'Bloque para repasar';
  $('#result-summary').textContent = `${state.correct} aciertos de ${state.questions.length}.`;
  $('#result-detail').textContent = detail;
  renderProgress();
  renderStory();
  show('result');
}

function returnHome() {
  renderStory();
  renderProgress();
  show('home');
}

function renderProgress() {
  $('#progress').textContent = `${state.progress.correct} aciertos · ${state.progress.completedUnits.length}/19 unidades`;
}

$('#start-free').addEventListener('click', () => start('libre'));
$('#start-exam').addEventListener('click', () => start('examen', null, $('#exam-type').value));
$('#next').addEventListener('click', () => {
  if (state.index + 1 < state.questions.length) {
    state.index += 1;
    renderQuestion();
  } else finish();
});
$('#back-home-quiz').addEventListener('click', returnHome);
$('#back-home-result').addEventListener('click', returnHome);
$('#reset-progress').addEventListener('click', () => {
  state.progress = progressStore.reset();
  state.expandedUnits.clear();
  state.storyExpansionInitialized = false;
  announce('Progreso borrado.');
  renderProgress();
  renderStory();
});
$('#open-guide').addEventListener('click', openGuide);
$('#close-guide').addEventListener('click', closeGuide);
$('#orientation-guide').addEventListener('click', event => {
  if (event.target === $('#orientation-guide')) closeGuide();
});

loadContent()
  .then(content => {
    state.content = content;
    renderGuide();
    renderStory();
    renderProgress();
    show('home');
  })
  .catch(error => {
    $('#load-error').textContent = `No se pudo cargar el contenido: ${error.message}`;
    show('error');
  });
